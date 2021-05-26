import { Redirect } from 'react-router-dom'
import { useState } from 'react'
// hooks
import { useHome } from 'hooks'
// styles
import { Form, Button } from 'react-bootstrap'

const { nanoid } = require('nanoid')

export function Home() {

  // проверяем существования локальных данных пользователя и определяем начальные значения
  const localUserID = window.localStorage.getItem('userId')
  const localUserName = window.localStorage.getItem('userName')  
  const inviteLink = window.localStorage.getItem('inviteLink')
  
  const [userId] = useState(localUserID ? localUserID : nanoid(8)) 
  const [roomId] = useState(inviteLink ? inviteLink : ('room_' + nanoid(8))) 
  const [userName, setUserName] = useState(localUserName ? localUserName : '') 
  const { newUserCreated, createUser } = useHome(userId, localUserID, roomId)
  
  const handleChangeName = (e) => {
    setUserName(e.target.value)     
  }

  const handleSubmit = (e) => {
    e.preventDefault()      
    createUser({userId: userId, userName: userName, roomId: roomId})
  }
  
  // если пользователь создан, направляем его в комнату
  if(newUserCreated){
    return <Redirect to={'/' + roomId} />
  }

  return (
    <Form
      className='mt-5'
      style={{ maxWidth: '320px', margin: '0 auto' }}
      onSubmit={handleSubmit}
    >
      <Form.Group>
        <Form.Control value={userName} onChange={handleChangeName} placeholder={'Enter username'}/>
      </Form.Group>
      <Button type='submit' variant='success'>
        Chat
      </Button>
    </Form>
  )
}
