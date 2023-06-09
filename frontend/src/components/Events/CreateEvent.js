import { useEffect, useState } from "react";
import "../Groups/CreateGroup.css";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, groupsById } from "../../store/groups";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { createEvent } from "../../store/events";

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
        <div>
          <div>Create an event for {group.name}</div>
        </div>

        <form onSubmit={onSubmit}>
          <div>
            <div>What is the name of your event?</div>
            <label>
              <div>
                Choose a name that will give people a clear idea of what the
                group is about. Feel free to get creative! You can edit this
                later if you change your mind.
              </div>
              <input
                id="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder={"Event Name"}
                className="invisibleInk"
              ></input>
              <p className="errors">{afterSubmit && validationErrors.name}</p>
            </label>
          </div>
          <div>
            <label htmlFor="type">
              Is this an in person or online event?
              <select
                name="type"
                onChange={(e) => setType(e.target.value)}
                value={type}
                className="invisibleInk"
              >
                <option value="" disabled>
                  (select one)
                </option>
                <option>In person</option>
                <option>Online</option>
              </select>
              <p className="errors">{afterSubmit && validationErrors.type}</p>
            </label>

            <label htmlFor="isPrivate">
              Is this event private or public?
              <select
                name="isPrivate"
                onChange={(e) => setIsPrivate(e.target.value)}
                value={isPrivate}
                className="invisibleInk"
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
            <label>
              What is the price for your event?
              <input
                id="price"
                type="text"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              ></input>
              <p className="errors">{afterSubmit && validationErrors.price}</p>
            </label>
            <label>
              What is your max capacity?
              <input
                id="capacity"
                type="text"
                onChange={(e) => setCapacity(e.target.value)}
              ></input>
              <p className="errors">
                {afterSubmit && validationErrors.capacity}
              </p>
            </label>
            <label>
              When does your event start?
              <input
                id="startDate"
                type="text"
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="MM/DD/YYYY HH:mm AM"
              ></input>
              <p className="errors">
                {afterSubmit && validationErrors.startDate}
              </p>
            </label>
            <label>
              When does your event end?
              <input
                id="endDate"
                type="text"
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="MM/DD/YYYY HH:mm AM"
              ></input>
              <p className="errors">
                {afterSubmit && validationErrors.endDate}
              </p>
            </label>
            <label htmlFor="url">
              Please add an image url for your event below:
              <input
                id="url"
                type="text"
                onChange={(e) => setUrl(e.target.value)}
                placeholder={"Image Url"}
                className="invisibleInk"
              ></input>
              <p className="errors">{afterSubmit && validationErrors.url}</p>
            </label>
            <div>Please describe your event:</div>
            <label htmlFor="about">
              <input
                id="about"
                type="text"
                onChange={(e) => setAbout(e.target.value)}
                placeholder={"Please write at least 30 charaters"}
                className="invisibleInk"
              ></input>
              <p className="errors">{afterSubmit && validationErrors.about}</p>
            </label>
          </div>
          <div></div>
          <button type="submit">Create group</button>
        </form>
      </>
    )
  );
};

export default CreateEvent
