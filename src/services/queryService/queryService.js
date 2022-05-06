const userModel = require('../../databaseConfig/models/userModel')
const messageModel = require('../../databaseConfig/models/messagesModel')
module.exports = {

    //To save user's message to db
    messageHandler: async (data, content) => {
        try {
            let messageId;
            if (data.message) {
                messageId = data.message.mid
            } else
                if (data.postback) {
                    messageId = data.postback.mid
                }
            const PSID = data.sender.id
            const timestamp = data.timestamp
            const recipient = data.recipient.id

            let newMessage = new messageModel({
                PSID: PSID,
                content: content,
                messageId: messageId,
                timestamp: timestamp,
                recipient: recipient
            })
            await newMessage.save()
        } catch (err) {
            console.log(err)
        }
    },

    //to save and update user's details to db
    userHandler: async (PSID, data) => {
        try {
            let checkUser = await userModel.findOne({ PSID: PSID })
            if (data) {
                const userName = data[0]
                const DOB = data[1]
                await userModel.updateOne(
                    { PSID: PSID }, { $set: { userName: userName, DOB: DOB } }
                )
            } else if (!checkUser) {
                let newUser = new userModel({
                    PSID: PSID,
                })
                await newUser.save()
            } else if (data && checkUser) {
                const userName = data[0]
                const DOB = data[1]
                let newUser = new userModel({
                    PSID: PSID,
                    userName: userName,
                    DOB: DOB
                })
                await newUser.save()
            }
        } catch (err) {
            console.log(err)
        }
    },

    //to retrieve user's all messages andsummary
    getMessage: async () => {
        try {
            let message = await userModel.aggregate(
                [
                    {
                        '$lookup': {
                            'from': 'message',
                            'localField': 'PSID',
                            'foreignField': 'PSID',
                            'as': 'messages'
                        }
                    }
                ]
            )
            console.log(message)
            return message
        } catch (err) {
            console.log(err)
        }
    },

    //to get message by id
    getMessageById: async (PSID) => {
        try {
            let message = await userModel.aggregate(
                [
                    {
                        '$match': {
                            'PSID': '' + PSID + ''
                        }
                    }, {
                        '$lookup': {
                            'from': 'message',
                            'localField': 'PSID',
                            'foreignField': 'PSID',
                            'as': 'messages'
                        }
                    }
                ]
            )
            return message
        } catch (err) {
            console.log(err)
        }
    }

}
