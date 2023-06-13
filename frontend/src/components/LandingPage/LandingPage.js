import { Link } from 'react-router-dom';
import { allGroups } from "../../store/groups";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Groups from '../Groups/Groups';
import './LandingPage.css'
import frendlyImage from '../../Images/mainImg.png'
import groupPic from '../../Images/joinGroup.png'
import partyPic from '../../Images/findEvent.png'
import invitePic from '../../Images/makeGroup.png'
import SecondSignupFormModal from '../SignUpModal/secondSignupModal';


const LandingPage = ({isLoaded}) => {
const sessionUser = useSelector((state) => state.session.user);
const history = useHistory();

const handleClickSignup = () =>{

history.push('/signup')
}

let joinButton;
let createGroupsLink

  if (!sessionUser) {
    joinButton = (
      <button className="buttons" onClick={handleClickSignup}>
        Join What's Up
      </button>
    );
  }

  const handleSecondSignupButton = () => {
    if(!sessionUser){
      return (
        <SecondSignupFormModal />
      )
    }
  }

    return (
      <>
        <div className='landing-page'>
          <div className="box">
            <div className="words innerBox">
              <div className="first-left">
                <div style={{ paddingTop: "20px" }}>
                  <h1>
                    The people platform— Where interests become friendships
                  </h1>
                </div>
              </div>

              <p className="paragraph">
                Whatever your interest, from hiking and reading to networking
                and skill sharing, there are thousands of people who share it on
                What's Up. Events are happening every day—sign up to join the
                fun
              </p>
            </div>
            <div className="landing-image">
              <img
                src={frendlyImage}
                alt="friendly computer image"
                className='landing-image'
              />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "30px" }} className="centerWords">
              How What's Up works
            </h3>
            <p className="centerWords landing-container">
              Meet new people who share your interests through online and
              in-person events. It’s free to create an account.
            </p>
            <div className="group-of-three">
              <div>
                <div className="innerBox">
                  <div className="innerBox">
                    <img
                      src={groupPic}
                      alt="Group of Friends"
                      className="group-of-three-container"
                      style={{ height: 150 }}
                    />
                    <span className="link">
                      <Link
                        to="/groups"
                        style={{
                          textDecoration: "none",
                          color: "teal",
                          fontFamily: "Arial",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.textDecoration = "underline";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = "none";
                        }}
                      >
                        Join a group
                      </Link>
                    </span>
                  </div>

                  <div className="description">
                    Do what you love, meet others who love it, find your
                    community. The rest is history!
                  </div>
                </div>
              </div>

              <div className="innerBox">
                <div className="innerBox">
                  <img
                    src={partyPic}
                    alt="Group of Friends Partying"
                    className="group-of-three-container"
                    style={{ height: 150 }}
                  />
                  <span className="link">
                    <Link
                      to="/events"
                      style={{
                        textDecoration: "none",
                        color: "teal",
                        fontFamily: "Arial",
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textDecoration = "none";
                      }}
                    >
                      Find an event
                    </Link>
                  </span>
                </div>

                <div className="description">
                  Events are happening on just about any topic you can think of,
                  from online gaming and photography to yoga and hiking.
                </div>
              </div>

              <div className="innerBox">
                <div className="innerBox">
                  <img
                    src={invitePic}
                    alt="Two People Saying Join Us"
                    className="group-of-three-container"
                    style={{ height: 160 }}
                  />
                  <span className="link">
                    {sessionUser ? (
                      <Link
                        to="/groups/new"
                        style={{
                          textDecoration: "none",
                          color: "teal",
                          fontFamily: "Arial",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.textDecoration = "underline";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = "none";
                        }}
                      >
                        Start a group
                      </Link>
                    ) : (
                      <span style={{ color: "gray", cursor: "default" }}>
                        Start a group
                      </span>
                    )}
                  </span>
                </div>

                <div className="description">
                  You don’t have to be an expert to gather people together and
                  explore shared interests.
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-padding">
            <div className="joinButton">{handleSecondSignupButton()}</div>
          </div>
        </div>
      </>
    );
}
export default LandingPage
