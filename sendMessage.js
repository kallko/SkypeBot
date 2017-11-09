const request = require('request');


class SendMessage {
    static send (access_token, messageText) {


        messageText = messageText || "Empty text";


        request.post({
            headers: {'Authorization': "Bearer " + access_token},
            //url: 'https://*****',
            //url: 'https://****',
            //url: 'https://****',
            url: 'https://***',
            form: JSON.stringify({ message: { content: messageText }})
        }, function (error, response, body) {
            if (error) {
                console.log("error: " + error);
            }
            //console.log(response);
            //console.log(body);
        });
    }
};


module.exports = SendMessage;