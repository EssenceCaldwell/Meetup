const GET_EVENTS = '/events'

const getEvents = (events) => {
    return{
        type: GET_EVENTS,
        events
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
    switch(action.type){
        case GET_EVENTS: {
            let newState = {}
            const events = Object.values(action.events)
            events.forEach(event => {
                const newEvent = Object.values(event)
                newEvent.forEach(ele => {
                    newState[ele.id] = ele
                })
            });
            return newState
        }
        default:
            return state
    }
}

export default eventsReducer
