import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { RoomServiceProvider } from "@roomservice/react";

const myAuthFunction = async (params) => {
  const response = await fetch("/api/roomservice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      room: params.room,
    }),
  });

  if (response.status === 401) {
    throw new Error("You're not allowed to be here :/");
  }

  const body = await response.json();
  return {
    user: body.user,
    resources: body.resources,
    token: body.token,
  };
};

function MyApp({ Component, pageProps }) {
  return (
    <RoomServiceProvider clientParameters={{ auth: myAuthFunction }}>
      <Component {...pageProps} />
    </RoomServiceProvider>
  );
}

export default MyApp;
