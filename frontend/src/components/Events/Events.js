import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { allEvents } from "../../store/events";

const Events = () => {
    const dispatch = useDispatch();
    const events = Object.values(useSelector((state) => state.eventState));

    useEffect(() => {
        dispatch(allEvents())
    }, [dispatch])

    console.log(events)
return (
  <>
    <ul>
      {events.map((event) => (
        <li>{event.name}</li>
      ))}
    </ul>
  </>
);
}

export default Events
