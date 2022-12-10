import Header from "../header/header.component";
import Row from 'react-bootstrap/Row';
import CardList from "../card/card_list.component";
import SearchBar from "../header/searchBar.component";



function Sidebar(props){
    const users = props.users;
    const searchString = props.searchString;
    let onSearchChange = (event) =>{  
        const search = event.target.value.toLowerCase()
        props.setSearchString(search);
        
    }
    console.log(searchString);
    let filteredUsers = users.filter(
        (user)=>{return user.name.toLowerCase().includes(searchString.toLowerCase());}
    ) 
    return(
        <div>
            <Row className="header_sidebar">
                <Header/>
            </Row>
            <Row className="searchBar">
                <SearchBar  onChangeHandler={onSearchChange}/>
            </Row>
            <Row className="listChat">
                <CardList users = {filteredUsers}/>
            </Row>
        </div>
    )
}
export default Sidebar;