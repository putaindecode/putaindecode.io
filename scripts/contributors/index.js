import fs from "fs"
import path from "path"

import color from "chalk"
import { denodeify as asyncify } from "promise"

import GithubApi from "github"

import logger from "nano-logger"

const exec = asyncify(require("child_process").exec)
const glob = asyncify(require("glob"))
const readFile = asyncify(fs.readFile)
const writeFile = asyncify(fs.writeFile)

//

const authorsFiles = "content/authors/*.json"
const contributorsFile = "contributors.json"

const githubApi = new GithubApi({
  version: "3.0.0",
  headers: {
    "user-agent": "putaindecode",
  },
})

if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
  githubApi.authenticate({
    type: "oauth",
    token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
  })
}
else if (Object.keys(results.map).length === 0) {
  throw new Error(
    "In order to generate a new `contributors.json` map," +
    "you will need a GitHub token available as an environement variable." +
    "Please be sure to get one in GITHUB_TOKEN or GH_TOKEN variables."
  )
//   githubApi.authenticate({
//     type: "basic",
//     username: "xxx",
//     password: "xxx",
//   })
}

// @todo get user/repo from git origin
const repoMetas = {
  user: "putaindecode",
  repo: "putaindecode.fr",
}

const commitsRE = /^(\d+)/
const emailRE = /<(.+)>$/

const log = logger("contributors")

let results = {}

function sortObjectByKeys(obj) {
  const newObj = {}
  const keys = Object.keys(obj)
  keys.sort()
  keys.forEach(function(key) {
    newObj[key] = obj[key]
  })

  return newObj
}

async function getContributorFromGitHub(user) {
  const githubUser = await asyncify(githubApi.user.getFrom)({ user })
  log("New contributor:", githubUser.login)
  return {
    // see what's available here
    // https://developer.github.com/v3/users/
    login: githubUser.login,
    name: githubUser.name,
    avatar_url: githubUser.avatar_url,
    url:
      githubUser.blog
      ? githubUser.blog.indexOf("http") === 0
        ? githubUser.blog
        : "http://" + githubUser.blog
      : undefined,
    location: githubUser.location,
    hireable: githubUser.hireable,
  }
}

async function contributorsMap() {
  const loginCache = {}

  const files = await glob(authorsFiles)
  log("✓ Authors json parsed")
  await* files.map(async (jsonAuthorFile) => {
    const author = path.basename(jsonAuthorFile, ".json")

    // get author right now if not in cache
    // even if they didn't commit anything yet
    if (!results.map[author]) {
      log("- Author not cached", author)
      results.map[author] = await getContributorFromGitHub(author)
    }

    results.map[author] = {
      // default minimal values
      login: author,
      name: author,
      ...results.map[author],
      ...require("../../" + jsonAuthorFile),
    }
    loginCache[author] = results.map[author]
  })

  const stdout = await exec("git log --pretty=format:%ae::%an | sort | uniq")
  log("- Git log done")

  const newUsers = []

  // update contributorsMap
  stdout
    .trim("\n")
    .split("\n")
    .forEach((line) => {
      const author = line.split("::")
      if (!results.mapByEmail[author[0]]) {
        newUsers.push({
          email: author[0],
          name: author[1],
        })
      }
    })

  // Consolidate contributorsMap
  // => add github username at the end of each line.
  // To retrieve a author login, we just grab a commit from the author email
  // and we use github api to get this commit info
  // (& so we found github username)

  // get new contributors
  if (newUsers.length > 0) {
    log(`- ${ newUsers.length } new users`)

    await* newUsers.map(async (author) => {
      const email = author.email
      log("Request user information from GitHub for", email)
      const out = await exec(
        "git log --max-count=1 --pretty=format:%H --author=" + email
      )
      // log("- New contibutor update in progress", email)
      let contributor
      try {
        const contributorCommit = await asyncify(githubApi.repos.getCommit)({
          ...repoMetas,
          sha: out,
        })

        if (contributorCommit && contributorCommit.author) {
          if (loginCache[contributorCommit.author.login]) {
            contributor = loginCache[contributorCommit.author.login]
            log(
              "Contributor already in cache",
              contributorCommit.author.login
            )
          }
          else {
            contributor =
              await getContributorFromGitHub(contributorCommit.author.login)
            loginCache[contributorCommit.author.login] = contributor
            log("Contributor added to cache", contributorCommit.author.login)
          }
        }
        else {
          log(
            "✗ Unable to get contributor information for " +
            author.name + " <" + author.email +
            `> (no commit in ${ repoMetas.user }/${ repoMetas.repo })`
          )
        }

        if (contributor) {
          if (!Object.keys(contributor).length) {
            log(
              color.red(`⚠︎ Some contributor data are emtpy for ${email}`)
            )
          }
          else {
            results.mapByEmail[email] = contributor.login
            if (!results.map[contributor.login]) {
              results.map[contributor.login] = contributor
            }
            log("New contributor added in map", contributor.login)
          }
        }
      }
      catch (err) {
        if (err.toString().indexOf("\Not Found\"") > -1) {
          log(color.red("⚠︎ Cannot connect to GitHub for " + email))
        }
        else {
          // not sure why I need to do this to get exception throw
          // await/async should handle that :(
          setTimeout(() => {
            console.error("Unhandled error from GitHub API")
            throw err
          }, 1)
        }
      }
    })

    log("✓ Parallel updates done")
  }

  // sort
  results.map = sortObjectByKeys(results.map)
  results.mapByEmail = sortObjectByKeys(results.mapByEmail)
}

async function totalContributions() {
  results.contributions = {}

  // Get the first commit sha
  const sha = await exec("git log --reverse --pretty=format:%H|head -1")
  // Get all contributor since first commit
  const stdout = await exec(
    `git shortlog --no-merges --summary --numbered --email ` +
    `${sha.trim()}..HEAD`
  )

  // // get contributions for the last 6 months
  // const since = new Date()
  // since.setMonth(since.getMonth() - 12)
  // const stdout = await exec(
  //   `git shortlog --no-merges --summary --numbered --email ` +
  //   `--since ${ since.toISOString() }`
  // )

  stdout
    .trim("\n")
    .split("\n")
    .forEach(function(line) {
      line = line.trim()
      const login = results.mapByEmail[line.match(emailRE)[1]]
      const contributions = parseInt(line.match(commitsRE)[1], 10)
      if (!results.contributions[login]) {
        results.contributions[login] = contributions
      }
      else {
        results.contributions[login] += contributions
      }
    })

  return true
}

async function filesContributions() {
  // files contributions
  results.files = {}
  const files = await glob("content/**/*")

  await* files.map(async (file) => {
    const stdout = await exec(
      "git log --pretty=short --follow " + file +
        " | git shortlog --summary --numbered --no-merges --email"
    )

    if (stdout) {
      results.files[file] = {}
      stdout
        .trim("\n")
        .split("\n")
        .forEach((line) => {
          line = line.trim()
          const login = results.mapByEmail[line.match(emailRE)[1]]
          results.files[file][login] = line.match(commitsRE)[1]
        })
    }
  })
}

export default async function() {
  if (Object.keys(results) > 1) {
    log("✓ Contributors list already generated")
  }
  else {
    try {
      const contributors = await readFile(
        contributorsFile,
        { encoding: "utf-8" }
      )
      results = JSON.parse(contributors)
      log("✓ contributors.json parsed")
    }
    catch (err) {
      log(color.red("⚠︎ No contributors.json or malformed content"))
      console.error(err)
      results.map = {}
      results.mapByEmail = {}
    }

    await contributorsMap()
    log("✓ Contributors cache updated")

    await totalContributions()
    log("✓ Top contributions done")

    await filesContributions()
    log("✓ Contributions per files done")

    await writeFile(contributorsFile, JSON.stringify(results, true, 2))
  }

  return results
}
