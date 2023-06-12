import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { deleteEvent } from "../../store/events";
import '../DeleteGroupForm/DeleteGroupForm.css'

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
    <form style={{ width: "350px", height: "200px" }} onSubmit={deleteAnEvent}>
      <div>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Confirm Delete</h3>
          <div style={{ paddingBottom: "10px" }}>
            Are you sure you want to remove this event?
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{paddingBottom: '15px'}}>
              <button className="delete-group-button" type="submit">
                Yes (Delete Event)
              </button>
            </div>
            <button className="no-delete-group-button" onClick={keepGroup}>
              No (Keep Event)
            </button>
          </div>
        </label>
      </div>
    </form>
  );
};

export default DeleteEventForm;
