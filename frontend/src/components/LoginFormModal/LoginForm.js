import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import './LoginForm.css'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

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
  return (
    <form className="login-modal" onSubmit={handleSubmit}>
      <h3 style={{ paddingLeft: "170px" }}>Login</h3>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <div className="input-container">
        {" "}
        <label style={{paddingBottom: '10px'}}>
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
      <div style={{paddingLeft: '45px'}}>
        <button className="login-button" type="submit">Log In</button>
      </div>
    </form>
  );
}
export default LoginForm;
