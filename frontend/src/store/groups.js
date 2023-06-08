import { csrfFetch } from "./csrf";

const GET_GROUPS = '/groups'
const GET_GROUP_BY_ID = '/groups/by-id'
const CREATE_GROUP = '/groups/new'
const DELETE_GROUP = 'group/delete'

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

const deleteAGroup = () => {
  return {
    type: DELETE_GROUP
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

export const updateGroup = (group, groupId) => async (dispatch) => {
  let id;
  if (typeof groupId === "object") {
    id = Object.values(groupId);
  } else {
    id = groupId;
  }
  //console.log(groupId)
  const response = await csrfFetch(`/api/groups/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group),
  });

  if (response.ok) {
    const newGroup = await response.json();
    //console.log(newGroup)
    dispatch(postGroup(newGroup));
    return newGroup;
  } else console.log("something went wrong");
}

export const groupsById = (groupId) => async (dispatch) => {
  let id
  if(typeof groupId === 'object'){
   id = Object.values(groupId);
  }else { id = groupId}

  const response = await fetch(`/api/groups/${id}`);
  //console.log(id)
  if (response.ok) {
    const groups = await response.json();
    //console.log(groups)
    dispatch(getGroupsById(groups));
    return groups;
  }
};

export const deleteGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
  })
}

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
          //console.log(action.group)
          const group = Object.values(action.group)
          //console.log(group)
          newState[group] = group
          return newState
        }
        case DELETE_GROUP: {
          return initialState
        }
        default:
        return state
        }
}

export default groupsReducer
