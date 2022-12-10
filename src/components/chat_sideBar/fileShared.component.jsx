import { Fragment } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import FileCard from "./fileCard.component";
function FileShare(){
    const users = [
        {"name": "Documents"},
        {"name": "Photos"},
        {"name": "Movies"},
        {"name": "Other"},
    ]
    return(
    <Fragment>
        <ListGroup className = "fileType" variant="flush">
            {users.map((user,index)=>{
                return(
                <ListGroup.Item key = {index}><FileCard className="fileType_card" user={user} /></ListGroup.Item>
            )})}
        </ListGroup>
    </Fragment> 
    )
}
export default FileShare;