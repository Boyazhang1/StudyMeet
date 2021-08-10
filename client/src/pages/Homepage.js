import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

const Homepage = ({loggedIn}) => {

    // const [newRoomName, setNewRoomName] = useState('')

    // const goToNewRoom = () => {
    //     fetch('/api/room', {
    //         method: 'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify 
    //     }).then(res => {
    //     })
    // }

    return (
        <div className="homepage">
            <h1>Welcome to Handshake!</h1>
            <p>An app where you can practice making texting first impressions.</p>
            <br/>
            {loggedIn ? <Link to='/chatroom'>Start chatting now</Link>: <Link to='/signup'>Try it here!</Link>}
            {/* <Link to='/chatroom'>Click here to enter chatroom</Link> */}
        </div>
    //     <div id="room-container">
    //         {rooms && rooms.map(room => (
    //             <div>{room}
    //             <Link to="a">Join</Link>
    //             </div>
    //         ))}
    //     <form onSubmit={goToNewRoom} action="/room" method="POST">
    //     <input name="room" type="text" onChange={(e) => console.log(e)} required></input>
    //     <button type="submit">New Room</button>
    //     </form>
    //     </div>
      );
}
 
export default Homepage;