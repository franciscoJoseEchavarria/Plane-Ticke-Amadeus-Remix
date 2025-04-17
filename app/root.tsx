import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { getSession } from "~/services/sesionService";

import "./tailwind.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { json, LoaderFunction } from '@remix-run/node';
import { User } from "./interfaces/userInterface";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href:"https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user") || null;
  
  return json({ user });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<{ user: User | null }>();
  const user = loaderData?.user ?? null;
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar user={user}/>
        <main className="flex-grow">{children}</main>
        <Footer /> 
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
