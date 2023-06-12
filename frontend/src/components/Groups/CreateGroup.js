import { useEffect, useState } from "react";
import '../Groups/CreateGroup.css'
import { useDispatch } from "react-redux";
import { createGroup } from "../../store/groups";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import '../Events/CreateForm.css'

const CreateGroup = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [isPrivate, setIsPrivate] = useState('');
    const [url, setUrl] = useState('https://uploader-assets.s3.ap-south-1.amazonaws.com/codepen-default-placeholder.png');
    const [validationErrors, setValidationErrors] = useState()
    const [afterSubmit, setAfterSubmit] = useState(false)

    useEffect(() => {
      const errors = {};
      if(!city && !state) errors.location = 'Location is required';
      if(!name) errors.name = 'Name is required';
      if(about.length < 30) errors.about = 'Description must be at least 30 characters long';
      if(type !== 'In person' && type !== 'Online') errors.type = "Group Type is required";
      if(isPrivate !== 'true' && isPrivate !== 'false') errors.private = "Visibility Type is required";
      if(url && url !== 'https://uploader-assets.s3.ap-south-1.amazonaws.com/codepen-default-placeholder.png'){
        const splicedUrl = url.slice(-4)
        const slicedUrl = url.slice(-5)
        //console.log(splicedUrl, slicedUrl)
        if(splicedUrl !== '.png' && splicedUrl !== '.jpg' && slicedUrl !== '.jpeg'){
          errors.url = "Image URL must end in .png, .jpg, or .jpeg";
        }
      };

      setValidationErrors(errors)
    }, [city, name, about, type, isPrivate, url])

    const handleLocation = (e) => {
        const value = e.target.value;

        const [cityVal, stateVal] = value.split(", ");

        setCity(cityVal);
        setState(stateVal)
        //console.log(city, state)
    }

const onSubmit = (e) => {
  e.preventDefault();
  //console.log(validationErrors)
  setAfterSubmit(true)
  if(! Object.values(validationErrors).length){
    const group = {
      name,
      about,
      type,
      private: isPrivate,
      city,
      state,
      previewImage: url,
    };

     dispatch(createGroup(group)).then((ele) => {history.push(`/groups/${ele.id}`)
  });
//console.log(newGroup)

}
}

return (
  <>
    <div className="create-group-container">
      <div>
        <form onSubmit={onSubmit}>
          <div style={{ borderBottom: "2px solid black" }}>
            <div style={{ color: "teal" }}>BECOME AN ORGANIZER</div>
            <div className="sub-header">
              We'll walk you through a few steps to build your local community
            </div>
          </div>

          <div style={{ borderBottom: "2px solid black" }}>
            <div className="sub-header">First, set your group's location</div>
            <label htmlFor="locationInput">
              <div
                style={{
                  width: "580px",
                  paddingBottom: "20px",
                  height: "25px",
                }}
              >
                What's up groups meet locally, in person and online. We'll
                connect you with people in your area, and more can join you
                online.
              </div>

              <input
                id="locationInput"
                type="text"
                onChange={handleLocation}
                placeholder={`City, STATE`}
                className="text-box-background"
                style={{ width: "325px", color: "black", height: "25px" }}
              ></input>
              <p className="errors">
                {afterSubmit && validationErrors.location}
              </p>
            </label>
          </div>

          <div style={{ borderBottom: "2px solid black" }}>
            <div className="sub-header">What will your group's name be?</div>
            <label>
              <div style={{ width: "570px", paddingBottom: "20px" }}>
                Choose a name that will give people a clear idea of what the
                group is about. Feel free to get creative! You can edit this
                later if you change your mind.
              </div>
              <input
                id="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder={"What is your group name?"}
                className="text-box-background"
                style={{ width: "325px", color: "black", height: "25px" }}
              ></input>
              <p className="errors">{afterSubmit && validationErrors.name}</p>
            </label>
          </div>

          <div style={{ borderBottom: "2px solid black" }}>
            <div className="sub-header">
              Now describe what your group will be about
            </div>
            <label htmlFor="about">
              <div style={{ paddingBottom: "20px" }}>
                People will see this when we promote your group, but you'll be
                able to add to it later, too.
              </div>
              <div style={{ paddingBottom: "20px" }}>
                <div>1. What's the purpose of the group?</div>

                <div>2. Who should join?</div>

                <div>3. What will you do at your events?</div>
              </div>
              <input
                id="about"
                type="text"
                onChange={(e) => setAbout(e.target.value)}
                placeholder={"Please write at least 30 charaters"}
                className="text-box-background"
                style={{
                  width: "325px",
                  paddingBottom: "200px",
                  color: "black",
                }}
              ></input>
              <p className="errors">{afterSubmit && validationErrors.about}</p>
            </label>
          </div>

          <div style={{ borderBottom: "2px solid black" }}>
            <div className="sub-header">Final steps...</div>
            <label htmlFor="type">
              Is this an in person or online group?
              <div style={{ paddingTop: "10px" }}>
                <select
                  name="type"
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                  className="text-box-background"
                  style={{ height: "25px", color: "gray" }}
                >
                  <option value="" disabled>
                    (select one)
                  </option>
                  <option>In person</option>
                  <option>Online</option>
                </select>
              </div>
              <p className="errors">{afterSubmit && validationErrors.type}</p>
            </label>
            <label htmlFor="isPrivate">
              Is this group private or public?
              <div style={{ paddingTop: "10px" }}>
                <select
                  name="isPrivate"
                  onChange={(e) => setIsPrivate(e.target.value)}
                  value={isPrivate}
                  className="text-box-background"
                  style={{ height: "25px", color: "gray" }}
                >
                  <option value="" disabled>
                    (select one)
                  </option>
                  <option value="true">Private</option>
                  <option value="false"> Public</option>
                </select>
              </div>
              <p className="errors">
                {afterSubmit && validationErrors.private}
              </p>
            </label>
            <label htmlFor="url">
              Please add an image url for your group below:
              <div style={{ paddingTop: "10px" }}>
                <input
                  id="url"
                  type="text"
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={"Image Url"}
                  className="text-box-background"
                  style={{ width: "325px", height: "25px", color: "black" }}
                ></input>
              </div>
              <p className="errors">{afterSubmit && validationErrors.url}</p>
            </label>
          </div>
          <div style={{ paddingTop: "20px", paddingBottom: "60px" }}>
            <button className="create-button" type="submit">
              Create group
            </button>
          </div>
        </form>
      </div>
      <div></div>
    </div>
  </>
);
}

export default CreateGroup
