// Import mongoose database Connection
// MESSAGE MODEL
const db = require('../connection/connection');
const Schema = db.mongoose.Schema;

const messageSchema = new Schema({
    'PSID': {
        type: String,
        required: true
    },
    'content': {
        type: String,  // unique
        required: true
    },
    'messageId': {
        type: String,  // unique
        //required: true
    },
    'timestamp': {
        type: String,  // unique
        //required: true
    },
    'recipient': {
        type: String,  // unique
        //required: true
    },
    'updatedAt': {
        type: Date,
        default: Date.now
    }
});

const messageModel = db.mongoose.model('messageModel', messageSchema, 'message');
module.exports = messageModel;
