export default function NewJoke() {
  return (
    <>
      <h1>Add your own joke here.</h1>

      <form method="post">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" />
        </div>

        <div>
          <label htmlFor="content">Content</label>
          <textarea name="content" />
        </div>

        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </>
  );
}
