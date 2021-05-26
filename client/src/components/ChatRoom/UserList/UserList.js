// styles
import { Accordion, Card, Button, Badge } from 'react-bootstrap'
// icons
import { RiRadioButtonLine } from 'react-icons/ri'

export const UserList = (onlineUsers) => {

  let usersArr = Object.values(onlineUsers)
  usersArr = usersArr[0].toString().split(',')

  return (
    <Accordion className='mt-4'>
      <Card>
        <Card.Header bg='none'>
          <Accordion.Toggle
            as={Button}
            variant='info'
            eventKey='0'
            style={{ textDecoration: 'none' }}
          >
            online users{' '}
            <Badge variant='light' className='ml-1'>
              {usersArr.length}
            </Badge>
          </Accordion.Toggle>
        </Card.Header>
        {usersArr.map((u) => (
          <Accordion.Collapse eventKey='0' key={u}>
            <Card.Body>
              <RiRadioButtonLine
                className={'mb-1 text-success'}
                size='0.8em'
              />{' '}
              {u}
            </Card.Body>
          </Accordion.Collapse>
        ))}
      </Card>
    </Accordion>
  )
}
