// Import mongoose database Connection
//USER MODEL
const db = require('../connection/connection');
const Schema = db.mongoose.Schema;

const userSchema = new Schema({
    'userName': {
        type: String,
        default : "someUser"
    },
    'PSID': {
        type: String,  // unique
        required: true
    },
    'DOB': {
        type: String,  // unique
        default: "2022-02-22 (this is default when user exits tha app before knowing number of days"},
    'createdAt': {
        type: Date,
        default: Date.now
    }
});

const userModel = db.mongoose.model('userModel', userSchema, 'user');
module.exports = userModel;
