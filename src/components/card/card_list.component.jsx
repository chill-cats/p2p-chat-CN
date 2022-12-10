import { Fragment } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "./card.component";
function CardList(props) {
  const users = props.users;
  return (
    <Fragment>
      <ListGroup variant="flush">
        {users.map((user, index) => {
          return (
            <ListGroup.Item key={index}>
              <Card user={user} />
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Fragment>
  );
}
export default CardList;
