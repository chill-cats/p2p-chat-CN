import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
function UserCard() {
  return (
    <Card border="light" style={{ width: '100%' }}>
      <Card.Img variant="top" src="https://vcdn1-vnexpress.vnecdn.net/2020/09/11/sh8fzyt4-159886611234720470620-5969-5840-1599809570.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=9fS0hHSZamGuZ9BYgx6Tyw" />
      <Card.Body>
        <Card.Title>User</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}

export default UserCard;