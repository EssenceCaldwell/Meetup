import { Link } from 'react-router-dom';
import { allGroups } from "../../store/groups";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import Groups from '../Groups/Groups';
import './LandingPage.css'
import frendlyImage from '../../Images/computer.png'


const LandingPage = () => {

    return (
      <>
        <div className="box">
          <div className="words innerBox">
            <span className='topWords'>The people platform—</span>
            <span>
              Where interests become friendships
              </span>
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
          <div>
            <div>
              <Link to="/groups">Join a group</Link>
            </div>
            How Meetup works Meet new people who share your interests through
            online and in-person events. It’s free to create an account.
          </div>

          <div>
            <Link to="/events">Find an event</Link>
            Events are happening on just about any topic you can think of, from
            online gaming and photography to yoga and hiking.
          </div>

          <div>
            <Link to="/groups">Start a group</Link>
            You don’t have to be an expert to gather people together and explore
            shared interests.
          </div>
        </div>
      </>
    );
}
export default LandingPage
