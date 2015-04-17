var fs = require("fs")
var path = require("path")

var async = require("async")
var PromisePolyfill = require("promise")
var exec = PromisePolyfill.denodeify(require("child_process").exec)
var glob = PromisePolyfill.denodeify(require("glob"))
var readFile = PromisePolyfill.denodeify(fs.readFile)
var writeFile = PromisePolyfill.denodeify(fs.writeFile)
var lodash = require("lodash")
var githubApi = new (require("github"))({version: "3.0.0"})

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
  .then(function(files){
    files.forEach(function(authorFile){
      authors[path.basename(authorFile, ".json")] = require("../../" + authorFile)
    })
  })
  .then(function(){
    return readFile(contributorsFile, {encoding: "utf-8"})
  })
  .then(function(contributors){
    results = JSON.parse(contributors)
  }, function(err) {
    console.warn("⚠︎ No contributors.json")
    console.error(err)
    results.mapByEmail = {}
    results.map = {}
  })

  .then(function(){
    return exec("git log --pretty=format:%ae::%an | sort | uniq")
  })

  .then(function(stdout){
    var newUsers = []
    var loginCache = {}

    // update contributorsMap
    stdout
      .trim("\n")
      .split("\n")
      .forEach(function(line){
        var author = line.split("::")
        if(!results.mapByEmail[author[0]]){
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
          .then(function(out){
            // @todo get user/repo from git origin
            return PromisePolyfill.denodeify(githubApi.repos.getCommit)({
              user: "putaindecode",
              repo: "putaindecode.fr",
              sha: out,
            })
          })
          .then(function(contributor){
            if(contributor && contributor.author){
              if(loginCache[contributor.author.login]){
                console.log("- Contributor cached", contributor.author.login)
                return PromisePolyfill.resolve(loginCache[contributor.author.login])
              }
              else{
                return PromisePolyfill.denodeify(githubApi.user.getFrom)({user: contributor.author.login})
                .then(function(githubUser){
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
                  console.log("- New contributor: ", githubUser.login)
                  return loginCache[githubUser.login]
                })
              }
            }
            else {
              // @todo get user/repo from git origin
              console.log("✗ Unable to get contributor information for " + author.name + " <" + author.email + "> (no commit in putaindecode/putaindecode.fr)")
              return {}
            }
          }, function(err) {
            if (err.toString().indexOf("ENOTFOUND") > -1) {
              console.warn("⚠︎ Cannot connect to GitHub for " + email)
            }
            return {}
          })
          .done(function(contributor) {
            if (contributor) {
              results.mapByEmail[email] = contributor
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
  .then(function(){
    // always update map with values
    results.map = lodash.merge(results.map, authors)

    // sort
    results.map = sortObjectByKeys(results.map)
    results.mapByEmail = sortObjectByKeys(results.mapByEmail)

    var contributors = JSON.stringify(results, true, 2)
    console.log("✓ Contributors cache updated")
    return writeFile(contributorsFile, contributors)
  })
}

function totalContributions() {
  results.contributions = {}

  // Get the first commit sha
  return exec("git log --reverse --pretty=format:%H|head -1")
  .then(function(sha){
    // Get all contributor since first commit
    return exec(`git shortlog --no-merges --summary --numbered --email ${sha.trim()}..HEAD`)
  })
  .then(function(stdout){
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
  .then(function(){
    console.log(results.contributions)
    console.log("✓ Top contributions done")
  })
}

function filesContributions() {
  // files contributions
  results.files = {}
  return glob("content/**/*")
  .then(function(files){
    return new PromisePolyfill(function(resolve){
      var parallelFiles = []
      files.forEach(function(file){
        parallelFiles.push(function(cb){
          return exec("git log --pretty=short --follow " + file + " | git shortlog --summary --numbered --no-merges --email")
          .then(function(stdout){
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
        // console.log(results.files)
        console.log("✓ Contributions per files done")
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
