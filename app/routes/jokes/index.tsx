import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { joke } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { randomJoke: joke };

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomNumber = Math.floor(Math.random() * count);

  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomNumber,
  });

  const data: LoaderData = { randomJoke };

  return json(data);
};

export default function JokesIndex() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <p>Here is a joke</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </>
  );
}

export function ErrorBoundary() {
  return <div className="error-container">Oh dear, something went wrong.</div>;
}
