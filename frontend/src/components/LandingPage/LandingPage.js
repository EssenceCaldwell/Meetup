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


const LandingPage = ({isLoaded}) => {
const sessionUser = useSelector((state) => state.session.user);
const history = useHistory();

const handleClickSignup = () =>{
history.push('/signup')
}

const handleClickCreateGroup = (e) => {
  e.preventDefault()

  if(sessionUser){
    history.push('/groups')
  }
}
let joinButton;
let createGroupsLink

  if (!sessionUser) {
    joinButton = (
      <button className="buttons" onClick={handleClickSignup}>
        Join What's Up
      </button>
    );
    createGroupsLink =( <span className='notLink'>Start a group</span>);
  }else createGroupsLink = (
    <Link
      to="/groups"
      style={{
        textDecoration: "none",
        color: "teal",
        fontFamily: "Arial",
      }}
    >
      Start a group
    </Link>
  );

    return (
      <>
        <div className="box">
          <div className="words innerBox">
            <h1 className="topWords">The people platform—</h1>
            <h1 className="bottomWords">Where interests become friendships</h1>
          </div>
          <div>
            <img
              src={frendlyImage}
              alt="friendly computer image"
              style={{ height: 350 }}
            />
          </div>
        </div>

        <div>
          <h2 className="centerWords">How Meetup works</h2>
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
                      onClick={handleClickCreateGroup}
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
                  {createGroupsLink}
                </span>
              </div>

              <div className="description">
                You don’t have to be an expert to gather people together and
                explore shared interests.
              </div>
            </div>
          </div>
        </div>
        <div className="joinButton">
          {joinButton}
        </div>
      </>
    );
}
export default LandingPage
