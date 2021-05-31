import { useState } from 'react'
// styles
import { Form, Button } from 'react-bootstrap'
// icons
import { FiSend, FiVideo, FiVideoOff } from 'react-icons/fi'

export const MessageForm = ({ userName, sendMessage, startStopVideo }) => {
  const [text, setText] = useState('')
  const [videoStatus, setVideoStatus] = useState(false)

  const handleChangeText = (e) => {
    setText(e.target.value)
  }

  const streamHandler = () => {
    startStopVideo(videoStatus)
    !videoStatus ? setVideoStatus(true) : setVideoStatus(false)
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
          <Button variant='primary' onClick={streamHandler}>
            {!videoStatus ? <FiVideo /> : <FiVideoOff />}
          </Button>
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
