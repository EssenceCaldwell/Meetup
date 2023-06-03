import { useEffect } from "react"
import { useSelector , useDispatch} from "react-redux"
import { Link } from 'react-router-dom';
import { eventsById } from "../../store/events"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import './EventById.css'

const EventById = () => {
    const dispatch = useDispatch();
    const eventId = useParams();
    const events = Object.values(useSelector(state => state.eventState))
    const groupData = Object.values(useSelector((state) => state.groupState));
    const event = events[0]

    useEffect(() => {
      dispatch(eventsById(eventId));
    }, [dispatch]);

     //console.log(event);

     let previewImage
     let groupImage
     let eventName
     let city
     let state
     let address

    if(events.length){
        previewImage = `${event.previewImage}`
        groupImage = `${event.Group}`
        eventName = `${event.name}`
         city = `${event.Venue.city}`
         state = `${event.Venue.state}`
         address = `${event.Venue.address}`

    }else{
      previewImage = '';
      eventName = 'Loading...';
      city = "Loading";
      state = '';}

    return (
      <>
        <div className="group-by-container">
          <div className="grid-left-padding">
            <Link to="/events">Events</Link>
            <img className="image-size" src={previewImage} />
          </div>
          <div>
            <h1 className="grid-right-padding">{eventName}</h1>
            <h6>{address}</h6>
            <h6>
              {city}, {state}
            </h6>
          </div>
        </div>
      </>
    );
}

export default EventById
