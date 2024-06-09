import React from "react";
import ActivitySecond from "../Components/ActivityHistory/ActivitySecond";
import ActivityHistoryThird from "../Components/ActivityHistory/ActivityHistoryThird";
import ActivityHistoryFourth from "../Components/ActivityHistory/ActivityHistoryFourth";
import "../Styles/Activity.css";
import { ActivityHistoryInput } from "../../hooks/withdrawingHistory";

const Activity = () => {
  const [whichActivity, setWhichActivity] = React.useState("");
  const [input, setInput] = React.useState<ActivityHistoryInput>({
    address: "",
    startTime: null,
    endTime: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  };

  function handleDateChange(value: [Date, Date]) {
    console.log(value);
    setInput((x) => {
      return {
        ...x,
        startTime: value[0],
        endTime: value[1],
      };
    });
  }
  return (
    <>
      <div className="Activity">
        <div className="activityHistory">Activity History</div>
        <ActivitySecond
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          input={input}
        />
        <ActivityHistoryThird
          whichActivity={whichActivity}
          setWhichActivity={setWhichActivity}
        />
        <ActivityHistoryFourth input={input} whichActivity={whichActivity} />
      </div>
    </>
  );
};

export default Activity;
