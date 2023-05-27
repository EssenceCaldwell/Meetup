import { csrfFetch } from "./csrf";

const SET_SESSION = "sesson/set-session";
const REMOVE_USER = "session/remove-user";

const setSession = (user) => {
  return {
    type: SET_SESSION,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

export const login = (user) => async (dispatch) => {
  const {credential, password } = user;
  let response
  if([credential].includes('.com')){
    let email = credential
      response = await csrfFetch("/api/login", {
       method: "POST",
       body: JSON.stringify({
         email,
         password,
       }),
     });
  }
  else{
    let username = credential
      response = await csrfFetch("/api/login", {
       method: "POST",
       body: JSON.stringify({
         username,
         password
       }),
     });
  }

  const data = await response.json();
  dispatch(setSession(data.user));
  return response;
};

const user = {
  user: null,
};

const sessionReducer = (state = user, action) => {
  let newState;
  switch (action.type) {
    case SET_SESSION:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
