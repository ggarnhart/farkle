import React, { useState, useEffect } from "react";
import { useMap, usePresence } from "@roomservice/react";
import PlayerCard from "./PlayerCard";
import CurrentTurnRow from "./CurrentTurnRow";
import RollArea from "./RollArea";
import ControlArea from "./ControlArea";
import calculateScore from "./CalculateScore";

export interface IPlayer {
  id: string;
  name: string;
  score: number;
  farklesInARow: number;
  icon: string;
}

export class Player {
  public id: string;
  public name: string;
  public score: number;
  public farklesInARow: number;
  public icon: string;

  constructor(obj: IPlayer) {
    this.id = obj.id;

    this.name = (obj && obj.name) || "";
    this.score = 0;
    this.farklesInARow = 0;
    this.icon = (obj && obj.icon) || "";
  }

  setScore(updatedScore: number) {
    this.score = updatedScore;
  }

  setFarklesInARow(totalFarkles: number) {
    this.farklesInARow = totalFarkles;
  }
}

export interface IGame {
  meta: {
    title: string;
    totalUsers: number;
    threeOnesIsOneThousand: boolean;
    gameStarted: boolean;
    threFarkelsLoseOneThousand: boolean;
  };

  host?: Player;
  currentPlayer?: Player;
}

export class Game {
  meta: {
    title: string;
    totalUsers: number;
    threeOnesIsOneThousand: boolean;
    gameStarted: boolean;
    threFarkelsLoseOneThousand: boolean;
  };

  host: Player;
  currentPlayer: Player;

  constructor(game: IGame) {
    this.meta = game.meta;
  }
}

export interface Die {
  value: number;
  locked: boolean;
  iteration: number; // locked on first roll, second?
}

export default function GameSpace(props) {
  const [isUser, setIsUser] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [game, map] = useMap("myroom", "data");
  const [joined, joinedClient] = usePresence("myroom", "joined");
  const [isSubmitDiceDisabled, setSubmitDiceDisabled] = useState(true);
  const [nextTurnAllowed, setNextTurnAllowed] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);

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

  useEffect(() => {
    if (game.claimedDice) {
      const keys = Object.keys(game.claimedDice);
      if (keys.length > 0) {
        setSubmitDiceDisabled(false);
      } else {
        setSubmitDiceDisabled(true);
      }
    }
  }, [map, game]);

  useEffect(() => {
    setIsMyTurn(game.currentPlayer === userId);
  }, [game]);

  const setUserUp = () => {
    let anyMap: any = map; // cast this to an any object.
    let actor: string = anyMap.actor;

    setUserId(actor);
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

    let player = new Player(userObj as IPlayer);

    if (game.host === undefined) {
      map?.set("host", actor);
    }
    joinedClient?.set(player, 86400); // reset after 1 day. probably not necessary
    setIsUser(true);
  };

  const startGame = () => {
    map?.set("gameMarker", 0); // this is joinedKeys[0]
    map?.set("turnScore", 0);
    map?.set("meta", {
      title: "Farkle",
      totalUsers: joined.length,
      threeOnesIsOneThousand: false, // todo: change this to take input
      gameStarted: true,
      threeFarklesLoseOneThousand: false, // todo: also this
    });

    let gameDice: Array<Die> = [];
    for (let i = 0; i < 6; i++) {
      let cur: Die = {
        value: Math.floor(Math.random() * 6) + 1,
        locked: false,
        iteration: 0,
      };
      gameDice.push(cur);
    }

    const joinedKeys = Object.keys(joined);
    map?.set("currentPlayer", joinedKeys[0]);
    map?.set("dice", gameDice);
    map?.set("currentTurnIteration", 0);
  };

  const rollDice = () => {
    let changedDice: Array<Die> = game.dice;
    let turnIteration: number = game.currentTurnIteration;
    for (let i = 0; i < changedDice.length; i++) {
      let curDie: Die = changedDice[i];
      if (!curDie.locked) {
        let rand = Math.floor(Math.random() * 6) + 1; // 1-6
        curDie.value = rand;
        curDie.iteration = curDie.iteration + 1;

        changedDice[i] = curDie;
      }
    }
    map?.set("dice", changedDice);

    turnIteration = turnIteration + 1;
    map?.set("currentTurnIteration", turnIteration);
    map?.set("claimedDice", {});
  };

  const submitSelectedDice = () => {
    const selectedDice = game.claimedDice;
    const selectedDiceKeys: string[] = Object.keys(selectedDice);
    const diceValues: number[] = [];
    selectedDiceKeys.forEach((key) => {
      let die: Die = selectedDice[key];
      diceValues.push(die.value);
    });
    const score: number = calculateScore(diceValues);
    if (score > 0) {
      let turnScore: number = game.turnScore;
      turnScore = turnScore + score;
      map?.set("turnScore", turnScore);

      let turnIteration: number = game.currentTurnIteration;
      turnIteration = turnIteration + 1;
      map?.set("currentTurnIteration", turnIteration);

      const changedDice = game.dice;
      for (let i = 0; i < changedDice.length; i++) {
        let curDie: Die = changedDice[i];
        if (!curDie.locked) {
          curDie.iteration = curDie.iteration + 1;
          changedDice[i] = curDie;
        }
      }
      map?.set("dice", changedDice);
    }

    setNextTurnAllowed(true);
  };

  const printEverything = () => {
    console.log("joined log:");
    console.log(joined);
  };

  const lockDie = (dieId: number) => {
    let dice: Array<Die> = game.dice;
    let dieToChange = dice[dieId];

    if (dieToChange.iteration === game.currentTurnIteration) {
      dieToChange.locked = !dieToChange.locked;
    }
    dice[dieId] = dieToChange;
    map?.set("dice", dice);

    // now, add this to the current claimed dice for the iteration.
    let claimedDice: Array<Die> = [];
    dice.forEach((die) => {
      if (die.locked && die.iteration === game.currentTurnIteration) {
        claimedDice.push(die);
      }
    });
    map?.set("claimedDice", claimedDice);
  };
  const farkleTurn = () => {
    // todo: add logic to handle if you care about farkles in a row.
    map?.set("turnScore", 0);
    resetDice();
    moveToNextPlayer();
  };
  const endTurn = () => {
    const turnScore: number = game.turnScore;
    const myId: string = game.currentPlayer;
    const me = joined[myId] as Player;
    me.score = me.score + turnScore;
    joinedClient?.set(me, 86400);

    map?.set("turnScore", 0);
    resetDice();
    moveToNextPlayer();
  };

  const resetDice = () => {
    let resetDice: Array<Die> = game.dice;
    for (let i = 0; i < resetDice.length; i++) {
      let curDie: Die = resetDice[i];
      let rand = Math.floor(Math.random() * 6) + 1; // 1-6
      curDie.value = rand;
      curDie.iteration = 0;
      curDie.locked = false;
      resetDice[i] = curDie;
    }
    map?.set("dice", resetDice);
    map?.set("currentTurnIteration", 0);
    map?.set("claimedDice", {});
  };

  const moveToNextPlayer = () => {
    const prevPlayerIndex: number = game.gameMarker;
    let updatedPlayerIndex: number = prevPlayerIndex + 1;
    const keys = Object.keys(joined);
    if (updatedPlayerIndex > keys.length - 1) {
      updatedPlayerIndex = 0;
    }
    map?.set("gameMarker", updatedPlayerIndex);
    console.log(`Updated player index: ${updatedPlayerIndex}`);
    map?.set("currentPlayer", keys[updatedPlayerIndex]);
  };

  const showPlaySpace = () => {
    // set up current player

    if (isUser === true && game.meta.gameStarted) {
      let player = game.currentPlayer;
      let playerInfo = joined[player] as IPlayer;
      let turnScore: number = game.turnScore;

      return (
        <div className="w-full">
          <CurrentTurnRow playerInfo={playerInfo} score={turnScore} />
          <RollArea lockAction={(n) => lockDie(n)} dice={game.dice} />
          <ControlArea
            rollAction={() => rollDice()}
            submitDiceActive={isSubmitDiceDisabled}
            submitDiceAction={() => submitSelectedDice()}
            nextTurnAllowed={nextTurnAllowed}
            endTurn={() => endTurn()}
            farkleTurn={() => farkleTurn()}
            printEverything={() => printEverything()}
            showControls={isMyTurn}
          />
        </div>
      );
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
      const player = joined[currentKey] as Player;
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
      <div className="h-80vh w-full flex flex-col justify-center items-center">
        {showUserForm()}
        {showPlaySpace()}
      </div>
      <div className="h-15vh w-full bg-gray-300 dark:bg-indigo-700 flex items-center justify-center">
        {renderPlayers()}
        {/* <button onClick={() => console.log(joined)}>b</button> */}
      </div>
    </div>
  );
}
