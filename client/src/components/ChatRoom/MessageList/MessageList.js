import { useRef, useEffect } from 'react'
// styles
import { ListGroup } from 'react-bootstrap'
import s from './MessageList.module.css'
// components
import { MessageListItem } from './MessageListItem'

const listStyles = {
  height: '70vh',
  border: '1px solid rgba(0,0,0,.4)',
  borderRadius: '4px',
  overflow: 'auto'
}

export const MessageList = ({ messages, removeMessage }) => {
  const messagesEndRef = useRef(null)

  // прокручиваем чат к новому соосбщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages])

  return (
    <>
      <ListGroup variant='flush' style={listStyles}>
      <div id="video-grid" className={s.streamBlock}></div>
        {messages.map((msg) => (
          <MessageListItem
            key={msg._id}
            msg={msg}
            removeMessage={removeMessage}
          />
        ))}
        <span ref={messagesEndRef}></span>
      </ListGroup>
    </>
  )
}
