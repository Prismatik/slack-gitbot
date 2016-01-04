var _ = require("lodash");
var Slackbot = require("./lib/slackbot");

Slackbot.slackbot.spawn({
  token: process.env.SLACKBOT_TOKEN,
}).startRTM();

_.invoke([
  require("./controllers/pull_requests")
], "messages", Slackbot);
