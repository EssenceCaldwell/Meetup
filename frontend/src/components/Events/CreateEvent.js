import { useEffect, useState } from "react";
import "../Groups/CreateGroup.css";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, groupsById } from "../../store/groups";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { createEvent } from "../../store/events";
import './CreateForm.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

const CreateEvent = () => {
  const history = useHistory();
  const groupId = useParams();
  const groups = Object.values(useSelector(state => state.groupState))
  const dispatch = useDispatch();
  const [groupLoaded, setGroupLoaded] = useState(false);
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState('');
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [url, setUrl] = useState("");
  const [validationErrors, setValidationErrors] = useState();
  const [afterSubmit, setAfterSubmit] = useState(false);
  useEffect(() => {
    dispatch(groupsById(Object.values(groupId))).then(() => setGroupLoaded(true))
  }, [dispatch])
let group
  useEffect(() => {
    const errors = {};
    if (!price) errors.price = "Price is required";
    if (!name) errors.name = "Name is required";
    if (about.length < 30)
      errors.about = "Description must be at least 30 characters long";
    if (type !== "In person" && type !== "Online")
      errors.type = "Event Type is required";
    if (isPrivate !== "true" && isPrivate !== "false")
      errors.private = "Visibility is required";
    if (url) {
      const splicedUrl = url.slice(-4);
      const slicedUrl = url.slice(-5);
      //console.log(splicedUrl, slicedUrl)
      if (
        splicedUrl !== ".png" &&
        splicedUrl !== ".jpg" &&
        slicedUrl !== ".jpeg"
      ) {
        errors.url = "Image URL must end in .png, .jpg, or .jpeg";
      }
    }if(!url) errors.url = "Image URL must end in .png, .jpg, or .jpeg";
    if(!startDate) errors.startDate = "Event start is required";
    if (!endDate) errors.endDate = "Event end is required";
    if(!capacity) errors.capacity = "Capacity must be a number"

    setValidationErrors(errors);
  }, [price, name, about, type, isPrivate, url]);


  const onSubmit = (e) => {
    e.preventDefault();
    //console.log(validationErrors)
    setAfterSubmit(true);
    if (!Object.values(validationErrors).length) {
      const event = {
        groupId: Object.values(groupId)[0],
        name,
        description: about,
        venueId: 1,
        type,
        capacity,
        private: isPrivate,
        price,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        previewImage: url,
      };

      dispatch(createEvent(event, groupId)).then((ele) => {
        history.push(`/events/${ele.id}`);
        window.location.reload();
      });
      //console.log(newGroup)
    }
  };

  if(groupLoaded){
    group = groups[0]
  }


  return (
    groupLoaded && (
      <>
        <div style={{ paddingBottom: "50px" }} className="form-container">
          <div></div>
          <div className="form-left-padding">
            <form onSubmit={onSubmit}>
              <div style={{ borderBottom: "2px solid black" }}>
                <div>
                  <h1>Create an event for {group.name}</h1>
                </div>
                <div>
                  <div>What is the name of your event?</div>
                  <label>
                    <input
                      id="name"
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      placeholder={"Event Name"}
                      className="text-box-background"
                      style={{ width: "400px", height: "25px", color: "black" }}
                    ></input>
                    <p className="errors">
                      {afterSubmit && validationErrors.name}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <div
                  style={{
                    borderBottom: "2px solid black",
                    paddingTop: "15px",
                  }}
                >
                  <div style={{ paddingBottom: "15px" }}>
                    <label htmlFor="type">
                      <div>Is this an in person or online event?</div>
                      <select
                        name="type"
                        onChange={(e) => setType(e.target.value)}
                        value={type}
                        className="text-box-background"
                        style={{ color: "gray", height: "25px" }}
                      >
                        <option value="" disabled>
                          (select one)
                        </option>
                        <option>In person</option>
                        <option>Online</option>
                      </select>
                      <p className="errors">
                        {afterSubmit && validationErrors.type}
                      </p>
                    </label>
                  </div>

                  <div style={{ paddingBottom: "15px" }}>
                    <label htmlFor="isPrivate">
                      <div>Is this event private or public?</div>
                      <select
                        name="isPrivate"
                        onChange={(e) => setIsPrivate(e.target.value)}
                        value={isPrivate}
                        className="text-box-background"
                        style={{ color: "gray", height: "25px" }}
                      >
                        <option value="" disabled>
                          (select one)
                        </option>
                        <option value="true">Private</option>
                        <option value="false"> Public</option>
                      </select>
                      <p className="errors">
                        {afterSubmit && validationErrors.private}
                      </p>
                    </label>
                  </div>

                  <div style={{ paddingBottom: "15px" }}>
                    <label className="label-container">
                      <div>What is the price for your event?</div>
                      <span className="dollar-sign">$</span>
                      <input
                        id="price"
                        type="text"
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        className="text-box-background"
                        style={{
                          display: "flex",
                          textAlign: "end",
                          height: "25px",
                          width: "60px",
                          color: "black",
                        }}
                      ></input>
                      <p className="errors">
                        {afterSubmit && validationErrors.price}
                      </p>
                    </label>
                  </div>
                </div>

                <div
                  style={{
                    borderBottom: "2px solid black",
                    paddingTop: "15px",
                  }}
                >
                  <div style={{ paddingBottom: "15px" }}>
                    <label>
                      <div>What is your max capacity?</div>
                      <input
                        id="capacity"
                        type="text"
                        onChange={(e) => setCapacity(e.target.value)}
                        className="text-box-background"
                        style={{
                          height: "25px",
                          color: "black",
                          width: "60px",
                          textAlign: "end",
                        }}
                        placeholder="10"
                      ></input>
                      <p className="errors">
                        {afterSubmit && validationErrors.capacity}
                      </p>
                    </label>
                  </div>

                  <div style={{ paddingBottom: "15px" }}>
                    <label>
                      <div>When does your event start?</div>
                      <div style={{ display: "flex" }}>
                        <input
                          id="startDate"
                          type="text"
                          onChange={(e) => setStartDate(e.target.value)}
                          placeholder="MM/DD/YYYY HH:mm AM"
                          className="text-box-background"
                          style={{
                            height: "25px",
                            color: "black",
                            width: "200px",
                          }}
                        ></input>
                        <div style={{ paddingLeft: "15px" }}>
                          <FontAwesomeIcon
                            icon={faCalendarDays}
                            style={{
                              color: "#000000",
                              width: "30px",
                              height: "30px",
                            }}
                          />
                        </div>
                      </div>

                      <p className="errors">
                        {afterSubmit && validationErrors.startDate}
                      </p>
                    </label>
                  </div>

                  <div style={{ paddingBottom: "15px" }}>
                    <label>
                      <div>When does your event end?</div>
                      <div style={{ display: "flex" }}>
                        <input
                          id="endDate"
                          type="text"
                          onChange={(e) => setEndDate(e.target.value)}
                          placeholder="MM/DD/YYYY HH:mm AM"
                          className="text-box-background"
                          style={{
                            height: "25px",
                            color: "black",
                            width: "200px",
                          }}
                        ></input>
                        <div style={{ paddingLeft: "15px" }}>
                          <FontAwesomeIcon
                            icon={faCalendarDays}
                            style={{
                              color: "#000000",
                              width: "30px",
                              height: "30px",
                            }}
                          />
                        </div>
                      </div>
                      <p className="errors">
                        {afterSubmit && validationErrors.endDate}
                      </p>
                    </label>
                  </div>
                </div>

                <div
                  style={{
                    borderBottom: "2px solid black",
                    paddingTop: "15px",
                  }}
                >
                  <div style={{ paddingBottom: "15px" }}>
                    <label htmlFor="url">
                      <div>Please add an image url for your event below:</div>
                      <input
                        id="url"
                        type="text"
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={"Image Url"}
                        className="text-box-background"
                        style={{
                          height: "25px",
                          color: "black",
                          width: "400px",
                        }}
                      ></input>
                      <p className="errors">
                        {afterSubmit && validationErrors.url}
                      </p>
                    </label>
                  </div>
                </div>

                <div style={{ paddingTop: "15px", paddingBottom: "25px" }}>
                  <div>Please describe your event:</div>
                  <label htmlFor="about">
                    <input
                      id="about"
                      type="text"
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder={"Please write at least 30 charaters"}
                      className="text-box-background"
                      style={{
                        width: "600px",
                        textAlign: "start",
                        color: "black",
                        paddingBottom: "200px",
                        marginTop: "0px",
                      }}
                    ></input>
                    <p className="errors">
                      {afterSubmit && validationErrors.about}
                    </p>
                  </label>
                </div>
              </div>
              <div></div>
              <button className="create-button" type="submit">
                Create Event
              </button>
            </form>
          </div>
          <div></div>
        </div>
      </>
    )
  );
};

export default CreateEvent
