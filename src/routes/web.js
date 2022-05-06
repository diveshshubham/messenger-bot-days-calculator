const express = require('express');
const homepageController = require('../controllers/homepageControllers');
const chatBotController = require('../controllers/chatBotController');
const messageDataController = require('../controllers/messageDataController')
const isValidApiKey = require('../middleware/apiKey/apiKey')

let router = express.Router();

let initWebRoutes = (app)=> {

    //home page
    router.get("/", homepageController.getHomepage);
    //get webhook
    router.get("/webhook", chatBotController.getWebhook);
    //post webhook 
    router.post("/webhook", chatBotController.postWebhook);
    //get all messages
    router.get("/messages", messageDataController.getAllMessages);
    //get message by id
    router.get("/messages/:messagePsid",messageDataController.getMessageById);
    //summary for all user's chat
    router.get("/summary",messageDataController.getSummary);

    return app.use("/", router);
};

module.exports = initWebRoutes;
