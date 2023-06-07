import { csrfFetch } from "./csrf";

const GET_GROUPS = '/groups'
const GET_GROUP_BY_ID = '/groups/by-id'
const CREATE_GROUP = '/groups/new'

const getGroups = (groups) => {
    return{
        type: GET_GROUPS,
        groups
    }
};

const getGroupsById = (groups) => {
  return {
    type: GET_GROUP_BY_ID,
    groups,
  };
};

const postGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group
  }
}

export const allGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");

  if(response.ok){
    const groups = await response.json();
    dispatch(getGroups(groups));
    return groups
  }
};


export const createGroup = (group) => async (dispatch) => {
  //console.log(JSON.stringify(group));
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group),
  });
  //console.log(response)

  if(response.ok){
  const newGroup = await response.json();
  //console.log(newGroup)
  dispatch(postGroup(newGroup))
  return newGroup
  }else console.log('something went wrong')

}



export const groupsById = (groupId) => async (dispatch) => {
  const id = Object.values(groupId);
  const response = await fetch(`/api/groups/${id}`);

  if (response.ok) {
    const groups = await response.json();
    dispatch(getGroupsById(groups));
    return groups;
  }
};

const initialState = {}

const groupsReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_GROUPS: {
        const newState = {...state}
        const groups = Object.values(action.groups)
        groups.forEach((group) => {
            group.forEach(ele => {newState[ele.id] = ele;})
        //console.log(group);
        });
        return newState;
        }
          case GET_GROUP_BY_ID:{
        const newState = {...state}
        const groups = action.groups
         newState[groups.id] = groups
        //console.log(group);
        return newState;
        }
        case CREATE_GROUP: {
          const newState = {...state}
          console.log(action.group)
          const group = Object.values(action.group)
          //console.log(group)
          newState[group] = group
          return newState
        }
        default:
        return state
        }
}

export default groupsReducer
