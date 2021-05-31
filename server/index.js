// mongoDB Atlas
const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://testchart:w1Y12Qea3kCFJknZ@testchat.vi1mx.mongodb.net/chatdb?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('mongoDB connected')
}).catch(err => console.log(err))

const express = require('express')
const { ExpressPeerServer } = require('peer')

// Express
const app = express()
const server = require('http').createServer(app)

// Peer
const peerServer = ExpressPeerServer(server, {
  debug: true,
})

app.use('/peerjs', peerServer)
app.use(express.static('public'))

// Socket.IO
const io = require('socket.io')(server, { cors: { origin: '*' } })

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

    // рассылаем по комнате peerId пользователя, начавшего стрим
  socket.on('start-stream', (roomId, peerId) => {
    console.log('start-stream')
    socket.to(roomId).emit('room-stream', peerId)
  })

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
