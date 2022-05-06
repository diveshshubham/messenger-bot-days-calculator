require("dotenv").config();
const request = require('request')
const response = require('../messageActions/messageActions')

let postWebhook = async (req, res) => {
    let body = req.body;
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            if (entry.messaging) {
                let webhook_event = entry.messaging[0];
                // Get the sender PSID
                let sender_psid = webhook_event.sender.id;
                // Check if the event is a message or postback and
                // pass the event to the appropriate handler function
                if (webhook_event.message) {
                    handleMessage(sender_psid, webhook_event);
                } else if (webhook_event.postback) {
                    handlePostback(sender_psid, webhook_event);
                }
            }
            else {
                console.log("do nothing")
            }
        });
        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }

}

//handleMessage Function for recieving message from bot
function handleMessage(sender_psid, data) {
    let finalRes;
    if (data.message.text) {
        let mgs = data.message.text
        finalRes = response.response(mgs, data)
    }
    callSendAPI(sender_psid, finalRes);
}

// callsendAPI function to send message to messanger
function callSendAPI(sender_psid, finalRes) {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": finalRes
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function handlePostback(sender_psid, data) {
    let finalRes;

    // Get the payload for the postback
    let payload = data.postback.payload;
    //console.log(payload, "kk")
    finalRes = response.response(payload, data)
    if (Array.isArray(finalRes)) {
        for (let i = 0; i < finalRes.length; i++) {
            callSendAPI(sender_psid, finalRes[i])
        }
    } else {
        callSendAPI(sender_psid, finalRes);
    }
}

module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook
}