import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useParams, useCatch } from "@remix-run/react";
import type { joke } from "@prisma/client";

import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

type LoaderData = { joke: joke };

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }

  const data: LoaderData = { joke };

  return json(data);
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get("_method") !== "delete") {
    throw new Response(
      `The form method ${form.get("_method")} is not supported.`,
      {
        status: 400,
      },
    );
  }

  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    });
  }

  if (joke.jokesterId !== userId) {
    throw new Response(`Nice try, but this is not your joke.`, {
      status: 401,
    });
  }

  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect("/jokes");
};

export default function Joke() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <p>Here is your joke...</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name}</Link>

      <form method="_method">
        <input type="hidden" name="_method" value="delete" />

        <button type="submit" className="button">
          Delete
        </button>
      </form>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  switch (caught.status) {
    case 400: {
      return (
        <div className="error-container">
          What your trying to do here is not allowed.
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Apologies, but {params.jokeId} is not your joke.
        </div>
      );
    }
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is "{params.jokeId}"?
        </div>
      );
    }
  }

  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  const { jokeId } = useParams();

  return (
    <div className="error-container">
      {`There was an error loading joke with the id of ${jokeId}. Sorry.`}
    </div>
  );
}
