const GET_VENUE_BY_ID = '/venues/by-id';

const venueById = (venue) => {
    return {
        type: GET_VENUE_BY_ID,
         venue
    }
};

export const getVenueById = (venueId) => async (dispatch) => {
    const response = await fetch(`/api/venues/${venueId}`)
console.log(response)
    if(response.ok){
        const venue = await response.json();
        dispatch(venueById(venue))
        return venue
    }
}

const initialState = {}
const venueReucer = (state = initialState, action) => {
    switch (action.type) {
      case GET_VENUE_BY_ID: {
        let newState = { ...state };
        newState[action.venue.id] = action.venue;
        return newState;
      }
      default:
        return state;

    }
}

export default venueReucer
