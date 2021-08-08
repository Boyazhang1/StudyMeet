import {Link, useHistory} from "react-router-dom";
import {useState, useEffect} from 'react'; 

const Login = () => {

    const [email, setEmail] = useState('')
    const [pw, setPw] = useState('')
    const history = useHistory()

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch("/api/login", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, pw})
        })
        .then(res => {
            setEmail('')
            setPw('')
            // always return inside curly braces!!
            return res.json()
        })
        .then(data => {
            if (data.user) {
                history.push('/')
            } else {
                console.log("an error has occured.")
            }
        })
        .catch(err => console.log(err.message))
    
    }
     
    return (
    <div className='sign-up-or-login'>
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label for="email">Email</label>
            <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} autoComplete="off" required></input>
            <div class="email error"></div>
            <label for="password">Password</label>
            <input type="password" name="password" value={pw} onChange={(e) => setPw(e.target.value)} required></input>
            <div class="password error"></div>
            <p className='login'>New user?</p>
            <Link to='/signup'>sign up here</Link>
            <button>Login</button>
            </form>
    </div>
     );
}
 
export default Login;