import React from "react";

export default function PlayerCard(props) {
  if (props.isUp) {
    return (
      <div className=" ring-4 ring-indigo-300 mx-4">
        <div className="rounded bg-white dark:bg-indigo-800 dark:text-white shadow-lg flex flex-col justify-center items-center p-3  w-40 h-5/6">
          <span id="icon" className="text-4xl">
            {props.icon}
          </span>
          <h4 className="text-lg text-gray-200 dark:text-gray-100">
            {props.score}
          </h4>
          <h3 className="text-2xl font-bold">{props.name}</h3>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded bg-white dark:bg-indigo-800 dark:text-white shadow-lg flex flex-col justify-center items-center p-3 mx-4 w-40 h-5/6">
      <span id="icon" className="text-4xl">
        {props.icon}
      </span>
      <h4 className="text-lg text-gray-200 dark:text-gray-100">
        {props.score}
      </h4>
      <h3 className="text-2xl font-bold">{props.name}</h3>
    </div>
  );
}
