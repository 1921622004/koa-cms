const mongoose = require('mongoose');
const Schema = mongoose.Types;
const ObjectId = Schema.ObjectId;
const userSchema = require('./user');
mongoose.connect('mongodb://localhost/cms');

const db = mongoose.connection;
db.on('open', () => {
  console.log('connected ===============');
});

const User = mongoose.model('cms', userSchema);

class UserDAO {
  async queryUser(condition,callback) {
    let list = await User.find(condition).lean().exec();
    return list
  }
  async updateUser(condition, json) {
    try {
      let res = await User.updateOne(condition, {
        $set: json
      }).exec();
      return res
    } catch (e) {}
  }
  async insertOne(json) {
    const newDoc = await User.create(json);
    const addRes = await newDoc.save((err, a) => {});
    return addRes
  }
  async deleteOne(id) {
    const toDeleteDoc = await User.findById(id);
    if (toDeleteDoc) {
      const deleteRes = await toDeleteDoc.remove();
      return deleteRes
    } else {
      return false
    }
  }
  async findById(id) {
    const curM = await User.findById(id);
    if(curM) return curM;
  }
}

module.exports = {
  userSchema,
  UserDAO: new UserDAO(),
  ObjectId
}