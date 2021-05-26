const mongoose = require('mongoose')

// модель комнаты
const roomSchema = new mongoose.Schema({    
    roomId: String,
    onlineUsers: []   
})

const Room = mongoose.model('rooms', roomSchema)
module.exports = Room