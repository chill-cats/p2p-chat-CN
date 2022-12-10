import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from './sidebar/sidebar.component';
import ChatBox from './chatBox/chat_box.component';
import ChatSidebar from './chat_sideBar/chat_sidebar.component';



function ContainerExample(props) {
    return (
      <Container fluid>
        <Row className='app_root'>
            <Col className='sideBar'>
                <Sidebar  users = {props.users} searchString = {props.searchString} setSearchString = {props.setSearchString} />
            </Col>
            <Col className='chatBox' xs = {6}>
              <ChatBox/>
            </Col>
            <Col className = "chat_sideBar">
              <ChatSidebar users={props.users}/>
            </Col>
        </Row>
      </Container>
    );
  }
  
  export default ContainerExample;