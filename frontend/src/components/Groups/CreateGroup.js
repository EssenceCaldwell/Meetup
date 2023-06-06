const CreateGroup = () => {
return (
  <form>
    <div>
      <label>
        <div>First, set your group's location</div>
        <div>
          Meetup groups meet locally, in person and online. We'll connect you
          with people in your area, and more can join you online.
        </div>

        <input type="text" name="City, STATE"></input>
      </label>
    </div>
    <div>
      <label>
        <div>What will your group's name be?</div>
        <div>
          Choose a name that will give people a clear idea of what the group is
          about. Feel free to get creative! You can edit this later if you
          change your mind.
        </div>
        <input type="text"></input>
      </label>
    </div>
    <div>
      <label>
        <div>Now describe what your group will be about</div>
        <div>
          People will see this when we promote your group, but you'll be able to
          add to it later, too.
        </div>
        <input type="text"></input>
      </label>
    </div>
    <div>
      <div>Final steps...</div>
      <label>
        Is this an in person or online group?
        <select></select>
      </label>
      <label>
        Is this group private or public?
        <select></select>
      </label>
      <label>Please add an image url for your group below:
        <select></select>
      </label>
    </div>
    <button>Create group</button>
  </form>
);
}

export default CreateGroup
