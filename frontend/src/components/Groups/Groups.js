import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allGroups } from "../../store/groups";
import { Link } from 'react-router-dom';
import './Groups.css';
import { allEvents, eventsByGroup } from "../../store/events";

const Groups = () => {
  const dispatch = useDispatch();
  const groupData = Object.values(useSelector((state) => state.groupState));
  const events = Object.values(useSelector((state) => state.eventState));


  useEffect(() => {
    dispatch(allGroups());
  }, [dispatch]);

  useEffect(() => {
      dispatch(allEvents());

  }, [ dispatch]);


  return (
    <>
      <div className="container">
        <div></div>
        <div>
          <div className=" borders">
            <div className="header top-spacing">
              <span>
                <Link
                  to="/events"
                  style={{ textDecoration: "none", color: "gray" }}
                  onMouseEnter={(e) => {
                    e.target.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textDecoration = "none";
                  }}
                >
                  Events
                </Link>
              </span>
              <Link to='/groups'
                className="left-spacing"
                style={{ textDecoration: "underline", color: "teal", cursor: "default"}}
              >
                Groups
              </Link>
            </div>

            <h6 className="header" style={{ color: "gray" }}>
              Groups in What's Up
            </h6>
          </div>

          <ul>
            {groupData.map((group) => {
              const groupEvents = events.filter((event) => event.groupId === group.id);
            return (
              <li
                className="borders"
                onClick={() =>
                  (window.location.href = `/api/groups/${group.id}`)
                }
              >
                <div className="image-container">
                  <img
                    src={`${group.previewImage}`}
                    alt="previewImage"
                    style={{ width: 200 }}
                    className="image"
                  />
                </div>
                <div>
                  <h3 className="no-top-padding no-bottom-padding">{`${group.name}`}</h3>
                  <h6 className="location">{`${group.city}, ${group.state}`}</h6>
                  <div className="text-width">{`${group.about}`}</div>
                  <div className="header">
                    {<h6 className="location">
                      {groupEvents.length} Event(s)
                    </h6>}
                    <h6 className="location">{`${group.type}`}</h6>
                  </div>
                </div>
              </li>
            )})}
          </ul>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Groups;
