"use strict";

const messages = require('./messages');
const restify = require('restify');
const builder = require('botbuilder');
const schedule = require('node-schedule');
const mysql = require('mysql');
//=========================================================
// Bot Setup
//=========================================================
// Setup Restify Server
const server = restify.createServer();
let botSession = false;
server.listen(process.env.port || process.env.PORT || 8080, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// Redmine

function remind() {
  console.log('РЕДМАЙН');
  if (botSession) {
    const connection = mysql.createConnection(
      {
        host     : '192.168.2.16',
        user     : 'redmine',
        password : 'yaJEvaB6Te',
        database : 'redmine',
      }
    );

    connection.connect();

    let userIds = '';
    let queryString = 'select id, firstname, lastname  from users u '+
      'where exists (select * from custom_values cv where cv.customized_id=u.id AND cv.customized_type="Principal"  and  cv.value="CeboTeam")';
    connection.query(queryString, function(err, rows, fields) {
      if (err) throw err;
      for (var i in rows) {
        userIds += rows[i].id + ',';
      }
      console.log(userIds);
      let queryString = 'select firstname, lastname  from users u ' +
        'where u.id in ('+userIds+'49)' +
        ' AND not exists (select * from time_entries te where te.user_id = u.id and (spent_on between NOW() - INTERVAL 1 DAY AND  NOW() ))';
      console.log(queryString);

      connection.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        let s = '';
        for (var i in rows) {
          s += rows[i].firstname + ' ' + rows[i].lastname + ', заполни редмайн' + "<br/>\n";
        }
        if (s) {
          botSession.send('Ребятки');
          botSession.send(s);
        }
      });

      connection.end();
    });
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create chat bot
const connector = new builder.ChatConnector({
  appId: "dee264d7-39bc-4de1-a1e4-1fa453060463",
  appPassword: "mwVeMS1sBCkesyrasCYpdU2"
});
const bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

//var schedule1 = schedule.scheduleJob('* * * * 5', function(){
const schedule1 = schedule.scheduleJob('0 15-20 * * 5', function() {
  remind();
});
/*
 var schedule1 = schedule.scheduleJob('* * * * 5', function(){
 remind();
 });*/
const schedule2 = schedule.scheduleJob('0 15-20 * 15,30,31 *', function() {
  remind();
});
//Bot on
bot.on('contactRelationUpdate', function (message) {
  console.log(message);
  if (message.action === 'add') {
    const name = message.user ? message.user.name : null;
    const reply = new builder.Message()
      .address(message.address)
      .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
    session.send(reply);
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

bot.dialog('/', function (session) {
  botSession = session;
  console.log(session);
  console.log(session.message.text.toLowerCase());

  //redmine
  for (let i = 0; i < messages.redminePhrases; i++) {
    if (session.message.text.toLowerCase().endsWith(messages.redminePhrases[i])) {
      const answer = remind();
      return session.send(answer);
    }
  }

  //check existing phrases
  for (let i = 0, phrases = Object.keys(messages.phrases); i < phrases.length; i++) {
    if (session.message.text.toLowerCase().endsWith(phrases[i])) {
      const answer = messages.phrases[phrases[i]];
      return session.send(answer);
    }
  }

  //generate random answer
  const i = getRandomInt(0, messages.randomAnswers.length - 1);
  session.send(messages.randomAnswers[i]);
});

module.exports = {
  remind
};