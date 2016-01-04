var Botkit = require("botkit");
var _ = require("lodash");
var Promisify = require("./promisify");

var slackbot = Botkit.slackbot({ debug: false });

var methods = [
  "channels",
  "chat",
  "emoji",
  "files",
  "groups",
  "im",
  "reactions",
  "rtm",
  "search",
  "stars",
  "team",
  "users"
];

exports.slackbot = slackbot;

exports.hears = (patterns, types, action) => {
  return new Promise(resolve => {
    slackbot.hears(patterns, types, (bot, message) => {
      var modBot = _.assign({}, bot, {api: Promisify(bot.api, methods)});
      resolve(_.spread(action)([modBot, message]));
    });
  });
};
