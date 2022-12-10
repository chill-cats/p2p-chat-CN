import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function SearchBar(props) {
  return (
    <>
      <InputGroup className="mb-3" id = "searchBar">
        <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
        <Form.Control
          placeholder="Search your friend"
          aria-label="Username"
          aria-describedby="basic-addon1"
          onChange = {props.onChangeHandler}
        />
      </InputGroup>
    </>
  );
}

export default SearchBar;