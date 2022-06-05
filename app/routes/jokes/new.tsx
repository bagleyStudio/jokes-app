import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useCatch } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return json({});
};

function validateJokesName(name: String) {
  if (name.length < 3) {
    return "Your jokes name is too short";
  }
}

function validateJokesContent(content: String) {
  if (content.length < 10) {
    return "Your jokes content is too short";
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");

  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({
      formError: "Form is not submitted correctly",
    });
  }

  const fieldErrors = {
    name: validateJokesName(name),
    content: validateJokesContent(content),
  };

  const fields = { name, content };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });

  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <>
      <h1>Add your own joke here.</h1>

      <Form method="post">
        <div>
          <label htmlFor="name">Name</label>
          {""}
          <input
            type="text"
            name="name"
            defaultValue={actionData?.fields?.name}
            aria-invalid={Boolean(actionData?.fields?.name) || undefined}
            aria-errormessage={
              actionData?.fieldErrors?.name ? "name-error" : undefined
            }
          />

          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="content">Content</label>
          {""}
          <textarea
            name="content"
            defaultValue={actionData?.fields?.content}
            aria-invalid={Boolean(actionData?.fields?.content) || undefined}
            aria-errormessage={
              actionData?.fieldErrors?.content ? "content-error" : undefined
            }
          />

          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>

        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </Form>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something went wrong, please try again later.
    </div>
  );
}
