import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupsById } from "../../store/groups";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import './GroupById.css'
import { allEvents } from "../../store/events";

const GroupById = () => {
  const groupId = useParams()
  const dispatch = useDispatch()
  const groupData = Object.values(useSelector((state) => state.groupState));
  const events = Object.values(useSelector((state) => state.eventState));
  const group = groupData[0]
  const [groupLoaded, setGroupLoaded] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  //console.log(events)

  useEffect(() => {
    dispatch(groupsById(groupId)).then(() => setGroupLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    dispatch(allEvents()).then(() => setEventsLoaded(true));
  }, [dispatch]);


 let privacy = '...loading';
 let eventNum = '...loading';
  if(eventsLoaded){
   if (group.private) {
     privacy = "Private";
    } else privacy = "Public";

    const groupEvents = events.filter((event) => event.groupId === group.id);

    if (!groupEvents.length) {
      eventNum = "0 Events";
    }
    if (groupEvents.length === 1) {
      eventNum = "1 Event";
    } else {
      eventNum = `${groupEvents.length} Events`;
    }

  }




  return  groupLoaded && (
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
              {eventNum}
              <span>{privacy}</span>
            </h6>
            <h6>
              Organized by {group.Organizer.firstName} {group.Organizer.lastName}
            </h6>
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
        </div>
      </div>
    </>
  );
};

export default GroupById;
