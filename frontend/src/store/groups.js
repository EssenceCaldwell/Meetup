
const GET_GROUPS = '/groups'
const GET_GROUP_BY_ID = '/groups/by-id'

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

export const allGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");

  if(response.ok){
    const groups = await response.json();
    dispatch(getGroups(groups));
    return groups
  }
};

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
        default:
        return state
        }
}

export default groupsReducer
