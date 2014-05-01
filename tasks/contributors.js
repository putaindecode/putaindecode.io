var cache = require("./cache/contributors")
  , fs = require("fs")
  , path = require("path")
  , gutil = require("gulp-util")
  , async = require("async")
  , Promise = require("promise")
  , bs64 = require("bs64")
  // , bs64 = false
  , convertString = require("convert-string")
  , exec = Promise.denodeify(require("child_process").exec)
  , glob = Promise.denodeify(require("glob"))
  , commitsRE = /^(\d+)/
  , emailRE = /<(.+)>$/
  , readFile = Promise.denodeify(fs.readFile)
  , writeFile = Promise.denodeify(fs.writeFile)
  , lodash = require("lodash")
  , githubApi = new (require("github"))({
      version : "3.0.0"
    })

  , contributorsMap = function(){
      var authors = {}
      return glob("authors/*.json")
      .then(function(files){
        files.forEach(function(authorFile){
          authors[path.basename(authorFile, ".json")] = require("../" + authorFile)
        })
      })
      .then(function(){
        return readFile("tasks/cache/contributors.cache", {encoding : "utf8"})
      })
      .then(function(contributors){
        // grab contributors cache (base64ified just to do not have unserialized public emails)
        if(bs64){
          contributors = convertString.UTF8.bytesToString(bs64.decode(contributors))
        }
        // console.log(contributors)
        cache.value = JSON.parse(contributors)
      }, function(){
        cache.value.mapByEmail = {}
        cache.value.map = {}
      })

      .then(function(){
        return exec("git log --pretty=format:'%ae::%an' | sort | uniq")
      })

      .then(function(stdout){
          var newUsers = []
          , loginCache = {}

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
          return Promise.resolve()
        }

        return new Promise(function(resolve){
          var parallelsUser = []
          newUsers.forEach(function(author){
            parallelsUser.push(function(cb){
              var email = author.email
              exec("git log --max-count=1 --pretty=format:%H --author=" + email)
              .then(function(stdout){
                return Promise.denodeify(githubApi.repos.getCommit)({
                  "user" : "putaindecode",
                  "repo" : "website",
                  "sha" : stdout
                })
              })
              .then(function(contributor){
                if(!contributor || !contributor.author){
                  throw "Missing author key from GitHub API response"
                }

                if(loginCache[contributor.author.login]){
                  gutil.log("contributor cached", contributor.author.login)
                  return Promise.resolve(loginCache[contributor.author.login])
                }
                else{
                  return Promise.denodeify(githubApi.user.getFrom)({"user" : contributor.author.login})
                  .then(function(githubUser){
                    loginCache[githubUser.login] = {
                      // see what's available here https://developer.github.com/v3/users/
                      login : githubUser.login,
                      name : githubUser.name,
                      gravatar_id : githubUser.gravatar_id,
                      url : githubUser.blog ? githubUser.blog.indexOf("http") === 0 ? githubUser.blog : "http://" + githubUser.blog : undefined,
                      location : githubUser.location,
                      hireable : githubUser.hireable
                    }
                    gutil.log("new contributor: ", githubUser.login)
                    return loginCache[githubUser.login]
                  })
                }
              })
              .done(function(contributor){
                cache.value.mapByEmail[email] = contributor
                cb() //async done
              })
            })
          })

          async.parallelLimit(parallelsUser, 50, function(){
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
        var contributors = JSON.stringify(cache.value, true)
        if(bs64){
          contributors = bs64.encode(contributors)
        }
        gutil.log("Contributors cache updated")
        return writeFile("tasks/cache/contributors.cache", contributors)
      })
    }

  , totalContributions = function(){
      cache.value.contributions = {}
      // why ? < /dev/tty
      // git shortlog thinks that it has to read something from stdin, hence the indefinite wait.
      return exec("git shortlog --summary --numbered --email < /dev/tty")
      .then(function(stdout){
        stdout
          .trim("\n")
          .split("\n")
          .forEach(function(line){
            line = line.trim()
            var login = cache.value.mapByEmail[line.match(emailRE)[1]].login
              , contributions = parseInt(line.match(commitsRE)[1], 10)
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

  , filesContributions = function(){
      // files contributions
      cache.value.files = {}
      return glob("pages/**/*")
      .then(function(files){
        return new Promise(function(resolve){
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
          async.parallelLimit(parallelFiles, 50, function(){
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
  cache.value = {}

  contributorsMap()
  .then(totalContributions)
  .then(filesContributions)
  .done(function(){ cb() }, function(err){ cb(err) })
}
