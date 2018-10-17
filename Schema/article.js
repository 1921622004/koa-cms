const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

module.exports = new Schema({
    id:ObjectId,
    aid:Number,
    title:String,
    description:String,
    add_time:{
        type:Date,
        default:Date.now
    }
})