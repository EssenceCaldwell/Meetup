import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allGroups } from "../../store/groups";
import { Link } from 'react-router-dom';
import './Groups.css'

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
      <div className="container">
        <div></div>
        <div>
          <div className=" borders">
            <div className="header top-spacing">
              <span>
                <Link
                  to="/events"
                  style={{ textDecoration: "none", color: "black"}}>
                  Events
                </Link>
              </span>
              <span
                className="left-spacing"
                style={{ textDecoration: "underline", color: "teal" }}
              >
                Groups
              </span>
            </div>

            <h6 className="header" style={{ color: "gray" }}>
              Groups in What's Up
            </h6>
          </div>

          <ul>
            {groupData.map((group) => (
              <li className="borders">
                <div>{`${group.previewImage}`}</div>
                <div>{`${group.name}`}</div>
              </li>
            ))}
          </ul>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Groups;
