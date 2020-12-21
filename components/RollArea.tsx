import React from "react";
import { Die } from "./GameSpace";

export default function RollArea({ dice, lockAction }) {
  const renderDice = (dice: Array<Die>) => {
    let d = [];
    let keys = Object.keys(dice);

    const getLockedClass = (iteration: number) => {
      switch (iteration) {
        case 0:
          return "border-green-300";
        case 1:
          return "border-blue-300";
        case 2:
          return "border-purple-300";
        case 3:
          return "border-pink-300";
        case 4:
          return "border-red-300";
        case 5:
          return "border-yellow-300";
        default:
          return "border-blue-900";
      }
    };

    for (let i = 0; i < keys.length; i++) {
      let cur = dice[i];
      if (cur.locked) {
        d.push(
          <div
            className={`px-6 py-8 cursor-pointer border-4  ${getLockedClass(
              cur.iteration
            )} rounded transition ease-in-out`}
            onClick={() => lockAction(keys[i])}
            key={i}
          >
            <h1 className="text-5xl font-bold w-8 text-center">{cur.value}</h1>
          </div>
        );
      } else {
        d.push(
          <div
            className="px-6 py-8 cursor-pointer border-4 border-transparent hover:border-gray-300 rounded transition ease-in-out"
            onClick={() => lockAction(keys[i])}
            key={i}
          >
            <h1 className="text-5xl font-bold w-8 text-center">{cur.value}</h1>
          </div>
        );
      }
    }

    return d;
  };
  return (
    <div className="w-50vw mx-auto h-50vh flex justify-around items-center">
      {renderDice(dice as Array<Die>)}
    </div>
  );
}
