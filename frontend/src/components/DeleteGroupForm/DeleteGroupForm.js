import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteGroup } from "../../store/groups";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

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
      <form onSubmit={deleteAGroup}>
        <label>
          Confirm Delete
          <div>Are you sure you want to remove this group?</div>
          <button type="submit">Yes (Delete Group)</button>
          <button onClick={keepGroup}>No (Keep Group)</button>
        </label>
      </form>
    );
}

export default DeleteGroupForm;
