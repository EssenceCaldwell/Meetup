import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allGroups } from "../../store/groups";
import { Link } from 'react-router-dom';
import './Groups.css';
import { allEvents } from "../../store/events";

const Groups = () => {
  const dispatch = useDispatch();
  const groupData = Object.values(useSelector((state) => state.groupState));
  const events = Object.values(useSelector((state) => state.eventState));
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);


  useEffect(() => {
    dispatch(allGroups()).then(() => setGroupsLoaded(true))
  }, [dispatch]);

  useEffect(() => {
      dispatch(allEvents()).then(() => setEventsLoaded(true))

  }, [ dispatch]);

  //console.log(groupData)

  const numEvents = (id) => {
    const groupEvents = events.filter((event) => event.groupId === id);
    if (!groupEvents.length) {
      return "0 Events";
    }
    if (groupEvents.length === 1) {
      return "1 Event";
    } else {
      return `${groupEvents.length} Events`;
    }
  };

  if(!eventsLoaded || !groupsLoaded){
    return null
  }

  return (
    groupsLoaded &&
    eventsLoaded && (
      <>
        <div className="container">
          <div></div>
          <div>
            <div>
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
                <Link
                  to="/groups"
                  className="left-spacing"
                  style={{
                    textDecoration: "underline",
                    color: "teal",
                    cursor: "default",
                  }}
                >
                  Groups
                </Link>
              </div>

              <div style={{ paddingLeft: "40px", paddingRight: "10px" }}>
                <div style={{ height: "7px" }}>
                  <h6 style={{ color: "gray", fontSize: "13.4" }}>
                    Groups in What's Up
                  </h6>
                </div>
              </div>
            </div>

            <ul>
              {groupData.map((group) => {
                return (
                  <li
                    style={{ paddingTop: "10px" }}
                    className="borders box-width"
                    onClick={() =>
                      (window.location.href = `/groups/${group.id}`)
                    }
                  >
                    <div className="image-container no-top-padding">
                      <img
                        src={`${group.previewImage}`}
                        alt="previewImage"
                        style={{ width: 200 }}
                        className="group-image"
                      />
                    </div>
                    <div className="word-container">
                      <h4 className="no-top-padding no-bottom-padding">{`${group.name}`}</h4>
                      <h6 className="location">{`${group.city}, ${group.state}`}</h6>
                      <div className="text-width">{`${group.about}`}</div>
                      <div style={{display: 'flex'}}>
                        <h6 className="location">{numEvents(group.id)}</h6>
                        <h6 className="location">{`${group.type}`}</h6>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div></div>
        </div>
      </>
    )
  );
};

export default Groups;
