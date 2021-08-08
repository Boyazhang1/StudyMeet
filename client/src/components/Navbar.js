import {Link} from "react-router-dom"

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Handshake</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/chatroom">Start Chatting</Link>
                <Link to="/signup">Signup</Link>
            </div>
        </nav>
      );
}
 
export default Navbar;