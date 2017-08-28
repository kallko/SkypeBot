"use strict";

const request = require('request');
let access_token = '';

request.post(
  'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  { form: { grant_type: 'client_credentials',
    client_id: 'dee264d7-39bc-4de1-a1e4-1fa453060463',
    client_secret: 'mwVeMS1sBCkesyrasCYpdU2',
    scope: 'https://graph.microsoft.com/.default'
  }},
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      access_token = JSON.parse(body).access_token;
    } else {
      access_token = '';
    }
    sendMessage(access_token);
  }
);

function sendMessage(access_token) {
  request.post({
    headers: {'Authorization': "Bearer " + access_token},
    //url: 'https://apis.skype.com/v2/conversations/29:10_Yzm__XJBpVOQcNp6m--UBI1OTv5WEKO2IXcNxscTA/activities',
    //url: 'https://apis.skype.com/v2/conversations/19:658db94a97ad41298c372710a18344ce@thread.skype/activities',
    //url: 'https://apis.skype.com/v2/conversations/19:I3Vudm9vZG9vLyRjOTJiYjU5NzZiODMwOWJl@p2p.thread.skype/activities',
    url: 'https://apis.skype.com/v2/conversations/19:9d914c5c83414da48c705d3a22336d54@thread.skype/activities',
    form: JSON.stringify({ message: { content: 'чекаво' }})
  }, function (error, response, body) {
    if (error) {
      console.lol("error: " + error);
    }
    console.log(body);
    //console.log(response);
    //console.log(body);
  });
}