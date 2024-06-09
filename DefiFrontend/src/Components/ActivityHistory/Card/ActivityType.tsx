import React from "react";
import "./styles/ActivityType.css";
import { ActivityProps } from "../ActivityHistoryThird";

let ActivityTypes = ["Creating Stream", "Withdrawing", "Canceling Stream"];

const ActivityType = ({ whichActivity, setWhichActivity }: ActivityProps) => {
  return (
    <>
      <div className="activityTypes">
        {ActivityTypes.map((items, index) => {
          return (
            <div
              key={index}
              className={
                whichActivity == items
                  ? "addAddress activityIndvType"
                  : "activityIndvType"
              }
              onClick={() => setWhichActivity(() => items)}>
              {items}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ActivityType;
