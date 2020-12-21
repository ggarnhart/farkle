import React, { useState, useEffect } from "react";
import { useMap, useList, usePresence } from "@roomservice/react";
import PlayerCard from "./PlayerCard";
// import CurrentTurnRow from "./CurrentTurnRow";

export default function GameSpace(props) {
  const [isUser, setIsUser] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [game, map] = useMap("myroom", "data");
  const [joined, joinedClient] = usePresence("myroom", "joined");

  useEffect(() => {
    map?.set("meta", {
      title: "Farkle",
      totalUsers: 0,
      threeOnesIsOneThousand: false,
      gameStarted: false,
      threeFarklesLoseOneThousand: false,
    });

    map?.set("host", undefined);
    joinedClient.set({
      score: 0,
      farklesInARow: 0,
      id: undefined,
    });
  }, [map]);

  const setUserUp = () => {
    console.log("KEYS");
    console.log(map.keys);
    console.log(map);
    const actor = map.actor;
    setUserId(actor);
    console.log(actor);
    const iconOptions = ["😎", "🐶", "😸", "🙉", "💩", "👽", "🐥", "🦄"];
    const userIcon =
      iconOptions[Math.floor(Math.random() * iconOptions.length)];
    const userObj = {
      name: userName,
      score: 0,
      farklesInARow: 0,
      icon: userIcon,
      id: actor,
    };
    if (game.host === undefined) {
      map?.set("host", actor);
    }
    joinedClient?.set(userObj, 86400); // reset after 1 day. probably not necessary
    setIsUser(true);
  };

  const startGame = () => {
    map?.set("meta", {
      title: "Farkle",
      totalUsers: joined.length,
      threeOnesIsOneThousand: false, // todo: change this to take input
      gameStarted: true,
      threeFarklesLoseOneThousand: false, // todo: also this
    });

    const joinedKeys = Object.keys(joined);
    map?.set("currentPlayer", joinedKeys[0]);
  };

  const showPlaySpace = () => {
    // set up current player

    if (isUser === true && game.meta.gameStarted) {
      const player = game.currentPlayer;
      const playerInfo = joined[player];
      // return <CurrentTurnRow />;
      return <h1>HI!</h1>;
    } else {
      if (isUser) {
        return (
          <button
            className="p-5 rounded-md dark:bg-indigo-500 bg-purple-700 text-white text-xl font-bold mt-5 w-2/3 mx-auto"
            onClick={() => startGame()}
          >
            Let's Get Started 🤠
          </button>
        );
      }
    }
  };
  const showUserForm = () => {
    if (!isUser) {
      return (
        <div className="shadow-md w-full h-70vh md:w-1/3 md:h-2/3 bg-white rounded dark:bg-indigo-700 flex flex-col p-5 justify-center items-center">
          <h1 className="text-4xl text-center">Hey there 😎</h1>
          <input
            type="text"
            className="p-5 bg-gray-100 dark:bg-indigo-600 dark:text-white focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:border-transparent rounded-md border-gray-300  mt-5 w-2/3"
            onChange={(event) => setUserName(event.target.value)}
            placeholder="What should we call you?"
          />

          <button
            className="p-5 rounded-md dark:bg-indigo-500 bg-purple-700 text-white text-xl font-bold mt-5 w-2/3 mx-auto"
            onClick={() => setUserUp()}
            disabled={userName === "" ? true : false}
          >
            Let's Go 🤘
          </button>
        </div>
      );
    }
  };

  const renderPlayers = () => {
    const playerKeys = Object.keys(joined);
    const activePlayers = playerKeys.map((currentKey, index) => {
      const player = joined[currentKey];
      if (player.name !== undefined) {
        return (
          <PlayerCard
            id={player.id}
            isUp={player.id == game.meta.whoseTurn}
            score={player.score}
            name={player.name}
            icon={player.icon}
            key={index}
            isHost={game.host === userId}
          />
        );
      }
    });
    return activePlayers;
  };
  return (
    <div className="bg-gray-200 dark:bg-gray-800 dark:text-white w-full flex flex-col">
      <div className="bg-white dark:bg-indigo-700 dark:text-white w-full text-center h-5vh flex flex-row justify-center items-center">
        <h1 className="text-2xl">Farkle</h1>
      </div>
      <div className="h-80vh w-full flex justify-center items-center">
        {showUserForm()}
        {showPlaySpace()}
      </div>
      <div className="h-15vh w-full bg-gray-300 dark:bg-indigo-700 flex items-center justify-center">
        {renderPlayers()}
      </div>
    </div>
  );
}
