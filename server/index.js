// создаем HTTP-сервер
const server = require('http').createServer()

const mongoose = require('mongoose');
// подключаем к серверу Socket.IO
const io = require('socket.io')(server, { cors: { origin: '*' } })
const mongoDB = 'mongodb+srv://testchart:w1Y12Qea3kCFJknZ@testchat.vi1mx.mongodb.net/chatdb?retryWrites=true&w=majority';

// подключаемся к mongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('connected')
}).catch(err => console.log(err))

// получаем обработчики событий
const registerMessageHandlers = require('./handlers/messageHandlers')
const registerUserHandlers = require('./handlers/userHandlers')
const registerRoomHandlers = require('./handlers/roomHandlers')

// выполняется при подключении каждого сокета (один клиент = один сокет)
const onConnection = (socket) => {
  console.log('User connected')

  // получаем Id комнаты из запроса рукопожатия  
  const { roomId } = socket.handshake.query
  socket.roomId = roomId

  // присоединяемся к комнате (входим в нее)
  socket.join(roomId)

  // регистрируем обработчика  
  registerMessageHandlers(io, socket)
  registerUserHandlers(io, socket)
  registerRoomHandlers(io, socket)

  socket.on('disconnect', () => {
    console.log('User disconnected')
    socket.leave(roomId)
  })
}

io.on('connection', onConnection)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server ready. Port: ${PORT}`)
})
