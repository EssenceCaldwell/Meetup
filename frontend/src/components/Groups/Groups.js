import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allGroups } from "../../store/groups";

const Groups = () => {
  const dispatch = useDispatch();
 const groupData = Object.values(useSelector((state) => state.groupState));
    //const groups = Object.values(groupData.Groups)

  useEffect(() => {
    dispatch(allGroups());
  }, [dispatch]);


//console.log(groupData[0])
  return (
    <>
    <ul>
        {groupData.map(group => <li>{`${group.name}`}</li>)}
    </ul>
    </>
  );
};

export default Groups;
