"use strict";

const messages = require('./messages');
const restify = require('restify');
const builder = require('botbuilder');
const schedule = require('node-schedule');
const mysql = require('mysql');
const report = require('./reportDayActivity');
//=========================================================
// Bot Setup
//=========================================================
// Setup Restify Server
const server = restify.createServer();
let botSession = false;
server.listen(process.env.port || process.env.PORT || 8091, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// Redmine

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create chat bot
const connector = new builder.ChatConnector({
  appId: "**********",
  appPassword: "*******"
});

server.post('/api/messages', connector.listen());

const bot = new builder.UniversalBot(connector);


//Bot on
bot.on('contactRelationUpdate', function (message) {
  console.log(message);
  if (message.action === 'add') {
    const name = message.user ? message.user.name : null;
    const reply = new builder.Message()
      .address(message.address)
      .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
    //session.send(reply);
  } else {
    // delete their data
  }
});
bot.on('typing', function (message) {
  // User is typing
});

bot.on('deleteUserData', function (message) {
  // User asked to delete their data
});

//=========================================================
// Bots Dialogs
//=========================================================


bot.on('receive', function (message) {
  //receive message
});


bot.on('incoming', function (message) {
    //incoming message
});

bot.dialog('/', function (session, result) {

  botSession = session;
  console.log(session.message.text.toLowerCase());


  //redmine
  for (let i = 0; i < messages.redminePhrases; i++) {
    if (session.message.text.toLowerCase().endsWith(messages.redminePhrases[i])) {
      const answer = report.remindRedmain(botSession);
      //return session.send(answer);
    }
  }

  //check existing phrases
  for (let i = 0, phrases = Object.keys(messages.phrases); i < phrases.length; i++) {
    if (session.message.text.toLowerCase().endsWith(phrases[i])) {
      const answer = messages.phrases[phrases[i]];
      //return session.send(answer);
    }
  }

  //generate random answer
  const i = getRandomInt(0, messages.randomAnswers.length - 1);
  //session.send(messages.randomAnswers[i]);
});


// module.exports = {
//   remind
// };