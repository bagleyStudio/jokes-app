import { Links, LiveReload, Outlet, useCatch, Meta } from "@remix-run/react";
import { LinksFunction, MetaFunction } from "@remix-run/node";

import globalCSS from "~/styles/global.css";
import globalMediumCSS from "~/styles/global-medium.css";
import globalLargeCSS from "~/styles/global-large.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalCSS,
    },
    {
      rel: "stylesheet",
      href: globalMediumCSS,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: globalLargeCSS,
      media: "print, (min-width: 1024px)",
    },
  ];
};

export const meta: MetaFunction = () => {
  const description = "A jokes app built with Remix.";

  return {
    charSet: "utf-8",
    description,
    keywords: "Remix, jokes, funny",
    "twitter:image": "https://remix-jokes.lol/social.png",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@benbagley_",
    "twitter:site": "@benbagley_",
    "twitter:title": "Remix Jokes",
    "teitter:description": description,
  };
};

function Document({
  children,
  title = "Remix Jokes",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Oh snap!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
