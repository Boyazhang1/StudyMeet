import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

const Login = ({ verifyUser }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pw }),
    })
      .then((res) => {
        // always return inside curly braces!!
        return res.json();
      })
      .then((data) => {
        if (data.userID) {
          verifyUser();
          history.push("/");
        } else {
          console.log(data.errorMsg.login);
          setError(data.errorMsg.login);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const handleEmailInput = ({ target }) => {
    setEmail(target.value);
  };

  const handlePwInput = ({ target }) => {
    setPw(target.value);
  };

  return (
    <div className="sign-up-or-login">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          onChange={handleEmailInput}
          value={email}
          autoComplete="off"
          required
        ></input>
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          value={pw}
          onChange={handlePwInput}
          required
        ></input>
        <p className="login">New user?</p>
        <Link to="/signup">sign up here</Link>
        {error && <div class="login error">{error}</div>}
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
