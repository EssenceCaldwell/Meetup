import { useEffect, useState } from "react"
import { useSelector , useDispatch} from "react-redux"
import { Link } from 'react-router-dom';
import { eventsById } from "../../store/events"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import './EventById.css'
import { groupsById } from "../../store/groups";

const EventById = () => {
    const dispatch = useDispatch();
    const eventId = useParams();
    const events = Object.values(useSelector(state => state.eventState))
    const groupData = Object.values(useSelector((state) => state.groupState));
    const [eventLoaded, setEventLoaded] = useState(false);
    const [groupLoaded, setGroupLoaded] = useState(false)

    const event = events[0];
    let group

 useEffect(() => {
   dispatch(eventsById(eventId)).then(() => setEventLoaded(true))
 }, [dispatch]);


 useEffect(() => {
   if (eventLoaded) {
     dispatch(groupsById(events[0].groupId)).then(() => setGroupLoaded(true));
   }
 }, [dispatch, events, eventLoaded]);

  if(groupLoaded){
    group = groupData[0]
  }

  const isPrivate = () => {
    if(groupLoaded){
      if(group.private === 'true'){
        return (
          <div>Private</div>
        )
      }else return (<div>Public</div>)
    }
  }

    const getDate = (startOrEndDate) => {
      if (eventLoaded) {
        const date = new Date(startOrEndDate);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month}-${day}`;
      }
    };

  const getTime = (startOrEndDate) => {
    if (eventLoaded) {
      const date = new Date(startOrEndDate);

      const hours = date.getHours();
      const minutes = date.getMinutes();

      const amOrPm = hours >= 12 ? "PM" : "AM";
      const newHours = hours % 12 === 0 ? 12 : hours % 12;
      const newMins = minutes.toString().padStart(2, "0");
      return `${newHours}:${newMins} ${amOrPm}`;
    }
  };


    return (
      groupLoaded &&
      eventLoaded && (
        <>
          <div className="event-container">
            <div className="grid-left-padding">
              <Link to="/events">Events</Link>
              <img className="image-size" src={events[0].previewImage} />
            </div>
            <div>
              <h1 className="">{event.name}</h1>
              <h6></h6>
              <h6>
                {event.Venue.city}, {event.Venue.state}
              </h6>
              <div>
                <div>
                  <img className="small-pic" src={group.previewImage} />
                  <div>{group.name}</div>
                  {isPrivate()}
                </div>
                <div>
                  <div>
                    <div>
                      Start {getDate(event.startDate)}{" "}
                      {getTime(event.startDate)}
                    </div>
                    <div>
                      End {getDate(event.endDate)} {getTime(event.endDate)}
                    </div>
                    <div>{event.price}</div>
                    <div>{event.type}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="description">
            Details
            <div>{event.description}</div>
          </div>
        </>
      )
    );
}

export default EventById
