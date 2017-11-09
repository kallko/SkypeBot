"use strict";

const request = require('request');

const SendMessage = require("./sendMessage");
const TimeOuts = require("./timeOuts");


module.exports = {
  authorize
};

function authorize() {
  let access_token = '';

  request.post(
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    {
      form: {
        grant_type: 'client_credentials',
        client_id: '*****',
        client_secret: '*****',
        scope: 'https://graph.microsoft.com/.default'
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        access_token = JSON.parse(body).access_token;
      } else {
        access_token = '';
      }

      const message = TimeOuts.initTimeouts(access_token, true);
      //todo remove comment to start hello message
      //SendMessage.send(access_token, message);
      console.log("___", message);
    }
  );
}


