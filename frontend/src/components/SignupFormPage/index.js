import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function SignupForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(() => {
          history.push("/");
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
            console.log(data);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };



  return (
    <>
      <div className="signup-modal">
        <p style={{ display: "flex", justifyContent: "center", color: "red" }}>
          {Object.values(errors)}
        </p>

        <h3 style={{ paddingLeft: "170px" }}>Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <div className="signup-container">
            <label>
              <input
                type="text"
                style={{ color: "black" }}
                className="signup-box"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              <input
                type="text"
                className="signup-box"
                placeholder="Username"
                value={username}
                style={{ color: "black" }}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            <label>
              <input
                type="text"
                className="signup-box"
                placeholder="First Name"
                value={firstName}
                style={{ color: "black" }}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>

            <label>
              <input
                type="text"
                className="signup-box"
                placeholder="Last Name"
                value={lastName}
                style={{ color: "black" }}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>

            <label>
              <input
                style={{ color: "black" }}
                type="password"
                className="signup-box"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label>
              <input
                style={{ paddingBottom: "10px", color: "black" }}
                type="password"
                className="signup-box"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <div style={{ paddingLeft: "45px", paddingTop: "10px" }}>
            <button className="signup-button" type="submit">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignupForm;
