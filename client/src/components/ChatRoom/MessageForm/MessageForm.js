import { useState } from 'react'
// styles
import { Form, Button } from 'react-bootstrap'
// icons
import { FiSend } from 'react-icons/fi'

export const MessageForm = ({ userName, sendMessage }) => {
  const [text, setText] = useState('')

  const handleChangeText = (e) => {
    setText(e.target.value)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (trimmed) {
      sendMessage({ messageText: text, userName: userName })
      setText('')
    }
  }

  return (
    <>
      <Form onSubmit={handleSendMessage}>
        <Form.Group className='d-flex'>
          <Form.Control
            value={text}
            onChange={handleChangeText}
            type='text'
            placeholder='Message...'
          />
          <Button variant='success' type='submit'>
            <FiSend />
          </Button>
        </Form.Group>
      </Form>
    </>
  )
}
