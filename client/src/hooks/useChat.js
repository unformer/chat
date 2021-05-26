import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { nanoid } from 'nanoid'

const SERVER_URL = 'http://localhost:5000'

export const useChat = (roomId, inviteLink) => {
  const [onlineUsers, setOnlineUsers] = useState([])
  const [messages, setMessages] = useState([])  
  const [currentUserId] = useState(window.localStorage.getItem('userId'))
  const [currentUserName] = useState(window.localStorage.getItem('userName'))

  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = io(SERVER_URL, {
      query: { roomId }
    })
    // записываем в local store Id(ссылку) гостевой комнаты
    window.localStorage.setItem('inviteLink', inviteLink)

    // делаем запрос на обновление списка пользователей в конкретной комнате
    currentUserName && socketRef.current.emit('room:updateOnlineList', { roomId: inviteLink, userId: currentUserId, userName: currentUserName})

    // получаем online пользователей и сетаем их username    
    socketRef.current.emit('room:getRoomOnlineUsers')
    socketRef.current.on('onlineUsers', (room) => {
      const online = room[0].onlineUsers.map( u => u.userName)
      setOnlineUsers(online)
    })    

    // делаем запрос на получение сообщений
    socketRef.current.emit('message:get')

    // получаем сообщения и сетаем их
    socketRef.current.on('messages', (messages) => {
      const newMessages = messages.map((m) =>
        m.userId === currentUserId ? { ...m, msg: {...m.msg, currentUser: true} } : m
      )
      setMessages(newMessages)
    })    

    return () => {
      socketRef.current.disconnect()
    }
  }, [roomId, currentUserId, currentUserName, inviteLink])

  // добавление сообщения
  const sendMessage = ({ userId = currentUserId, messageId = nanoid(8), messageText, userName = currentUserName, date = new Date() }) => {
    socketRef.current.emit('message:add', {
      roomId,
      userId,
      messageId,
      msg: {        
        messageText,
        userName,
        date
      }
    })
  }
  // удаление сообщения
  const removeMessage = (messageId) => {
    socketRef.current.emit('message:remove', messageId)
  }

  const userLeave = () => {
    socketRef.current.emit('room:userleave', { roomId: roomId, userId: currentUserId })
  }

  return { onlineUsers, messages, currentUserName, sendMessage, removeMessage, userLeave }
}
