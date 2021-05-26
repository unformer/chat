import { Redirect, useParams } from 'react-router-dom'
import { Beforeunload } from 'react-beforeunload'
// hooks
import { useChat } from 'hooks'
// components
import { MessageForm } from './MessageForm'
import { MessageList } from './MessageList'
import { UserList } from './UserList'
// styles
import { Container } from 'react-bootstrap'

export function ChatRoom() {
  
  const { roomId } = useParams()     
  // записываем гостевую ссылку и передаём её хуку
  const inviteLink = window.location.pathname.substr(1)
  const { onlineUsers, messages, currentUserName, sendMessage, removeMessage, userLeave } = useChat(roomId, inviteLink)
  // проверяем наличие локальных данных пользователя и перенаправляем на главную, если их нет
  if (!currentUserName) {
    return <Redirect to={'/'} />
  }

  return (
    <Container>
      <h2 className='text-center'>Room: {roomId}</h2>
      <UserList room={onlineUsers} />
      <MessageList messages={messages} removeMessage={removeMessage} />
      <MessageForm username={currentUserName} sendMessage={sendMessage} />
      <Beforeunload onBeforeunload={userLeave} />
    </Container>
  )
}
