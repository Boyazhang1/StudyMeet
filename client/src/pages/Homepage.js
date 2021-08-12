import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

const Homepage = ({loggedIn}) => {

    return (
        <div className="home-lobby-err-page">
            <h1>Welcome to Handshake!</h1>
            <p>An app where you can practice making texting first impressions.</p>
            <br/>
            {loggedIn ? <Link to='/rooms'>Start chatting now</Link>: <Link to='/signup'>Try it here!</Link>}
        </div>
      );
}
 
export default Homepage;