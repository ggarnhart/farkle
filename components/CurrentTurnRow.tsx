import React from "react";
import { IPlayer } from "./GameSpace";

export default function CurrentTurnRow(props) {
  const playerName = props.playerInfo ? props.playerInfo.name : "";
  return (
    <div className="w-5/6 h-10vh mx-auto flex justify-between items-center opacity-50">
      <h3 className="font-bold text-2xl">Current Player: {playerName}</h3>
      <h3 className="font-bold text-2xl">
        Turn Total: {`${props.score}`}
      </h3>{" "}
    </div>
  );
}
