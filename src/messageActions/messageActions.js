const gretting = ["hi", "hey", "hello", "hola", "namastey", "asalam walekum", "whats up", "yo"]
const accept = ["yes", "yeah", "yup","ya"]
const deny = ["no", "not now", "later", "nah"]
const regex = /[@#$%^&*()_+\=\[\]{};':"\\|.<>\/?1234567890]/g;
const saveData = require('../services/queryService/queryService')
const dayCalculator = require('../services/calculator/calculator')

// get response messages as per user's request
module.exports = {
    response: (res, data) => {

        let response;

        //when user starts conversation saving it's details and sending further response
        if (gretting.includes(res.toLowerCase())) {
            saveData.messageHandler(data, res)
            saveData.userHandler(data.sender.id, null)
            response =
            {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Hello! Can I know your first name and date of birth 🎂 ? ",
                            "subtitle": "Tap a button to answer.",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Yes",
                                    "payload": "yesStep1",
                                },
                                {
                                    "type": "postback",
                                    "title": "No",
                                    "payload": "deny",
                                }
                            ],
                        }]

                    }
                }
            }
        }

        //when user answer the first question from the quick reply button (Yes)
        else if (res == "yesStep1") {
            let title = "Awesome! Do you want to know how many days are left for you next 🎂 BIG BIRTHDAY ? 🥳 🥳"
            let content = "yes (user is willing to enter name and DOB)"
            saveData.messageHandler(data, content)
            response =
            {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": title,
                            "subtitle": "Tap a button to answer.",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Yes",
                                    "payload": "yesStep2",
                                },
                                {
                                    "type": "postback",
                                    "title": "No",
                                    "payload": "deny",
                                }
                            ],
                        }]
                    }
                }
            }
        }

          //when user answer the second question from the quick reply button (Yes)
        else if (res == "yesStep2") {
            let text = "Enter your first name and Date of 🎂 Birth (eg: Shubham, 1998-05-15 YYYY-MM-DD format )"
            let content = "yes (Anwswer for Entering name and DOB)"
            saveData.messageHandler(data, content)
            response = { "text": text }
        }

        //when user enters his name and DOB (Shubham, 1998-09-97) no validation has been done assuming 
        //format to be YYYY-MM-DD
        else if (res.split(',').length == 2) {
            saveData.userHandler(data.sender.id, res.split(','))
            saveData.messageHandler(data, res)
            let days = dayCalculator.dayCalculator(res.split(',')[1])
            let title = "Wow ! "+res.split(',')[0]+", There are " + days + " days left for your next birthday 🎈 🎈"
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": title,
                            "subtitle": "Tap Thank You button.",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Thank You 😃 ",
                                    "payload": "exit",
                                }
                            ],
                        }]
                    }
                }
            }
        }

        //when user got their answer (number of days) and said thank you and sending user wishes in advance
        else if (res == "exit") {
            let content = "Thank You :-)"
            saveData.messageHandler(data, content)
            let text = "Happy Birthday in advance ;-) "
            response = { "text": text }
        }

        //when user denies in with any text in deny array the saying user good bye
        else if ((res == "deny") || (deny.includes(res.toLowerCase()))) {
            saveData.messageHandler(data, res)
            response = { "text": "good bye 👋 " }
        }

        //if bot doesn't understand anything then sending him response
        else if (regex.test(res)) {
            saveData.messageHandler(data, res)
            response = { "text": "Hey! I will be trained soon to talk to you... :-) " }
        }

           //if user enters yes, yeah etc
           else if (accept.includes(res.toLowerCase())) {
            saveData.messageHandler(data, res)
            response = { "text":"Enter your first name and Date of Birth (eg: Shubham, 1998-05-15 YYYY-MM-DD format )" }
        }

        else {
            response = { "text": "Hey! Do you want to know number of days left before your next birthday 🥳 🥳 " }
        }

        return response

    }
}
