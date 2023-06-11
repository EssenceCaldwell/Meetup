import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { allEvents } from "../../store/events";
import { Link } from "react-router-dom";
import './Events.css'

const Events = () => {
    const dispatch = useDispatch();
    const events = Object.values(useSelector((state) => state.eventState));
    const [eventsLoaded, setEventsLoaded] = useState(false);
    let date

    useEffect(() => {
        dispatch(allEvents()).then(() => setEventsLoaded(true))
    }, [dispatch])


    const getDate = (startDate) => {
      if(eventsLoaded){
        const date = new Date(startDate);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month}-${day}`;
      }
    }

    const getTime =(startDate) => {
      if(eventsLoaded){
        const date = new Date(startDate);

        const hours = date.getHours();
        const minutes = date.getMinutes();

        const amOrPm = hours >= 12 ? "PM" : "AM";
        const newHours = hours % 12 === 0 ? 12 : hours % 12;
        const newMins = minutes.toString().padStart(2, "0");
 return `${newHours}:${newMins} ${amOrPm}`;
      }
    }



    const getCity = (event) => {
      if (event.Venue) {
        //window.location.reload();
      return event.Venue.city;
    };
  }
    const getState = (event) => {
      if (event.Venue) {
       // window.location.reload();
        return event.Venue.state;
    };
  }
    return eventsLoaded && (
      <>
        <div className="events-container">
          <div>
            <div className=" event-borders">
              <div className="header top-spacing">
                <span>
                  <Link
                    to="/events"
                    style={{
                      textDecoration: "underline",
                      color: "teal",
                      cursor: "default",
                    }}
                  >
                    Events
                  </Link>
                </span>
                <Link
                  to="/groups"
                  className="left-spacing"
                  style={{ textDecoration: "none", color: "gray" }}
                  onMouseEnter={(e) => {
                    e.target.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textDecoration = "none";
                  }}
                >
                  Groups
                </Link>
              </div>

              <h6 style={{ color: "gray" }}>
                Events in What's Up
              </h6>
            </div>

            <ul>
              {events.map((event) => {
                if(!event.Venue){
                  window.location.reload()
                }
                return (
                  <li
                    className="borders outer-event-container"
                    onClick={() =>
                      (window.location.href = `/events/${event.id}`)
                    }
                  >
                    <div className="inner-event-container">
                      <div className="image-container">
                        <img
                          src={`${event.previewImage}`}
                          alt="previewImage"
                          style={{ width: 200 }}
                          className="event-image"
                        />
                      </div>
                      <div>
                        <div className="header">
                          <h6 className="location">
                            {getDate(event.startDate)}
                          </h6>
                          <h6 className="location">
                            {getTime(event.startDate)}
                          </h6>
                        </div>
                        <h3 className="no-top-padding no-bottom-padding">{`${event.name}`}</h3>
                        <h6 className="location">{getCity(event)}, {getState(event)}</h6>
                      </div>
                    </div>
                    <div className="text-width">
                      <div>{`${event.description}`}</div>
                    </div>
                  </li>
                );})}
            </ul>
          </div>
          <div></div>
        </div>
      </>
    );
};


export default Events
