import { csrfFetch } from "./csrf";

const GET_EVENTS = '/events';
const GET_EVENT_BY_ID = "/events/id";
const GET_EVENT_BY_GROUP_ID = 'events/group-id'
const CREATE_EVENT ='events/new'

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

const byGroupId = (events) => {
  return {
    type: GET_EVENT_BY_GROUP_ID,
    events,
  };
};

const newEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event
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

export const getEventsByGroup = (groupId) => async (dispatch) => {
    const id = Object.values(groupId)
    const response = await fetch(`/api/groups/${id}/events`)

    if(response.ok){
        const events = await response.json();
        dispatch(byGroupId(events))
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

export const createEvent = (event, groupId) => async (dispatch) => {
  const id = Object.values(groupId)
  console.log(id)
  const response = await csrfFetch(`/api/groups/${id}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });

  if(response.ok){
    const event = await response.json();
    dispatch(newEvent(event))
    return event
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
      case GET_EVENT_BY_GROUP_ID: {
        let newState = {...state}
        const newEvent = Object.values(action.events)
        newState = {...newState, ...newEvent}
        return newState
      }
      case CREATE_EVENT: {
        let newState = { ...state }
        const event = Object.values(action.event)
        newState[event.id] = event
      }
      default:
        return state;
    }
}

export default eventsReducer
