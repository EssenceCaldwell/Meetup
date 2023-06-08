import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import logo from '../../Images/logo.png'
import LoginFormModal from "../LoginFormModal";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  const handleClickSignup = () =>{
    history.push('/signup')
  }
 const handleClickLogin = () => {
   history.push("/login");
 };
//console.log(sessionUser)


  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
            <div className="right">
        <LoginFormModal />
         <button className="right signupBorder" onClick={handleClickSignup}>Sign up</button>
      </div>
    )
  }

  return (
    <ul className="container">
      <li className="homeButton">
        <NavLink exact to="/">
          <img
            src={logo}
            alt="Home"
            style={{ width: "200px"}}
          />
        </NavLink>
      </li>
      <div>{isLoaded && sessionLinks}</div>
    </ul>
  );
}

export default Navigation;
