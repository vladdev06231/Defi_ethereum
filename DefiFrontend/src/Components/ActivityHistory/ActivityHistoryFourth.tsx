import React from "react";
import CancelStream from "./Card/CancelStream";
import WithdrawStreams from "./Card/WithdrawStreams";
import CreateStreams from "./Card/CreateStream";
import "./styles/ActivityHistoryFourth.css";
import { ActivityHistoryInput } from "../../../hooks/withdrawingHistory";

const ActivityHistoryFourth = ({
  whichActivity,
  input,
}: {
  whichActivity: string;
  input: ActivityHistoryInput;
}) => {
  return (
    <>
      <div className="activityHistoryFourth">
        {!whichActivity ? (
          <div className="PlzSelectAActivityType">
            Plz Select a Activity Type
          </div>
        ) : null}
        {whichActivity === "Creating Stream" ? (
          <CreateStreams input={input} />
        ) : null}
        {whichActivity === "Canceling Stream" ? (
          <CancelStream input={input} />
        ) : null}
        {whichActivity === "Withdrawing" ? (
          <WithdrawStreams input={input} />
        ) : null}
      </div>
    </>
  );
};

export default ActivityHistoryFourth;
