import { useEffect } from "react";
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

  console.log(events)

  useEffect(() => {
    dispatch(groupsById(groupId));
  }, [dispatch]);

   useEffect(() => {
     dispatch(allEvents());
   }, [dispatch]);

      let previewImage;
      let groupName;
      let city;
      let state;
      let eventNum
      let privacy
      let organizerFirstName
      let organizerLastName
      let about

      if (groupData.length) {
        previewImage = `${group.previewImage}`;
        groupName = `${group.name}`
        city = `${group.city}`;
        state = `${group.state}`;
        organizerFirstName = `${group.Organizer.firstName}`
        organizerLastName = `${group.Organizer.lastName}`;
        about = `${group.about}`;

        if(group.private){
          privacy = 'Private'
        }else privacy = 'Public'

      } else {
        previewImage = "";
        groupName = "Loading...";
        city = "Loading";
        state = "";
        privacy = ''
        organizerFirstName = ''
        organizerLastName = ''
        about = ''
      }

      if (events.length) {
        const groupEvents = events.filter(
          (event) => event.groupId === group.id
        );
          if (!groupEvents.length) {
            eventNum = "0 Events";
          }
          if (groupEvents.length === 1) {
            eventNum = "1 Event";
          } else {
            eventNum = `${groupEvents.length} Events`;
          }
      }

  return (
    <>
      <div className="main-container">
        <div className="group-by-container top-container">
          <div className="grid-left-padding">
            <Link to="/groups">Groups</Link>
            <img className="image-size" src={previewImage} />
          </div>
          <div className="inner-padding">
            <h1 className="grid-right-padding">{groupName}</h1>
            <h6>
              {city}, {state}
            </h6>
            <h6>
              {eventNum}
              <span>
                {privacy}
              </span>
            </h6>
            <h6>
              Organized by {organizerFirstName} {organizerLastName}
            </h6>
          </div>
        </div>
        <div className="bottom-container grid-left-padding">
          <h3>Organizer</h3>
          <h4>{organizerFirstName} {organizerLastName}</h4>
          <div>
            <h3>
              What we're about
            </h3>
            {about}
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupById;
