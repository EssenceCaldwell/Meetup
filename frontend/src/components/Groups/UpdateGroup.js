import { useEffect, useState } from "react";
import "../Groups/CreateGroup.css";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, updateGroup } from "../../store/groups";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

const UpdateGroup = () => {
  const history = useHistory();
  const groupId = useParams()
  const dispatch = useDispatch();
  const groupData = Object.values(useSelector((state) => state.groupState));
  const [groupLoaded, setGroupLoaded] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [url, setUrl] = useState(
    "https://uploader-assets.s3.ap-south-1.amazonaws.com/codepen-default-placeholder.png"
  );
  const [validationErrors, setValidationErrors] = useState();
  const [afterSubmit, setAfterSubmit] = useState(false);

  useEffect(() => {
    const errors = {};
    if (!city && !state) errors.location = "Location is required";
    if (!name) errors.name = "Name is required";
    if (about.length < 30)
      errors.about = "Description must be at least 30 characters long";
    if (type !== "In person" && type !== "Online")
      errors.type = "Group Type is required";
    if (isPrivate !== "true" && isPrivate !== "false")
      errors.private = "Visibility Type is required";
    if (
      url &&
      url !==
        "https://uploader-assets.s3.ap-south-1.amazonaws.com/codepen-default-placeholder.png"
    ) {
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
    }

    setValidationErrors(errors);
  }, [city, name, about, type, isPrivate, url]);

  const handleLocation = (e) => {
    const value = e.target.value;

    const [cityVal, stateVal] = value.split(", ");

    setCity(cityVal);
    setState(stateVal);
    //console.log(city, state)
  };

  const onSubmit = (e) => {
    e.preventDefault();
    //console.log(validationErrors)
    setAfterSubmit(true);
    if (!Object.values(validationErrors).length) {
      const group = {
        name,
        about,
        type,
        private: isPrivate,
        city,
        state,
        previewImage: url,
      };

      dispatch(updateGroup(group, groupId)).then((ele) => {
        history.push(`/groups/${Object.values(groupId)}`);
      });
      //console.log(newGroup)
    }
  };

  return (
    <>
      <div>
        <div>UPDATE YOUR GROUP'S INFORMATION</div>
        <div>
          We'll walk you through a few steps to build your local community
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div>
          <div>First, set your group's location</div>
          <label htmlFor="locationInput">
            <div>
              Meetup groups meet locally, in person and online. We'll connect
              you with people in your area, and more can join you online.
            </div>

            <input
              id="locationInput"
              type="text"
              onChange={handleLocation}
              placeholder={`City, STATE`}
              className="invisibleInk"
            ></input>
            <p className="errors">{afterSubmit && validationErrors.location}</p>
          </label>
        </div>
        <div>
          <div>What will your group's name be?</div>
          <label>
            <div>
              Choose a name that will give people a clear idea of what the group
              is about. Feel free to get creative! You can edit this later if
              you change your mind.
            </div>
            <input
              id="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder={"What is your group name?"}
              className="invisibleInk"
            ></input>
            <p className="errors">{afterSubmit && validationErrors.name}</p>
          </label>
        </div>
        <div>
          <div>Now describe what your group will be about</div>
          <label htmlFor="about">
            <div>
              People will see this when we promote your group, but you'll be
              able to add to it later, too.
            </div>
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
        <div>
          <div>Final steps...</div>
          <label htmlFor="type">
            Is this an in person or online group?
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
            Is this group private or public?
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
            <p className="errors">{afterSubmit && validationErrors.private}</p>
          </label>
          <label htmlFor="url">
            Please add an image url for your group below:
            <input
              id="url"
              type="text"
              onChange={(e) => setUrl(e.target.value)}
              placeholder={"Image Url"}
              className="invisibleInk"
            ></input>
            <p className="errors">{afterSubmit && validationErrors.url}</p>
          </label>
        </div>
        <button type="submit">Update group</button>
      </form>
    </>
  );
};

export default UpdateGroup;
