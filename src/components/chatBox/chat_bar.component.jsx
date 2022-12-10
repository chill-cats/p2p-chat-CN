import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function Chatbar({setMessages}) {
  const submit = (e) => {
    e.preventDefault();
    if(e.target.message.value != "")
    {
      const mess = e.target.message.value
      setMessages(prev => [...prev,mess])
      //Logic for handling message
      e.target.message.value = ''
    }
  };
  return (
    <Form onSubmit={submit}>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Type a message ..."
          aria-label="user's message"
          aria-describedby="basic-addon2"
          id="message"
          name="message"
        />
        <Button variant="outline-danger" id="button-addon2" type="submit">
          Send
        </Button>
      </InputGroup>
    </Form>
  );
}

export default Chatbar;
