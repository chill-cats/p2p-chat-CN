import './chat_box.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Fragment, useEffect, useState, useRef } from 'react';
import Chatbar from './chat_bar.component';
function ChatBox(){
    const bottomRef = useRef(null);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
      }, [messages]);
    return(
        <Fragment>
            <Row className='chatbox_header'>
                <Col className='title'>
                    <h1>Inbox</h1>
                </Col>
                <Col className='utility'>

                </Col>
            </Row>
            <Row className = "chatbox_content">
                <div className='chatbox_message'>{messages.map((message,index)=><div class="imessage"><p class="from-me">{message}</p><div ref={bottomRef} /></div>)}</div>
                <div className='chatBar' ><Chatbar setMessages={setMessages}/></div>
            </Row>
        </Fragment>
    )
}
export default ChatBox;