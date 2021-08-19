import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import {useState, useEffect} from 'react'; 
import Navbar from "./components/Navbar";
import Chatroom from './pages/Chatroom';
import Homepage from './pages/Homepage';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cookies from "js-cookie"
import Lobby from "./pages/Lobby";
import io from 'socket.io-client'
const socket = io('http://localhost:3020')


function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [rooms, setRooms] = useState([])
  
  const verifyUser = () => {
    if (Cookies.get('jwt')) {
      setLoggedIn(true)
    }
  }

  useEffect(() => {
    verifyUser()
  }, [])

  socket.on('new-room', roomName => {
    setRooms(rooms.concat(roomName))
  })

  return (
    <Router>
    <div className="App">
      <div className='navbar-extended'>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      </div>
      <Switch>
        <Route exact path='/'>
          <Homepage loggedIn={loggedIn}/>
        </Route>
        <Route path='/signup'>
          {loggedIn ? <Redirect to="/"/> : <Signup/>}
        </Route>
        <Route path='/login'>
          {loggedIn  ? <Redirect to="/"/> : <Login verifyUser={verifyUser}/>}
        </Route>
        <Route exact path='/rooms'>
          {Cookies.get('jwt') ? <Lobby rooms={rooms} setRooms={setRooms}/> : <Redirect to="/login" />}
        </Route>
        {rooms && rooms.map(roomName => (
          <Route path={'/rooms/' + roomName}>
            {rooms && <Chatroom socket={socket} roomName={roomName}/>}
          </Route>
        ))}
      </Switch>
    </div>
    </Router>
  );
}

export default App;
