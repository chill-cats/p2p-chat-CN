import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/card/card.component';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import ContainerExample from './components/container.component';


function App() {
  const [users, setUser] = useState([]);
  const [searchString, setSearchString] = useState("");
  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users').
    then((res)=>{
      console.log(res);
      return res.json();}).
    then((data)=>{
      console.log(data);
      setUser(data);
    })},[])
  return (
    <div className="App">
      <Container fluid>
        <ContainerExample users = {users} searchString = {searchString} setSearchString = {setSearchString}/>
      </Container>

    </div>
  )
}

export default App
