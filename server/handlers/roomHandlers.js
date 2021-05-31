const Room = require('../model/room')

module.exports = (io, socket) => {
  // получаем список online пользователей в конкретной комнате
  const getRoomOnlineUsers = () => {
    Room.find({ roomId: socket.roomId }).then(room => {
      io.in(socket.roomId).emit('onlineUsers', room)
    })
  }
  // добавление комнаты
  const addRoom = room => {
    Room.find({ roomId: room.roomId }).then(rooms => {
      if (rooms.length === 0) {
        const newRoom = new Room(room)
        newRoom.save().then(() => {
          io.emit('roomCreated', room)
          getRoomOnlineUsers()
        })
      }
    })
  }

  // обновление списка online пользователей в конкретной комнате
  const updateOnlineList = room => {
    Room.find({ roomId: room.roomId }).then(rooms => {
      try {
        if (rooms[0].onlineUsers.filter(u => u.userId === room.userId).length === 0) {
          rooms[0].onlineUsers.push({ userId: room.userId, userName: room.userName })
          rooms[0].save().then(() => {
            io.emit('roomUpdated', room)
            getRoomOnlineUsers()
          })
        }
      } catch (error) {
        
      }
    })
  }

  // обновление списка online пользователей в конкретной комнате
  const userleave = room => {
    Room.find({ roomId: room.roomId }).then(rooms => {
      try {
        if (rooms && rooms[0].onlineUsers.filter(u => u.userId === room.userId).length > 0) {
          rooms[0].onlineUsers.splice(rooms[0].onlineUsers.findIndex(u => u.userId === room.userId), 1)
          rooms[0].save().then(() => {
            getRoomOnlineUsers()
          })
        }
      } catch (error) {
        
      }

    })
  }

  // регистрируем обработчики
  socket.on('room:add', addRoom)
  socket.on('room:getRoomOnlineUsers', getRoomOnlineUsers)
  socket.on('room:updateOnlineList', updateOnlineList)
  socket.on('room:userleave', userleave)
}