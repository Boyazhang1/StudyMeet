import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import {useState, useEffect} from 'react'; 
import Navbar from "./components/Navbar";
import Chatroom from './pages/Chatroom';
import Homepage from './pages/Homepage';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cookies from "js-cookie"



function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  const verifyUser = () => {
    if (Cookies.get('jwt')) {
      setLoggedIn(true)
    }
  }
  useEffect(() => {
    verifyUser()
  }, [])
  console.log(loggedIn)

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
        <Route path='/chatroom'>
          {Cookies.get('jwt') ? <Chatroom/> : <Redirect to="/login" />}
        </Route>
        <Route path='/signup'>
          <Signup/>
        </Route>
        <Route path='/login'>
          <Login verifyUser={verifyUser}/>
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
