import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {useState} from 'react'; 
import Navbar from "./components/Navbar";
import Chatroom from './pages/Chatroom';
import Homepage from './pages/Homepage';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cookies from "js-cookie"



function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUsername] = useState('')
  const verifyUser = () => {
    if (Cookies.set('jwt')) {
      setLoggedIn(true)
    }
  }
  
  return (
    <Router>
    <div className="App">
      <div className='navbar-extended'>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      </div>
      <Switch>
        <Route exact path='/'>
          <Homepage/>
        </Route>
        <Route path='/chatroom'>
          <Chatroom userName={userName}/>
        </Route>
        <Route path='/signup'>
          <Signup/>
        </Route>
        <Route path='/login'>
          <Login verifyUser={verifyUser} setUsername={setUsername}/>
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
