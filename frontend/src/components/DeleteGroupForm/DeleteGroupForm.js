import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteGroup } from "../../store/groups";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import '../DeleteGroupForm/DeleteGroupForm.css'

const DeleteGroupForm = ({groupId, onClose}) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const id = Object.values(groupId)

     const deleteAGroup = (e) => {
        e.preventDefault()
       dispatch(deleteGroup(Object.values(id)));
       history.push('/groups')
       window.location.reload();
     };

     const keepGroup = (e) => {

       return onClose()
     }
    return (
      <form
        style={{ width: "350px", height: "200px" }}
        onSubmit={deleteAGroup}
      >
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
              Are you sure you want to remove this group?
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ paddingBottom: "15px" }}>
                <button className="delete-group-button" type="submit">
                  Yes (Delete Group)
                </button>
              </div>
              <button className="no-delete-group-button" onClick={keepGroup}>
                No (Keep Group)
              </button>
            </div>
          </label>
        </div>
      </form>
    );
}

export default DeleteGroupForm;
