import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import '../Navigation/ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  //const openMenu = () => {
  //  console.log('clicked', showMenu)
  //  if (showMenu) return;
  //  setShowMenu(true);
  //};
//
  //useEffect(() => {
  //  if (!showMenu) return;
//
  //  const closeMenu = (e) => {
  //    if (!ulRef.current.contains(e.target)) {
  //      setShowMenu(false);
  //    }
  //  };
//
  //  document.addEventListener("click", closeMenu);
//
  //  return () => document.removeEventListener("click", closeMenu);
  //}, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  //const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div style={{ position: "relative" }}>
        {/* <button onClick={openMenu}> */}
        <button
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        >
          <i className="fa-solid fa-user"></i>
        </button>
        {showMenu && (
          <ul
            ref={ulRef}
            className="dropdown"
            style={{
              position: "absolute",
              top: "100%",
              right: 0
            }}
          >
            <li className="content">Hello, {user.username}</li>
            <li className="content">
              {user.firstName} {user.lastName}
            </li>
            <li className="content">{user.email}</li>
            <li className="content">
              <button onClick={logout}>Log Out</button>
            </li>
          </ul>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
