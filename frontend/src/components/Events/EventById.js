import { useEffect, useState } from "react"
import { useSelector , useDispatch} from "react-redux"
import { Link } from 'react-router-dom';
import { eventsById } from "../../store/events"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import './EventById.css'
import { groupsById } from "../../store/groups";
import DeleteEventModal from "../DeleteEventModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMapPin, faDollarSign, faAngleLeft} from "@fortawesome/free-solid-svg-icons";

const EventById = () => {
    const dispatch = useDispatch();
    const eventId = useParams();
    const events = Object.values(useSelector(state => state.eventState))
    const groupData = Object.values(useSelector((state) => state.groupState));
    const sessionUser = useSelector((state) => state.session.user);
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
          <div className="gray">Private</div>
        )
      }else return (<div className="gray">Public</div>)
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
let city = '...loading'
let state = '...loading'
  if(eventLoaded){
  if(event.Venue){
  city = event.Venue.city;
    }
   if(event.Venue){
    state = event.Venue.state}
  }

  const buttonHandler = () => {
    if(sessionUser && groupLoaded){
      if(sessionUser.id === group.organizerId){
        return (
          <div style={{ display: "flex" }}>
            <div style={{ paddingRight: "10px" }}>
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
            </div>
            <div>
              <DeleteEventModal eventId={eventId} />
            </div>
          </div>
        );
      }
    }
  }

  const getPrice = (event) => {
    if(event.price === 0){
      return 'FREE'
    }else return `$ ${event.price}`
  }

    return (
      groupLoaded &&
      eventLoaded && (
        <>
          <div className="event-container">
            <div
              style={{
                paddingLeft: "100px",
                paddingTop: "70px",
                paddingBottom: "30px",
              }}
            >
              <FontAwesomeIcon
                icon={faAngleLeft}
                style={{ color: "#000000" }}
              />{" "}
              <Link
                style={{ textDecoration: "underline", color: "teal" }}
                to="/events"
              >
                Events
              </Link>
              <h1>{event.name}</h1>
              <div style={{ color: "gray" }}>
                Hosted by {group.Organizer.firstName} {group.Organizer.lastName}
              </div>
            </div>
            <div className="bottom-container">
              <div className="top-events-container">
                <div>
                  <img className="image" src={events[0].previewImage} />
                </div>
                <div>
                  <div style={{ paddingLeft: "30px" }}>
                    <div
                      style={{ paddingTop: "1px" }}
                      className="small-border card-align"
                      onClick={() =>
                        (window.location.href = `/groups/${group.id}`)
                      }
                    >
                      <div style={{ width: "200px", margin: "5px" }}>
                        <img className="small-pic" src={group.previewImage} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "30px",
                            fontStyle: "bold",
                            paddingTop: "20px",
                          }}
                        >
                          {group.name}
                        </div>
                        {isPrivate()}
                      </div>
                    </div>
                    <div style={{ paddingTop: "10px" }}>
                      <div className="bottom-small-border">
                        <div
                          style={{
                            display: "flex",
                            paddingTop: "20px",
                            paddingBottom: "30px",
                            marginBottom: "5px",
                            paddingLeft: "30px",
                          }}
                        >
                          <div
                            style={{
                              paddingRight: "10px",
                              paddingTop: "4px",
                              height: "0px",
                            }}
                          >
                            <i>
                              {" "}
                              <FontAwesomeIcon
                                icon={faClock}
                                style={{
                                  color: "white",
                                  height: "30px",
                                  width: "30px",
                                  backgroundColor: "gray",
                                  borderRadius: "50px",
                                  border: "2px solid gray",
                                }}
                              />
                            </i>
                          </div>

                          <div>
                            <div className="flex">
                              <div
                                style={{
                                  color: "gray",
                                  paddingLeft: "20px",
                                  fontSize: "20px",
                                }}
                              >
                                START{" "}
                              </div>
                              <div
                                style={{
                                  color: "teal",
                                  paddingLeft: "20px",
                                  fontSize: "20px",
                                }}
                              >
                                {getDate(event.startDate)} ·{" "}
                                {getTime(event.startDate)}
                              </div>
                            </div>
                            <div className="flex">
                              <div
                                style={{
                                  color: "gray",
                                  paddingLeft: "20px",
                                  fontSize: "20px",
                                }}
                              >
                                {" "}
                                END
                              </div>
                              <div
                                style={{
                                  color: "teal",
                                  paddingLeft: "42px",
                                  fontSize: "20px",
                                }}
                              >
                                {getDate(event.endDate)} ·{" "}
                                {getTime(event.endDate)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ paddingLeft: "30px" }}>
                          <div style={{ display: "flex", color: "gray" }}>
                            <FontAwesomeIcon
                              icon={faDollarSign}
                              style={{
                                color: "#919191",
                                borderRadius: "50px",
                                width: "30px",
                                height: "30px",
                                border: "2px solid gray",
                              }}
                            />{" "}
                            <div
                              style={{
                                paddingTop: "10px",
                                paddingLeft: "27px",
                                fontSize: "20px",
                              }}
                            >
                              {getPrice(event)}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              color: "gray",
                              paddingLeft: "5px",
                              paddingTop: "30px",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faMapPin}
                              style={{ color: "#919191", height: "30px" }}
                            />{" "}
                            <div
                              style={{
                                paddingTop: "12px",
                                fontSize: "20px",
                                paddingLeft: "32px",
                              }}
                            >
                              {event.type}
                            </div>
                            <div
                              style={{
                                justifyContent: "right",
                                paddingTop: "10px",
                                paddingLeft: "160px",
                              }}
                            >
                              {buttonHandler()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ paddingLeft: "90px" }}>
                <div style={{ fontSize: "25px", paddingLeft: "110px" }}>
                  {" "}
                  Details
                </div>
                <div style={{ paddingTop: "10px", paddingLeft: "110px" }}>
                  {event.description}
                </div>
              </div>
            </div>
          </div>
        </>
      )
    );
}

export default EventById
