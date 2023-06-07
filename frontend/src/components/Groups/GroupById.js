import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupsById } from "../../store/groups";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import './GroupById.css'
import { allEvents, getEventsByGroup } from "../../store/events";
import { element } from "prop-types";

const GroupById = () => {
  const groupId = useParams();
  const id = Object.values(groupId);
  const dispatch = useDispatch();
  const groupData = Object.values(useSelector((state) => state.groupState));
  const eventData = Object.values(useSelector((state) => state.eventState));
  const group = groupData[0];
  const [groupLoaded, setGroupLoaded] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  useEffect(() => {
    dispatch(groupsById(id)).then(() => setGroupLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEventsByGroup(groupId)).then(() => setEventsLoaded(true));
  }, [dispatch]);

  //console.log(events)


  let events = []
  let upcomingEvents = []
  let pastEvents = []

  if (eventsLoaded) {
    events = eventData[0]

    events.forEach((event) => {

    if(new Date(event.startDate) >= new Date()){
      upcomingEvents.push(event)
    }else pastEvents.push(event)
   })

//upcomingEvents.forEach((ele) => {
  //console.log(ele.previewImage)
//})
  }

   const isUpcoming = () => {
    if(upcomingEvents.length){
      return (
        <div>
          {upcomingEvents.map((ele) => {
            return (
              <div
                className="small-border"
                onClick={() => (window.location.href = `/events/${ele.id}`)}
              >
                <h4>Upcoming Events ({upcomingEvents.length})</h4>
                <img
                  className="small-image"
                  src={ele.previewImage}
                  alt="previewImage"
                />
                <span>
                  {`${new Date(ele.startDate).getFullYear()}`}-
                  {`${new Date(ele.startDate).getMonth()}`}-
                  {`${new Date(ele.startDate).getDate()}`}
                </span>
                <div>{ele.name}</div>
                <div>
                  {ele.Venue.city}, {ele.Venue.state}
                </div>
                <div>{ele.description}</div>
              </div>
            );
          })}
        </div>
      )
    }
   };

    const isPast = () => {
      if (pastEvents.length) {
        return (
          <div>
            {pastEvents.map((ele) => {
              return (
                <div
                  className="small-border"
                  onClick={() => (window.location.href = `/events/${ele.id}`)}
                >
                  <h4>Past Events ({pastEvents.length})</h4>
                  <img
                    className="small-image"
                    src={ele.previewImage}
                    alt="previewImage"
                  />
                  <span>
                    {`${new Date(ele.startDate).getFullYear()}`}-
                    {`${new Date(ele.startDate).getMonth()}`}-
                    {`${new Date(ele.startDate).getDate()}`}
                  </span>
                  <div>{ele.name}</div>
                  <div>
                    {ele.Venue.city}, {ele.Venue.state}
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

  return (
    groupLoaded && (
      <>
        <div className="main-container">
          <div className="group-by-container top-container">
            <div className="grid-left-padding">
              <Link to="/groups">Groups</Link>
              <img className="image-size" src={group.previewImage} />
            </div>
            <div className="inner-padding">
              <h1 className="grid-right-padding">{group.name}</h1>
              <h6>
                {group.city}, {group.state}
              </h6>
              <h6>
                {numEvents()}
                <span>{isPrivate()}</span>
              </h6>
              <h6>
                Organized by {group.Organizer.firstName}{" "}
                {group.Organizer.lastName}
              </h6>
              <button>Join this group</button>
            </div>
          </div>
          <div className="bottom-container grid-left-padding">
            <h3>Organizer</h3>
            <h4>
              {group.Organizer.firstName} {group.Organizer.lastName}
            </h4>
            <div>
              <h3>What we're about</h3>
              {group.about}
            </div>
            <div>
              <div>
                {isUpcoming()}
              </div>
              <div>
                {isPast()}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default GroupById;
