const { nanoid } = require('nanoid')
const Msg = require('../model/message');

module.exports = (io, socket) => {
  const getMessages = () => {
    // получаем сообщения из БД и передаём их пользователям
    Msg.find({roomId: socket.roomId}).then(result => {
      io.in(socket.roomId).emit('messages', result)
    })
  }

  // обрабатываем добавление сообщения
  const addMessage = msg => {
    const message = new Msg(msg)
    message.save().then(() => {
      getMessages()
    })    
  }

  // обрабатываем удаление сообщения
  const removeMessage = (messageId) => {
    Msg.deleteOne({messageId: messageId}).then(result => {
      getMessages()
    })
  }

  // регистрируем обработчики
  socket.on('message:get', getMessages)
  socket.on('message:add', addMessage)
  socket.on('message:remove', removeMessage)
}