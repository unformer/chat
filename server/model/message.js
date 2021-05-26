const mongoose = require('mongoose')

// модель сообщения
const messageSchema = new mongoose.Schema({
    roomId: String,
    userId: String,
    messageId: String,
    msg: {}
})

const Msg = mongoose.model('messages', messageSchema)
module.exports = Msg