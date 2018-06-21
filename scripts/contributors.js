import fs from "fs";
import path from "path";

import color from "chalk";
import { denodeify as asyncify } from "promise";
import pLimit from "p-limit";

import GithubApi from "@octokit/rest";

import logger from "nano-logger";

const spawn = require("child_process").spawn;
const exec = asyncify(require("child_process").exec);
const glob = asyncify(require("glob"));

const readFile = asyncify(fs.readFile);
const writeFile = asyncify(fs.writeFile);

const topContribMonths = 6;
const authorsFiles = "content/authors/*.json";
const contributorsFile = "cache/contributors.json";

// const debug = console.log;
const debug = () => {};

const githubApi = new GithubApi({
  version: "3.0.0",
  headers: {
    "user-agent": "putaindecode",
  },
});

// @todo get user/repo from git origin
const repoMetas = {
  owner: "putaindecode",
  repo: "putaindecode.io",
};

const commitsRE = /^(\d+)/;
const emailRE = /<(.+)>$/;

const log = logger("contributors");

const logError = msg => {
  // fail only on travis, since this one is deploying the website
  // if (process.env.TRAVIS) {
  //  throw new Error(msg);
  // }
  log(color.red(msg));
};

let githubIsDown = false;
function isGithubDown(err) {
  if (err.toString().indexOf("getaddrinfo ENOTFOUND") > -1) {
    if (!githubIsDown) {
      githubIsDown = true;
      log(color.red("⚠︎ Cannot reach GitHub API. Are you offline?"));
    }
  } else {
    throw err;
  }
}
let results = {};

function sortObjectByKeys(obj) {
  const newObj = {};
  const keys = Object.keys(obj);
  keys.sort();
  keys.forEach(function(key) {
    newObj[key] = obj[key];
  });

  return newObj;
}

async function getContributorFromGitHub(username) {
  try {
    const { data: githubUser } = await githubApi.users.getForUser({ username });
    // log("New contributor:", githubUser.login);
    return {
      // see what's available here
      // https://developer.github.com/v3/users/
      login: githubUser.login,
      name: githubUser.name,
      avatar_url: githubUser.avatar_url,
      url: githubUser.blog
        ? githubUser.blog.indexOf("http") === 0
          ? githubUser.blog
          : "http://" + githubUser.blog
        : undefined,
      location: githubUser.location,
      hireable: githubUser.hireable,
    };
  } catch (err) {
    if (err.code === 404) {
      log("Fail for ", username, ". Username has probably been updated.");
    } else isGithubDown(err);
    return {
      login: username,
      name: username,
    };
  }
}

async function contributorsMap() {
  const loginCache = {};

  const files = await glob(authorsFiles);
  log("✓ Authors json parsed");
  await Promise.all(
    files.map(async jsonAuthorFile => {
      const author = path.basename(jsonAuthorFile, ".json");

      // get author right now if not in cache
      // even if they didn't commit anything yet
      if (!results.map[author]) {
        log("- Author not cached", author);
        results.map[author] = await getContributorFromGitHub(author);
      }

      results.map[author] = {
        // default minimal values
        login: author,
        name: author,
        ...results.map[author],
        ...require("../" + jsonAuthorFile),
      };
      loginCache[author] = results.map[author];
    }),
  );

  // log("loginCache", loginCache);

  const stdout = await exec(
    "git log --use-mailmap --pretty=format:%aE::%an | sort | uniq",
  );
  log("- Git log done");

  const newUsers = [];

  // update contributorsMap
  stdout
    .trim("\n")
    .split("\n")
    .forEach(line => {
      const author = line.split("::");
      if (!results.mapByEmail[author[0]]) {
        newUsers.push({
          email: author[0],
          name: author[1],
        });
      }
    });

  // Consolidate contributorsMap
  // => add github username at the end of each line.
  // To retrieve a author login, we just grab a commit from the author email
  // and we use github api to get this commit info
  // (& so we found github username)

  // get new contributors
  if (newUsers.length > 0) {
    log(`- ${newUsers.length} new users`);

    for (const author of newUsers) {
      const email = author.email;
      log("Request user information from GitHub for", email);
      const out = await exec(
        "git log --max-count=1 --pretty=format:%H --author=" + email,
      );
      // log("- New contibutor update in progress", email, out);
      let contributor;
      try {
        const contributorCommit = await githubApi.repos.getCommit({
          ...repoMetas,
          sha: out,
        });

        // log("contributorCommit", contributorCommit);
        if (
          contributorCommit &&
          contributorCommit.data &&
          contributorCommit.data.author
        ) {
          const author = contributorCommit.data.author;
          if (loginCache[author.login]) {
            contributor = loginCache[author.login];
            log("Contributor already in cache", author.login);
          } else {
            contributor = await getContributorFromGitHub(author.login);
            loginCache[author.login] = contributor;
            log("Contributor added to cache", author.login);
          }
        } else {
          logError(
            "✗ Unable to get contributor information for " +
              author.name +
              " <" +
              author.email +
              `> (no commit in ${repoMetas.owner}/${repoMetas.repo})`,
          );
        }

        // log("contributor", contributor);

        if (contributor) {
          if (!Object.keys(contributor).length) {
            logError(`⚠︎ Some contributor data are emtpy for ${email}`);
          } else {
            results.mapByEmail[email] = contributor.login;
            if (!results.map[contributor.login]) {
              results.map[contributor.login] = contributor;
            }
            log("New contributor added in map", contributor.login);
          }
        }
      } catch (err) {
        if (err.toString().indexOf('"Not Found"') > -1) {
          logError("⚠︎ Cannot connect to GitHub for " + email);
        } else {
          setTimeout(() => {
            isGithubDown(err);
          }, 1);
        }
      }
    }
    log("✓ Sequential updates done");
  }

  // sort
  results.map = sortObjectByKeys(results.map);
  results.mapByEmail = sortObjectByKeys(results.mapByEmail);
}

async function totalContributions() {
  results.contributions = {};

  // Get the first commit sha
  const sha = await exec("git log --reverse --pretty=format:%H|head -1");
  // Get all contributor since first commit
  const stdout = await exec(
    `git shortlog --no-merges --summary --numbered --email ` +
      `${sha.trim()}..HEAD`,
  );

  debug("totalContributions", "\n", stdout);

  stdout
    .trim("\n")
    .split("\n")
    .forEach(function(line) {
      line = line.trim();
      const login = results.mapByEmail[line.match(emailRE)[1]];
      const contributions = parseInt(line.match(commitsRE)[1], 10);
      if (!results.contributions[login]) {
        results.contributions[login] = contributions;
      } else {
        results.contributions[login] += contributions;
      }
    });

  return true;
}

async function filesContributions() {
  // files contributions
  results.files = {};
  const files = await glob("content/**/*");
  const limit = pLimit(5);

  const pmises = files.map(async file =>
    limit(async () => {
      const stdout = await exec(
        "git log --pretty=short --follow " +
          file +
          " | git shortlog --summary --numbered --no-merges --email",
      );

      // debug("filesContributions", file, "\n", stdout);

      if (stdout) {
        results.files[file] = {};
        stdout
          .trim("\n")
          .split("\n")
          .forEach(line => {
            line = line.trim();
            const login = results.mapByEmail[line.match(emailRE)[1]];
            results.files[file][login] =
              (results.files[file][login] || 0) +
              parseInt(line.match(commitsRE)[1], 10);
          });
      }
    }),
  );

  await Promise.all(pmises);
}

(async function() {
  if (Object.keys(results) > 1) {
    log("✓ Contributors list already generated");
  } else {
    try {
      const contributors = await readFile(contributorsFile, {
        encoding: "utf-8",
      });
      results = JSON.parse(contributors);
      log("✓ contributors.json parsed");
    } catch (err) {
      log(color.red("⚠︎ No contributors.json or malformed content"));
      log(color.red(err.toString()));
      results.map = {};
      results.mapByEmail = {};
    }

    const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!githubToken && Object.keys(results.map).length === 0) {
      logError(
        color.yellow(
          "In order to generate a new `contributors.json` map, " +
            "you will need a GitHub token available as an environement variable. ",
        ),
      );
      log(
        color.yellow(
          "Please be sure to get one in GITHUB_TOKEN or GH_TOKEN variables. " +
            "\nThis will be require to get full features of the website that " +
            "concern contributors.",
        ),
      );
      log(
        color.yellow(
          "Visit https://github.com/settings/tokens/new to generate a token, " +
            "then you can put it in a file in your home and source it like this: ",
        ),
      );
      log(
        color.yellow(
          "if [[ -f $HOME/.github_token ]]\n" +
            "then\n" +
            "  export GITHUB_TOKEN=$(cat $HOME/.github_token)\n" +
            "fi\n",
        ),
      );
    }

    if (githubToken) {
      githubApi.authenticate({
        type: "oauth",
        token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
      });

      await contributorsMap();
      log("✓ Contributors cache updated");

      await totalContributions();
      log("✓ Total contributions done");

      await filesContributions();
      log("✓ Contributions per files done");
    }

    if (!githubIsDown) {
      await writeFile(contributorsFile, JSON.stringify(results, true, 2));
    }
  }

  return results;
})().catch(console.log);
