import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

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
      {/* <button onClick={openMenu}> */}
        <button onClick={() => {setShowMenu(!showMenu)}}>
        <i className="fa-solid fa-user"></i>
      </button>
    {showMenu && <ul  ref={ulRef}>
        <li>{user.username}</li>
        <li>
          {user.firstName} {user.lastName}
        </li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>}
    </>
  );
}

export default ProfileButton;