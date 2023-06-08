import { csrfFetch } from "./csrf";

const CURRENT_MEMBERSHIPS = "memberships/current";

const getCurrentAGroupMemberships = (groups) => {
  return {
    type: CURRENT_MEMBERSHIPS,
    groups,
  };
};

export const returnMembershipGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups/current");
    //console.log(response)
  if (response.ok) {
    const groups = await response.json();
    //console.log(groups)
    dispatch(getCurrentAGroupMemberships(groups));
    return groups;
  }
};

const initialState = {};
const MembershipReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_MEMBERSHIPS: {
      const newState = { ...state };
      const groups = Object.values(action.groups);
      groups.forEach((group) => {
        group.forEach((ele) => {
          newState[ele.id] = ele;
        });
        //console.log(group);
      });
      return newState;
    }
    default:
      return state;
  }
};

export default MembershipReducer;
