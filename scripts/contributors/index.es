import fs from "fs"
import path from "path"

import color from "chalk"
import async from "async"
import PromisePolyfill from "promise"
import lodash from "lodash"
import GithubApi from "github"

import logger from "../utils/logger"

const exec = PromisePolyfill.denodeify(require("child_process").exec)
const glob = PromisePolyfill.denodeify(require("glob"))
const readFile = PromisePolyfill.denodeify(fs.readFile)
const writeFile = PromisePolyfill.denodeify(fs.writeFile)

const log = logger("contributors")

const githubApi = new GithubApi({version: "3.0.0"})

const commitsRE = /^(\d+)/
const emailRE = /<(.+)>$/

const authorsFiles = "content/authors/*.json"
const contributorsFile = "contributors.json"

let results = {}

function sortObjectByKeys(obj){
  var newObj = {}
  var keys = Object.keys(obj)
  keys.sort()
  keys.forEach(function(key){
    newObj[key] = obj[key]
  })

  return newObj
}

function contributorsMap(){
  var authors = {}
  return glob(authorsFiles)
  .then((files) => {
    files.forEach(function(authorFile){
      authors[path.basename(authorFile, ".json")] = require("../../" + authorFile)
    })
  })
  .then(() => {
    return readFile(contributorsFile, {encoding: "utf-8"})
  })
  .then((contributors) => {
    results = JSON.parse(contributors)
  }, function(err) {
    log(color.red("⚠︎ No contributors.json or malformed content"))
    console.error(err)
    results.mapByEmail = {}
    results.map = {}
  })

  .then(() => {
    return exec("git log --pretty=format:%ae::%an | sort | uniq")
  })

  .then((stdout) => {
    var newUsers = []
    var loginCache = {}

    // update contributorsMap
    stdout
      .trim("\n")
      .split("\n")
      .forEach(function(line){
        var author = line.split("::")
        if(
          !results.mapByEmail[author[0]] ||
          !Object.keys(results.mapByEmail[author[0]]).length
        ) {
          newUsers.push({
            email: author[0],
            name: author[1],
          })
        }
      })

    // only for dev & testing
    // githubApi.authenticate({
    //     type: "basic",
    //     username: "xxx",
    //     password: "xxx"
    // })

    // consolidate contributorsMap
    // => add github username at the end of each line
    // to retrieve a author login, we just grab a commit from the author email
    // and we use github api to get this commit info (& so found github username)

    // all contributors are in cache
    if(newUsers.length === 0){
      return PromisePolyfill.resolve()
    }

    return new PromisePolyfill(function(resolve){
      var parallelsUser = []
      newUsers.forEach(function(author){
        parallelsUser.push(function(cb){
          var email = author.email
          exec("git log --max-count=1 --pretty=format:%H --author=" + email)
          .then((out) => {
            // @todo get user/repo from git origin
            return PromisePolyfill.denodeify(githubApi.repos.getCommit)({
              user: "putaindecode",
              repo: "putaindecode.fr",
              sha: out,
            })
          })
          .then((contributor) => {
            if(contributor && contributor.author){
              if(loginCache[contributor.author.login]){
                log("Contributor cached", contributor.author.login)
                return PromisePolyfill.resolve(loginCache[contributor.author.login])
              }
              else{
                return PromisePolyfill.denodeify(githubApi.user.getFrom)({user: contributor.author.login})
                .then((githubUser) => {
                  loginCache[githubUser.login] = {
                    // see what's available here https://developer.github.com/v3/users/
                    login: githubUser.login,
                    name: githubUser.name,
                    avatar_url: githubUser.avatar_url,
                    gravatar_id: githubUser.gravatar_id,
                    url: githubUser.blog ? githubUser.blog.indexOf("http") === 0 ? githubUser.blog: "http://" + githubUser.blog: undefined,
                    location: githubUser.location,
                    hireable: githubUser.hireable,
                  }
                  log("New contributor: ", githubUser.login)
                  return loginCache[githubUser.login]
                })
              }
            }
            else {
              // @todo get user/repo from git origin
              log("✗ Unable to get contributor information for " + author.name + " <" + author.email + "> (no commit in putaindecode/putaindecode.fr)")
              return {}
            }
          }, function(err) {
            if (err.toString().indexOf("ENOTFOUND") > -1) {
              log(color.red("⚠︎ Cannot connect to GitHub for " + email))
            }
            return {}
          })
          .done(function(contributor) {
            if (contributor) {
              if (!Object.keys(contributor).length) {
                log(color.red(`⚠︎ Some contributor data are emtpy for ${email}`))
              }
              else {
                results.mapByEmail[email] = contributor
              }
            }
            cb() // async done
          })
        })
      })

      async.parallelLimit(parallelsUser, 20, function(){
        // map by login, not email
        results.map = lodash.transform(results.mapByEmail, function(result, author){
          if(!result[author.login]){
            result[author.login] = author
          }
        })
        resolve()
      })
    })
  })
  .then(() => {
    // always update map with values
    results.map = lodash.merge(results.map, authors)

    // sort
    results.map = sortObjectByKeys(results.map)
    results.mapByEmail = sortObjectByKeys(results.mapByEmail)

    var contributors = JSON.stringify(results, true, 2)
    log("✓ Contributors cache updated")
    return writeFile(contributorsFile, contributors)
  })
}

function totalContributions() {
  results.contributions = {}

  // Get the first commit sha
  return exec("git log --reverse --pretty=format:%H|head -1")
  .then((sha) => {
    // Get all contributor since first commit
    return exec(`git shortlog --no-merges --summary --numbered --email ${sha.trim()}..HEAD`)
  })
  .then((stdout) => {
    stdout
      .trim("\n")
      .split("\n")
      .forEach(function(line){
        line = line.trim()
        var login = results.mapByEmail[line.match(emailRE)[1]].login
        var contributions = parseInt(line.match(commitsRE)[1], 10)
        if(!results.contributions[login]){
          results.contributions[login] = contributions
        }
        else{
          results.contributions[login] += contributions
        }
      })
  })
  .then(() => {
    log("✓ Top contributions done")
  })
}

function filesContributions() {
  // files contributions
  results.files = {}
  return glob("content/**/*")
  .then((files) => {
    return new PromisePolyfill(function(resolve){
      var parallelFiles = []
      files.forEach(function(file){
        parallelFiles.push(function(cb){
          return exec("git log --pretty=short --follow " + file + " | git shortlog --summary --numbered --no-merges --email")
          .then((stdout) => {
            if(stdout){
              results.files[file] = {}
              stdout
                .trim("\n")
                .split("\n")
                .forEach(function(line){
                  line = line.trim()
                  results.files[file][results.mapByEmail[line.match(emailRE)[1]].login] = line.match(commitsRE)[1]
                })
            }
          }, function(stderr){
            console.error(stderr)
            throw stderr
          })
          .done(cb)
        })
      })
      async.parallelLimit(parallelFiles, 20, function(){
        log("✓ Contributions per files done")
        resolve()
      })
    })
  })
}


/**
 * contributors tasks
 *
 * reads all pages & create a contributors list
 * in `tasks/cache/contributors`
 */
module.exports = function(cb){
  if(Object.keys(results)>1){
    cb()
    return
  }

  results = {}

  contributorsMap()
  .then(totalContributions)
  .then(filesContributions)
  .done(() => cb(null, results), (err) => cb(err))
}
