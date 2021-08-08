import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Navbar from "./components/Navbar";
import Chatroom from './pages/Chatroom';
import Homepage from './pages/Homepage';
import Login from "./pages/Login";
import Signup from "./pages/Signup";



function App() {

  return (
    <Router>
    <div className="App">
      <div className='navbar-extended'>
      <Navbar/>
      </div>
      <Switch>
        <Route exact path='/'>
          <Homepage/>
        </Route>
        <Route path='/chatroom'>
          <Chatroom/>
        </Route>
        <Route path='/signup'>
          <Signup/>
        </Route>
        <Route path='/login'>
          <Login/>
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
