import React from "react";
import "./styles/ActivityHistoryThird.css";
import ActivityType from "./Card/ActivityType";
export interface ActivityProps {
  whichActivity: string;
  setWhichActivity: React.Dispatch<React.SetStateAction<string>>;
}

const ActivityHistoryThird = ({
  whichActivity,
  setWhichActivity,
}: ActivityProps) => {
  const [showActivityType, setActivityType] = React.useState(false);
  const showHideActivityType = () => {
    setActivityType((prev) => !prev);
  };
  return (
    <>
      {showActivityType ? (
        <div
          className="coverScreen"
          onClick={() => showHideActivityType()}
        ></div>
      ) : null}
      <div className="ActivityAndNetwork">
        <div className="activityTypeContainer">
          <div className="activityType" onClick={() => showHideActivityType()}>
            <span>{!whichActivity ? "Activity Type" : whichActivity}</span>

            <i
              className={
                showActivityType
                  ? "fa-sharp fa-solid fa-arrow-down makeItUp"
                  : "fa-sharp fa-solid fa-arrow-down makeItDown"
              }
            ></i>
          </div>
          {showActivityType ? (
            <div>
              <ActivityType
                whichActivity={whichActivity}
                setWhichActivity={setWhichActivity}
              />
            </div>
          ) : null}
        </div>
        <div className="Goerli">Polygon</div>
      </div>
    </>
  );
};

export default ActivityHistoryThird;
