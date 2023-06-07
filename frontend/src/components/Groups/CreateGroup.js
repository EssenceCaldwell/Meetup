import { useEffect, useState } from "react";
import '../Groups/CreateGroup.css'
import { useDispatch } from "react-redux";
import { createGroup } from "../../store/groups";

const CreateGroup = () => {
    const dispatch = useDispatch();
    const [city, setCity] = useState('city');
    const [state, setState] = useState('STATE');
    const [name, setName] = useState('What is your group name?');
    const [about, setAbout] = useState('Please write at least 30 charaters');
    const [type, setType] = useState('');
    const [isPrivate, setIsPrivate] = useState('');
    const [url, setUrl] = useState('Image Url');
    const [typing, setTyping] = useState(false)

    const handleLocation = (e) => {
        const value = e.target.value;

        const [cityVal, stateVal] = value.split(", ");

        setCity(cityVal);
        setState(stateVal)
        //console.log(city, state)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const group = {
          name,
          about,
          type,
          private: isPrivate,
          city,
          state,
          previewImage: url,
        };
        dispatch(createGroup(group))
    }

return (
  <form onSubmit={onSubmit}>
    <div>
      <div>First, set your group's location</div>
      <label htmlFor="locationInput">
        <div>
          Meetup groups meet locally, in person and online. We'll connect you
          with people in your area, and more can join you online.
        </div>

        <input
          id="locationInput"
          type="text"
          onChange={handleLocation}
          placeholder={`${city}, ${state}`}
          className="invisibleInk"
        ></input>
      </label>
    </div>
    <div>
      <div>What will your group's name be?</div>
      <label>
        <div>
          Choose a name that will give people a clear idea of what the group is
          about. Feel free to get creative! You can edit this later if you
          change your mind.
        </div>
        <input
          id="name"
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder={name}
          className="invisibleInk"
        ></input>
      </label>
    </div>
    <div>
      <div>Now describe what your group will be about</div>
      <label htmlFor="about">
        <div>
          People will see this when we promote your group, but you'll be able to
          add to it later, too.
        </div>
        <input
          id="about"
          type="text"
          onChange={(e) => setAbout(e.target.value)}
          placeholder={about}
          className="invisibleInk"
        ></input>
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
      </label>
      <label htmlFor="isPrivate">
        Is this group private or public?
        <select
          name="isPrivate"
          onChange={e => setIsPrivate(e.target.value)}
          value={isPrivate}
          className="invisibleInk"
        >
          <option value="" disabled>
            (select one)
          </option>
          <option value='true'>Private</option>
          <option value = 'false'> Public</option>
        </select>
      </label>
      <label htmlFor="url">
        Please add an image url for your group below:
        <input
          id="url"
          type="text"
          onChange={(e) => setUrl(e.target.value)}
          placeholder={url}
          className="invisibleInk"
        ></input>
      </label>
    </div>
    <button type="submit">Create group</button>
  </form>
);
}

export default CreateGroup
