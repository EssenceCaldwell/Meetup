import { csrfFetch } from "./csrf";

const SET_SESSION = "session/set-session";
const REMOVE_USER = "session/remove-user";
const RESTORE_USER = 'session/restore-user'

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
  //console.log(data.user)
  dispatch(setSession(data.user));
  return response;
};

export const restoreUser = () => async (dispatch) => {
 const response = await csrfFetch("/api/login");
 //console.log(response)
  const data = await response.json();
  console.log(data);
   dispatch(setSession(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/signup", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setSession(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/login", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

const initialState = {
  user: null,
};

const sessionReducer = (state = initialState, action) => {
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
