import {Link, useHistory} from "react-router-dom";
import {useState, useEffect} from 'react'; 

const Signup = () => {

    const [email, setEmail] = useState('')
    const [pw, setPw] = useState('')
    const [name, setName] = useState({first: '', last: ''})
    const history = useHistory()
    const handleSubmit = (e) => {
        e.preventDefault()

        fetch("/api/signup", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, pw, name})
        })
        .then(res => {
            setEmail('')
            setPw('')
            setName({first: '', last: ''})
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
            <h1>Sign-up</h1>
            <div className='form-row'>
                <div className='form-left'>
                    <label for="first-name">First Name</label>
                    <input type="text" id='first-name' value={name.first} onChange={(e) => setName({...name, first: e.target.value})} required></input>
                </div>
                <div className='form-right'>
                    <label for="last-name">Last Name</label>
                    <input type="text" id='last-name' value={name.last} onChange={(e) => setName({...name, last: e.target.value})} required></input>
                </div>
            </div>
            <label for="email">Email</label>
            <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} autoComplete="off" required></input>
            <div class="email error"></div>
            <label for="password">Password</label>
            <input type="password" name="password" value={pw} onChange={(e) => setPw(e.target.value)} required></input>
            <div class="password error"></div>
            <p>Already a member?</p>
            <Link to='/login'>Login</Link>
            <button>Sign up</button>
            </form>
    </div>
     );
}
 
export default Signup;