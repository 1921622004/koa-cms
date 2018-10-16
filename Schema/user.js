const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

module.exports = new Schema({
    id:ObjectId,
    userName:String,
    password:String,
    status:Number,
    lastLoginTime:String
})