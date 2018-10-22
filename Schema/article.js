const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
module.exports = new Schema({
    id:ObjectId,
    title: String,
    description: String,
    keyword: String,
    pid:String,
    add_time:{
        type:Date,
        default:Date.now
    }
})