import TimeAgo from 'react-timeago'
import engStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
// styles
import { ListGroup, Card, Button } from 'react-bootstrap'
// icons
import { AiOutlineDelete } from 'react-icons/ai'

export const MessageListItem = ({ msg, removeMessage }) => {
  const handleRemoveMessage = (id) => {
    removeMessage(id)
  }
  const formatter = buildFormatter(engStrings)
  const { messageId } = msg
  const { messageText, userName, date, currentUser } = msg.msg
  return (
    <ListGroup.Item
      className={`d-flex ${currentUser ? 'justify-content-end' : ''}`}
    >
      <Card
        bg={`${currentUser ? 'primary' : 'secondary'}`}
        text='light'
        style={{ width: '55%' }}
      >
        <Card.Header className='d-flex justify-content-between align-items-center'>
          <Card.Text as={TimeAgo} date={date} minPeriod={60} formatter={formatter} className='small' />
          <Card.Text>{userName}</Card.Text>
        </Card.Header>
        <Card.Body className='d-flex justify-content-between align-items-center'>
          <Card.Text>{messageText}</Card.Text>
          {currentUser && (
            <Button
              variant='none'
              className='text-warning'
              onClick={() => handleRemoveMessage(messageId)}
            >
              <AiOutlineDelete />
            </Button>
          )}
        </Card.Body>
      </Card>
    </ListGroup.Item>
  )
}
