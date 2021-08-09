import {Link, useHistory} from "react-router-dom";
import {useState, useEffect} from 'react'; 

const Signup = () => {

    const [email, setEmail] = useState('')
    const [pw, setPw] = useState('')
    const [name, setName] = useState({first: '', last: ''})
    const [error, setError] = useState({email: '', password: ''})
    const history = useHistory()

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch("/api/signup", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, pw, name})
        })
        .then(res => {
            // always return inside curly braces!!
            return res.json()
        })
        .then(data => {
            if (data.user) {
                setEmail('')
                setPw('')
                setName({first: '', last: ''})
                history.push('/login')
            } else {
                setError({...error, email: data.errorMsg.email, password: data.errorMsg.password})
            }
        })
        .catch(err => console.log(err.message))
    
    }
    
    const handleEmailInput = (e) => {
        setEmail(e.target.value)
        setError({...error, email: ''})
    }

    const handlePwInput = (e) => {
        setPw(e.target.value)
        setError({...error, password: ''})
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
            <input type="text" name="email" onChange={handleEmailInput} value={email} autoComplete="off" required></input>
            <div class="email error">{error.email}</div>
            <label for="password">Password</label>
            <input type="password" name="password" value={pw} onChange={handlePwInput} required></input>
            <div class="password error">{error.password}</div>
            <p>Already a member?</p>
            <Link to='/login'>Login</Link>
            <button>Sign up</button>
            </form>
    </div>
     );
}
 
export default Signup;