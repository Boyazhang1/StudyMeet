import {Link, useHistory} from "react-router-dom";
import {useState, useEffect} from 'react'; 

const Login = ({verifyUser, setUsername}) => {

    const [email, setEmail] = useState('')
    const [pw, setPw] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [error, setError] = useState('')

    const history = useHistory()

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch("/api/login", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, pw})
        })
        .then(res => {
            // always return inside curly braces!!
            return res.json()
        })
        .then(data => {
            if (data.user) {
                verifyUser()
                setUsername(data.name)
                history.push('/')
            } else {
                console.log(data.errorMsg.login)
                setError(data.errorMsg.login)
            }
        })
        .catch(err => console.log(err.message))
    }

    const handleEmailInput = (e) => {
        setEmail(e.target.value)
    }

    const handlePwInput = (e) => {
        setPw(e.target.value)
    }
     
    return (
    <div className='sign-up-or-login'>
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label for="email">Email</label>
            <input type="email" name="email" onChange={handleEmailInput} value={email} autoComplete="off" required></input>
            <label for="password">Password</label>
            <input type="password" name="password" value={pw} onChange={handlePwInput} required></input>
            <p className='login'>New user?</p>
            <Link to='/signup'>sign up here</Link>
            <div class="login error">{error}</div>
            <button>Login</button>
            </form>
    </div>
     );
}
 
export default Login;