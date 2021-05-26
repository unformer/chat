import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

const SERVER_URL = 'http://localhost:5000'

export const useHome = (userId) => {

    const socketRef = useRef(null)
    const [newUserCreated, setNewUserCreated] = useState(false)

    useEffect(() => {
        socketRef.current = io(SERVER_URL, {
            query: { userId }
        })

        // проверяем создание пользователя и сетаем true
        socketRef.current.on('userCreated', (user) => {
            user.userId && setNewUserCreated(true)
        })

        return () => {
            // при размонтировании компонента выполняем отключение сокета
            socketRef.current.disconnect()
        }

    }, [userId, newUserCreated])

    // создание пользователя
    const createUser = ({ userId, userName, roomId }) => {
        // проверяем usernamу на уникальность
        userId !== 0 && socketRef.current.emit('user:check', userName)
        socketRef.current.on('checkUserName', (user) => {
            if (user.length === 0) {
                // делаем запросы на создание пользователя, комнаты и обновления списка online
                socketRef.current.emit('user:add', { userId, userName, roomId })
                socketRef.current.emit('room:updateOnlineList', { roomId, userId, userName })
                socketRef.current.emit('room:add', { roomId, onlineUsers: [{ userId: userId, userName: userName }] })    
                
                // записываем в локальыне данные созданного пользователя
                window.localStorage.setItem('userId', userId)
                window.localStorage.setItem('userName', userName)
                window.localStorage.setItem('roomId', roomId)     
                
                // удаляем гостевую ссылку
                window.localStorage.removeItem('inviteLink')                
            } else {
                alert('Username: "' + userName + '" is buzy, try another...')
            }
        })
    }

    return { newUserCreated, createUser }
}