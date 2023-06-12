import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import '../Navigation/ProfileButton.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

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
 const showArrow = () => {
  if(!showMenu){
    return (
      <i style={{ display: "flex", marginRight: "30px" }}>
        <FontAwesomeIcon
          icon={faUser}
          size="2xl"
          style={{ color: "white", paddingRigh: "30px" }}
        />
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{ paddingLeft: "15px", color: "#606060" }}
        />
      </i>
    )
  }else {
    return (
      <i style={{ display: "flex", marginRight: "30px" }}>
        <FontAwesomeIcon
          icon={faUser}
          size="2xl"
          style={{ color: "white", paddingRigh: "30px" }}
        />
        <FontAwesomeIcon
          icon={faChevronUp}
          style={{ paddingLeft: "15px", color: "#606060" }}
        />
      </i>
    );
  }
 }
  return (
    <>
      <div style={{ position: "relative", paddingTop: "20px", paddingRight: '30px' }}>
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
          {showArrow()}
        </button>
        {showMenu && (
          <div
            ref={ulRef}
            className="dropdown"
            style={{
              position: "fixed",
              right: 0,
            }}
          >
            <div>
              <div>
                <div style={{ paddingLeft: "15px" }} className="content">
                  Hello, {user.username}
                </div>
              </div>
              <div>
                <div
                  style={{ borderBottom: "2px solid black" }}
                  className="content"
                >
                  <div style={{ paddingLeft: "15px", paddingBottom: "5px" }}>
                    {user.email}
                  </div>
                </div>
              </div>
              <div>
                <div className="content">
                  <button
                    style={{
                      paddingLeft: "15px",
                      borderStyle: "none",
                      backgroundColor: "white",
                    }}
                    onClick={logout}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
