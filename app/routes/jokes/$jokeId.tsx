import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { joke } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { joke: joke };

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) throw Error("Joke not found");

  const data: LoaderData = { joke };

  return json(data);
};

export default function Joke() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <p>Here is your joke...</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name}</Link>
    </>
  );
}
