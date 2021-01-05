const mongoose = require('mongoose');

var EmailSchema = new mongoose.Schema({
    subject:{
        type:String
    },
    text:{
        type:String
    },
    email_id:{
        type: String
    },
    timeToSend:{
        type:String
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
});

var EmailID = module.exports = mongoose.model('EmailID',EmailSchema);