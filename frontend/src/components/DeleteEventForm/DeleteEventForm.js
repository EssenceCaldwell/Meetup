import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { deleteEvent } from "../../store/events";

const DeleteEventForm = ({ eventId, onClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const id = Object.values(eventId);

  const deleteAnEvent = (e) => {
    e.preventDefault();
    dispatch(deleteEvent(Object.values(id)));
    history.push("/events");
    window.location.reload();
  };

  const keepGroup = (e) => {
    return onClose();
  };
  return (
    <form onSubmit={deleteAnEvent}>
      <label>
        Confirm Delete
        <div>Are you sure you want to remove this event?</div>
        <button type="submit">Yes (Delete Event)</button>
        <button onClick={keepGroup}>No (Keep Event)</button>
      </label>
    </form>
  );
};

export default DeleteEventForm;
