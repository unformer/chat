const User = require('../model/user')

module.exports = (io, socket) => {
  // Проверяем username на уникальность
  const checkUserName = userName => {
    User.find({userName: userName}).then(user => {
      io.emit('checkUserName', user)
    })
  } 

  // Добавляем пользователя
  const addUser = user => {
    const newUser = new User(user)
    newUser.save().then((user) => {
      io.emit('userCreated', user)
    })
  }

  // регистрируем обработчики
  socket.on('user:add', addUser)
  socket.on('user:check', checkUserName)
}
