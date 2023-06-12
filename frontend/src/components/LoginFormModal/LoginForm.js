import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import './LoginForm.css'
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

function LoginForm() {
  const history = useHistory()
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => history.push("/"))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  const showErrors = () => {
    if(Object.values(errors).length){
      return <p style={{color: 'red'}}>The provided credentials were invalid.</p>;
    }
  }

  const Demo = () => {
    let credential = 'Demo-lition'
    let password = 'password'
    dispatch(sessionActions.login({credential, password}))
    history.push('/')
  }
  return (
    <form className="login-modal" onSubmit={handleSubmit}>
      <h3 style={{ paddingLeft: "170px" }}>Login</h3>
      <div style={{paddingLeft: '75px'}}>{showErrors()}</div>

      <div className="input-container">
        {" "}
        <label style={{ paddingBottom: "10px" }}>
          <input
            className="input-box"
            type="text"
            value={credential}
            placeholder="Username or Email"
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="input-box"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <div style={{ paddingLeft: "45px" }}>
        <button className="login-button" type="submit">
          Log In
        </button>
      </div>

      <Link to='#' onClick={Demo} style={{display: 'flex', justifyContent: 'center', paddingTop: '15px', color: 'teal'}}>
        Demo User</Link>
    </form>
  );
}
export default LoginForm;
