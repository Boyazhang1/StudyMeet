import {Link} from "react-router-dom"


const Navbar = ({loggedIn, setLoggedIn}) => {


    const logOut = () => {
        fetch("/api/logout")
        .then(res => setLoggedIn(false))
        .catch(err => console.log(err))
    }

    return (
        <nav className="navbar">
            <h1>Handshake</h1>
            <div className="links">
                <Link to="/">Home</Link>
                {loggedIn && <Link to="/chatroom">Start Chatting</Link>} 
                {loggedIn
                    ? <Link to="/" onClick={logOut}>Logout</Link>
                    : <Link to="/login">Login</Link>
                }
            </div>
        </nav>
      );
}
 
export default Navbar;