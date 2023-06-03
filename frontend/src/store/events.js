const GET_EVENTS = '/events';
const GET_EVENT_BY_ID = "/events/id";

const getEvents = (events) => {
    return{
        type: GET_EVENTS,
        events
    }
}

const getEventsById = (events) => {
    return{
        type: GET_EVENT_BY_ID,
        events
    }
}

export const eventsById = (eventId) => async (dispatch) => {
    const id = Object.values(eventId)
    const response = await fetch(`/api/events/${id}`);

    if(response.ok){
        const events = await response.json();
        dispatch(getEventsById(events))
        return events
    }
}

export const allEvents = () => async (dispatch) => {
    const response = await fetch('/api/events');

    if(response.ok){
        const events = await response.json();
        dispatch(getEvents(events))
        return events
    }
}

const initialState = {}

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_EVENTS: {
        let newState = {...state};
        const events = Object.values(action.events);
        events.forEach((event) => {
          const newEvent = Object.values(event);
          newEvent.forEach((ele) => {
            newState[ele.id] = ele;
          });
        });
        return newState;
      }
      case GET_EVENT_BY_ID:{
        let newState = {...state}
        const events = Object.values(action.events);
        const newEvent = Object.values(events)
        newEvent.forEach((ele) => newState[ele.id] = ele)
         //newState = {...newState, ...newEvent}
         return newState
      }
      default:
        return state;
    }
}

export default eventsReducer
