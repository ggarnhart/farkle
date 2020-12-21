import React from "react";

export default function ControlArea(props) {
  if (props.showControls) {
    return (
      <div className="h-20vh w-full flex justify-around items-center">
        <button
          className="w-80 px-5 py-3 rounded text-xl bg-indigo-500 text-white dark:bg-indigo-600"
          onClick={() => props.rollAction()}
        >
          Roll
        </button>
        <button
          className="w-80 bg-indigo-500 text-white dark:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded text-xl "
          disabled={props.submitDiceActive}
          onClick={() => props.submitDiceAction()}
        >
          Submit Selected Dice!
        </button>

        <button
          className="w-80 bg-indigo-500 text-white dark:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded text-xl "
          onClick={() => props.farkleTurn()}
        >
          Farkle Turn :(
        </button>
        <button
          className="w-80 bg-indigo-500 text-white dark:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded text-xl "
          disabled={!props.nextTurnAllowed}
          onClick={() => props.endTurn()}
        >
          End turn →
        </button>
        {/* 
        <button
          className="w-80 bg-indigo-500 text-white dark:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded text-xl "
          onClick={() => props.printEverything()}
        >
          print
        </button> */}
      </div>
    );
  } else {
    return (
      <div className="h-20vh w-full flex justify-around items-center">
        <button
          className="w-80 bg-indigo-500 text-white dark:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded text-xl "
          onClick={() => props.rollAction()}
          disabled={true}
        >
          Roll
        </button>
        <button
          className="w-80 bg-indigo-500 text-white dark:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded text-xl "
          disabled={true}
          onClick={() => props.submitDiceAction()}
        >
          Submit Selected Dice!
        </button>

        <button
          className="w-80 bg-indigo-500 text-white dark:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded text-xl "
          onClick={() => props.farkleTurn()}
          disabled={true}
        >
          Farkle Turn :(
        </button>
        <button
          className="w-80 bg-indigo-500 text-white dark:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded text-xl "
          disabled={true}
          onClick={() => props.endTurn()}
        >
          End turn →
        </button>
      </div>
    );
  }
}
