var _ = require("lodash");
var Github = require("../lib/github")();

var org = "Prismatik";
var types = "direct_message,direct_mention,mention";

exports.messages = function(slackbot) {
  slackbot.hears("^(?=.*?(show))(?=.*?(prs)).*$", types, exports.list);
  slackbot.hears("^(?=.*?(I\'ll))(?=.*?(grab)).*$", types, exports.assign);
}

exports.list = (bot, message) => {
  bot.reply(message, "No problem. I'll find all *open* PRs for you.");

  Github.repos.getFromOrg({ org: org })
    .then(repos => {
      Promise.all(getPRs(repos, org))
        .then(prs => {
          var reply = formatPRs(_.pluck(repos, "name"), _.flatten(prs));
          bot.reply(message, reply);
        });
    });
}

exports.assign = (bot, message) => {
  var pr = /\#(\d+)/gm.exec(message.text);

  if (!pr) return bot.reply(message, "Which PR do you want to review?");
  else pr = pr[1];

  var slackUser = res.bot.api.users.info({
    token: process.env.SLACKBOT_TOKEN,
    user: res.message.user
  });
  var githubUser = Github.user.get({});

  Promise.all([slackUser, githubUser])
    .then(users => {
      if (users[0].user.real_name !== users[1].name) return;

      Github.issues.edit(_.assign({}, repo, {number: pr, assignee: users[1].login}))
        .then(() => {
          bot.reply(message, "Great, thanks " + users[0].user.profile.first_name + ". I've assigned you to PR #" + pr + ".");
        });
    });
}

function formatPR(item, repo) {
  return "#" + item.number + " - " + item.title + " (" + repo + ")\n";
}

function formatPRs(repos, prs) {
  return prs.reduce((str, item) => {
    if (!item.assignee) {
      str += formatPR(item, _.find(repos, name => item.url.indexOf(name) >= 0));
    }
    return str;
  }, "");
}

function getPRs(repos, org) {
  return repos.map(repo => {
    return Github.pullRequests.getAll({
      user: org,
      repo: repo.name,
      state: "open"
    });
  });
}
