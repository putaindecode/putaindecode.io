var cache = require("./cache/contributors")
var fs = require("fs")
var path = require("path")
var gutil = require("gulp-util")
var async = require("async")
var PromisePolyfill = require("promise")
var exec = PromisePolyfill.denodeify(require("child_process").exec)
var glob = PromisePolyfill.denodeify(require("glob"))
var commitsRE = /^(\d+)/
var emailRE = /<(.+)>$/
var readFile = PromisePolyfill.denodeify(fs.readFile)
var writeFile = PromisePolyfill.denodeify(fs.writeFile)
var lodash = require("lodash")
var githubApi = new (require("github"))({version : "3.0.0"})

var sortObjectByKeys = function(obj){
  var newObj = {}
  var keys = Object.keys(obj)
  keys.sort()
  keys.forEach(function(key){
    newObj[key] = obj[key]
  })

  return newObj
}

var contributorsMap = function(){
  var authors = {}
  return glob("src/authors/*.json")
  .then(function(files){
    files.forEach(function(authorFile){
      authors[path.basename(authorFile, ".json")] = require("../" + authorFile)
    })
  })
  .then(function(){
    return readFile("tasks/cache/contributors.cache", {encoding : "utf8"})
  })
  .then(function(contributors){
    cache.value = JSON.parse(contributors)
  }, function(){
    cache.value.mapByEmail = {}
    cache.value.map = {}
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
        if(!cache.value.mapByEmail[author[0]]){
          newUsers.push({
            email : author[0],
            name : author[1]
          })
        }
      })

    // only for dev & testing
    // var username = "xxx", password = "xxx"
    // githubApi.authenticate({
    //     type : "basic",
    //     username : username,
    //     password : password
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
          .then(function(stdout){
            // @todo get user/repo from git origin
            return PromisePolyfill.denodeify(githubApi.repos.getCommit)({
              user : "putaindecode",
              repo : "putaindecode.fr",
              sha : stdout
            })
          })
          .then(function(contributor){
            if(contributor && contributor.author){
              if(loginCache[contributor.author.login]){
                gutil.log("contributor cached", contributor.author.login)
                return PromisePolyfill.resolve(loginCache[contributor.author.login])
              }
              else{
                return PromisePolyfill.denodeify(githubApi.user.getFrom)({user : contributor.author.login})
                .then(function(githubUser){
                  loginCache[githubUser.login] = {
                    // see what's available here https://developer.github.com/v3/users/
                    login : githubUser.login,
                    name : githubUser.name,
                    avatar_url : githubUser.avatar_url,
                    gravatar_id : githubUser.gravatar_id,
                    url : githubUser.blog ? githubUser.blog.indexOf("http") === 0 ? githubUser.blog : "http://" + githubUser.blog : undefined,
                    location : githubUser.location,
                    hireable : githubUser.hireable
                  }
                  gutil.log("new contributor: ", githubUser.login)
                  return loginCache[githubUser.login]
                })
              }
            }
            else {
              // @todo get user/repo from git origin
              gutil.log("Unable to get contributor information for " + author.name + " <" + author.email + "> (no commit in putaindecode/putaindecode.fr)")
              return {}
            }

          })
          .done(function(contributor){
            cache.value.mapByEmail[email] = contributor
            cb() // async done
          })
        })
      })

      async.parallelLimit(parallelsUser, 20, function(){
        // map by login, not email
        cache.value.map = lodash.transform(cache.value.mapByEmail, function(result, author){
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
    cache.value.map = lodash.merge(cache.value.map, authors)

    // sort
    cache.value.map = sortObjectByKeys(cache.value.map)
    cache.value.mapByEmail = sortObjectByKeys(cache.value.mapByEmail)

    var contributors = JSON.stringify(cache.value, true, 2)
    gutil.log("Contributors cache updated")
    return writeFile("tasks/cache/contributors.cache", contributors)
  })
}

var totalContributions = function(){
  cache.value.contributions = {}
  // Get the first  commit sha
  var cmd1 = "git log --reverse --pretty=format:%H|head -1"
  // Get all contributor since ${FIRST_COMMIT}
  var cmd2 = "git shortlog --summary --numbered --email ${FIRST_COMMIT}..HEAD"

  return exec(cmd1)
  .then(function(sha){
    return exec(cmd2.replace(/\${FIRST_COMMIT}/, sha.trim()))
  })
  .then(function(stdout){
    stdout
      .trim("\n")
      .split("\n")
      .forEach(function(line){
        line = line.trim()
        var login = cache.value.mapByEmail[line.match(emailRE)[1]].login
        var contributions = parseInt(line.match(commitsRE)[1], 10)
        if(!cache.value.contributions[login]){
          cache.value.contributions[login] = contributions
        }
        else{
          cache.value.contributions[login] += contributions
        }
      })
  })
  .then(function(){
    // console.log(cache.value.top)
    gutil.log("Total contributions cached")
  })
}

var filesContributions = function(){
  // files contributions
  cache.value.files = {}
  return glob("src/pages/**/*")
  .then(function(files){
    return new PromisePolyfill(function(resolve){
      var parallelFiles = []
      files.forEach(function(file){
        parallelFiles.push(function(cb){
          return exec("git log --pretty=short --follow " + file + " | git shortlog --summary --numbered --no-merges --email")
          .then(function(stdout){
            if(stdout){
              cache.value.files[file] = {}
              stdout
                .trim("\n")
                .split("\n")
                .forEach(function(line){
                  line = line.trim()
                  cache.value.files[file][cache.value.mapByEmail[line.match(emailRE)[1]].login] = line.match(commitsRE)[1]
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
        // console.log(cache.value.files)
        gutil.log("Contributions map for files done")
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
  if(cache.value !== null){
    cb()
    return
  }

  cache.value = {}

  contributorsMap()
  .then(totalContributions)
  .then(filesContributions)
  .done(function(){ cb() }, function(err){ cb(err) })
}
