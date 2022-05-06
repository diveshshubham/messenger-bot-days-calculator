const queryService = require('../services/queryService/queryService')


/**
  * This API used to get all messages of user for both who has requested for nuber of days or not
  * @param {Object} req
  * @param {Object} res
  */
let getAllMessages = async (req, res) => {
    let messageJson = {}
    let finalDataArray = []

    let queryData = await queryService.getMessage()
    queryData.forEach((element) => {
        messageJson.userName = element.userName,
            messageJson.message = element.messages
        finalDataArray.push(messageJson)
    })

    res.send({ message: "success", finalRes: finalDataArray })
};

/**
   * This API used to get all messages of user for both who has requested for nuber of days or not by user's PSID
   * @param {Object} req
   * @param {Object} res
   */
let getMessageById = async (req, res) => {
    let messageJson = {}
    let finalDataArray = []

    let queryData = await queryService.getMessageById(req.params.messagePsid)
    queryData.forEach((element) => {
        messageJson.userName = element.userName,
            messageJson.PSID = element.PSID,
            messageJson.message = element.messages
        finalDataArray.push(messageJson)
    })

    res.send({ message: "success", finalRes: queryData })
};

/**
   * This API used to get all messages with their names and PSID
   * @param {Object} req
   * @param {Object} res
   */
let getSummary = async (req, res) => {
    let messageJson = {}
    let finalDataArray = []

    let queryData = await queryService.getMessage()
    queryData.forEach((element) => {
        messageJson.user = element.PSID,
            messageJson.name = element.userName,
            messageJson.DOB = element.DOB
        messageJson.message = element.messages
        finalDataArray.push(messageJson)
    })

    res.send({ message: "success", finalRes: finalDataArray })
};


module.exports = {
    getAllMessages: getAllMessages,
    getMessageById: getMessageById,
    getSummary: getSummary
};