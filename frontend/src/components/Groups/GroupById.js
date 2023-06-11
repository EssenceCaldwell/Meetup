import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteGroup, groupsById } from "../../store/groups";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import './GroupById.css'
import { allEvents, getEventsByGroup } from "../../store/events";
import { element } from "prop-types";
import { returnMembershipGroups } from "../../store/memberships";
import DeletGroupModal from "../DeleteGroupModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const GroupById = () => {
  const groupId = useParams();
  const id = Object.values(groupId);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const groupData = Object.values(useSelector((state) => state.groupState));
  const eventData = Object.values(useSelector((state) => state.eventState));
  const group = groupData[0];
  const [groupLoaded, setGroupLoaded] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const membershipInfo = useSelector((state) => state.membershipState)
  const [membershipsLoaded, setMembershipsLoaded] = useState(false);
  let membership = false
  let owner = false

  useEffect(() => {
    dispatch(groupsById(id)).then(() => setGroupLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEventsByGroup(groupId)).then(() => setEventsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    dispatch(returnMembershipGroups()).then(() => setMembershipsLoaded(true))
  },[dispatch])

 if(groupLoaded && membershipsLoaded){
  if (membershipInfo[Object.values(groupId)]) {
    membership = true
  }
  if(sessionUser){
    if(group.organizerId === sessionUser.id){
      owner = true
      //console.log(owner)
    }
  }
  }

  let events = []
  let upcomingEvents = []
  let pastEvents = []

  if (eventsLoaded) {
    events = eventData[0]

    events.forEach((event) => {

    if(new Date(event.endDate) >= new Date()){
      upcomingEvents.push(event)
    }else pastEvents.push(event)
   })
  }
 const getTime = (startOrEndDate) => {
     const date = new Date(startOrEndDate);

     const hours = date.getHours();
     const minutes = date.getMinutes();

     const amOrPm = hours >= 12 ? "PM" : "AM";
     const newHours = hours % 12 === 0 ? 12 : hours % 12;
     const newMins = minutes.toString().padStart(2, "0");
     return `${newHours}:${newMins} ${amOrPm}`;
 };

   const isUpcoming = () => {
    if(upcomingEvents.length){
      return (
        <div>
          <h4>Upcoming Events ({upcomingEvents.length})</h4>
          {upcomingEvents.map((ele) => {

              return (
                <div
                  className="group-small-border"
                  onClick={() => (window.location.href = `/events/${ele.id}`)}
                >
                  <div className="card">
                    <div style={{ width: "80px", height: 140 }}>
                      <img
                        className="small-image black-border"
                        src={ele.previewImage}
                        alt="previewImage"
                      />
                    </div>
                    <div style={{ marginLeft: "50px" }}>
                      <div className="date">
                        {`${new Date(ele.startDate).getFullYear()}`}-
                        {`${new Date(ele.startDate).getMonth()}`}-
                        {`${new Date(ele.startDate).getDate()}`} ·{" "}
                        {getTime(ele.startDate)}
                      </div>
                      <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>
                        {ele.name}
                      </h3>
                      <div className="location">
                        {ele.Venue.city}, {ele.Venue.state}
                      </div>
                    </div>
                  </div>

                  <div>{ele.description}</div>
                </div>
              );
            })}
          </div>
      );
    }
   };

    const isPast = () => {
      if (pastEvents.length) {
        return (
          <div>
            <h4>Past Events ({pastEvents.length})</h4>
            {pastEvents.map((ele) => {
              return (
                <div
                  className="group small-border"
                  onClick={() => (window.location.href = `/events/${ele.id}`)}
                >
                  <div className="card">
                    <div>
                      <img
                        className="small-image"
                        src={ele.previewImage}
                        alt="previewImage"
                      />
                    </div>
                    <div>
                      <div className="date">
                        {`${new Date(ele.startDate).getFullYear()}`}-
                        {`${new Date(ele.startDate).getMonth()}`}-
                        {`${new Date(ele.startDate).getDate()}`}
                      </div>
                      <h3>{ele.name}</h3>
                      <h6 className="location">
                        {ele.Venue.city}, {ele.Venue.state}
                      </h6>
                    </div>
                  </div>

                  <div>{ele.description}</div>
                </div>
              );
            })}
          </div>
        );
      }
    };



  const numEvents = () => {
    if(eventsLoaded){
      events = eventData[0]
      if (!events.length) {
        return '0 Events'
      }if(events.length === 1){
        return '1 Event'
      }else {
        return `${events.length} Events`
      }
    }else return '...loading'
  }

  const isPrivate = () => {
    if(groupLoaded){
      if (group.private) {
           return "Private";
         } else return "Public";
  } else return '...loading'
  }

  const joinGroupButton = () => {
    if(membership !== true){
     return (
      <button className="join-group-button">Join this group</button>
     )
    }if(owner === true){


      return (
        <div style={{display: 'flex'}}>
          <Link to={`/groups/${Object.values(groupId)}/events/new`}>
            <button
              style={{
                backgroundColor: "#999999",
                color: "white",
                boxShadow: "4px 4px 0px 1px black",
                border: "2px solid black",
              }}
            >
              Create event
            </button>
          </Link>
          <div style={{paddingLeft: '10px', paddingRight: '10px'}}>
            <Link to={`/groups/${Object.values(groupId)}/edit`}>
              <button
                style={{
                  backgroundColor: "#999999",
                  color: "white",
                  boxShadow: "4px 4px 0px 1px black",
                  border: "2px solid black",
                }}
              >
                Update
              </button>
            </Link>
          </div>

          <DeletGroupModal groupId={groupId} />
        </div>
      );
    }
  }

  return (
    groupLoaded &&
    membershipsLoaded && (
      <>
        <div className="groupId-container">
          <div className="group-by-container top-container">
            <div className="grid-left-padding">
              <div className="top-link">
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  style={{ color: "#000000" }}
                /> {' '}
                <Link
                  to="/groups"
                  style={{ color: "teal", textDecoration: "underline" }}
                >
                  Groups
                </Link>
              </div>

              <img className="image-size" src={group.previewImage} />
            </div>
            <div className="inner-padding">
              <h1 className="grid-right-padding">{group.name}</h1>
              <h5>
                {group.city}, {group.state}
              </h5>
              <h5>
                {numEvents()} ·
                <span className="space-between">{isPrivate()}</span>
              </h5>
              <h5>
                Organized by {group.Organizer.firstName}{" "}
                {group.Organizer.lastName}
              </h5>
              <div className="align-button">{joinGroupButton()}</div>
            </div>
          </div>
          <div className="bottom-container grid-left-padding">
            <div className="upper-padding mini-titles">Organizer</div>
            <h4 style={{ color: "gray" }}>
              {group.Organizer.firstName} {group.Organizer.lastName}
            </h4>
            <div>
              <div className="mini-titles">What we're about</div>
              <div className="upper-padding">{group.about}</div>
            </div>
            <div>
              <div className="upper-padding">{isUpcoming()}</div>
              <div>{isPast()}</div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default GroupById;
