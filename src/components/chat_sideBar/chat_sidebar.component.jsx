import Row from 'react-bootstrap/Row';
import FileShare from './fileShared.component';
function ChatSidebar(props){
    return(
        <div>
            <Row className="header_sidebar">
                <h1>Shared files</h1>
            </Row>
            <Row className = "user_info">
                <img src="https://ecdn.game4v.com/g4v-content/uploads/2020/11/Nobita-1-game4v.png" id="image" alt='avatar'/>
                <h2>Nobi Nobita</h2>
                <p>A friend in need</p>
            </Row>
            <Row className="file_shared">
                <h3>File types</h3>
                <FileShare users={props.users}></FileShare>
            </Row>
        </div>
    )
}
export default ChatSidebar;