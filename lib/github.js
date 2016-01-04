var Github = require("github");
var Promisify = require("./promisify");

var methods = [
  "events",
  "gists",
  "gitdata",
  "gitignore",
  "issues",
  "markdown",
  "misc",
  "orgs",
  "pullRequests",
  "releases",
  "repos",
  "search",
  "statuses",
  "user"
];

module.exports = function() {
  var github = new Github({
    version: "3.0.0",
    debug: true
  });

  github.authenticate({
    type: "oauth",
    token: process.env.GITHUB_TOKEN
  });

  return Promisify(github, methods);
}
