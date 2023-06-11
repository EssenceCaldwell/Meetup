import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import '../Navigation/ProfileButton.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

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
      <div style={{ position: "relative", paddingTop: "20px" }}>
        {/* <button onClick={openMenu}> */}
        <button
          style={{
            background: "red",
            paddingTop: "10px",
            borderRadius: "50px",
            height: "35px",
            width: "35px",
            borderColor: "red",
            borderWidth: "10px",
            borderStyle: "none",
          }}
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        >
          <i style={{display: 'flex', marginRight: '30px'}}>
            <FontAwesomeIcon
              icon={faUser}
              size="2xl"
              style={{ color: "white"}}
            />
          </i>
        </button>
        {showMenu && (
          <ul
            ref={ulRef}
            className="dropdown"
            style={{
              position: "fixed",

              right: 0,
            }}
          >
            <div>
              <li className="content">Hello, {user.username}</li>
            </div>
            <div>
              <li
                style={{ borderBottom: "2px solid black" }}
                className="content"
              >
                {user.email}
              </li>
            </div>
            <div>
              <li className="content">
                <button
                  style={{ borderStyle: "none", backgroundColor: "white" }}
                  onClick={logout}
                >
                  Log Out
                </button>
              </li>
            </div>
          </ul>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
