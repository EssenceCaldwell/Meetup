
const GET_GROUPS = '/groups/get-groups'

const getGroups = (groups) => {
    return{
        type: GET_GROUPS,
        groups
    }
};

export const allGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");

  if(response.ok){
    const groups = await response.json();
    dispatch(getGroups(groups));
    return groups
  }
};

const initialState = {}

const groupsReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_GROUPS: {
        const newState = {}
        const groups = Object.values(action.groups)
        groups.forEach((group) => {
            group.forEach(ele => {newState[ele.id] = ele;})
        //console.log(group);
        });

        return newState;
        }
    default:
        return state
    }
}

export default groupsReducer
