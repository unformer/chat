const mongoose = require('mongoose')

// подель пользователя
const userSchema = new mongoose.Schema({    
    userId: String,
    userName: String,
    roomId: String   
})

const User = mongoose.model('users', userSchema)
module.exports = User