import { useEffect, useState } from "react"
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
    const [eventLoaded, setEventLoaded] = useState(false);

    useEffect(() => {
      dispatch(eventsById(eventId)).then(() => setEventLoaded(true));
    }, [dispatch]);

     console.log(events);


    return eventLoaded && (
      <>
        <div className="group-by-container">
          <div className="grid-left-padding">
            <Link to="/events">Events</Link>
            <img className="image-size" src={event.previewImage} />
          </div>
          <div>
            <h1 className="grid-right-padding">{event.name}</h1>
            <h6></h6>
            <h6>
              {event.Venue.city}, {event.Venue.state}
            </h6>
          </div>
        </div>
      </>
    );
}

export default EventById
