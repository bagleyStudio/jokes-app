import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (typeof name !== "string" || typeof content !== "string") {
    throw new Error(`Form not submitted correctly.`);
  }

  const fields = { name, content };

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
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
