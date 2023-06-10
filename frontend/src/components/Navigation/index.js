import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import logo from '../../Images/logo.png'
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignUpModal";

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
        <div style={{fontSize: '15px', paddingTop: '20px'}}>
          <Link style={{textDecoration: 'none', color: 'teal',  paddingRight: '10px'}} to="/groups/new">Start a new group</Link>
        </div>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <div className="right">
        <LoginFormModal />
        <SignupFormModal />
      </div>
    );
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
