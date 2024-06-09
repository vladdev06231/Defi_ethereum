import React from "react";
import "./styles/dashboard.css";
import DashboardBottom from "./DashboardBottom";
import CreateStraem from "../CreateStream/CreateStraem";
import useCreatingStreamHistory from "../../../hooks/creatingStreamHistory";
const DashboardContainer = () => {
  const [showCreateStream, setShowCreateStream] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [streamData, setStreamData] = React.useState<any>([]);

  const ShowCreateStream = () => {
    setShowCreateStream(() => true);
  };
  const hideCreateStream = () => {
    setShowCreateStream(() => false);
  };
  useCreatingStreamHistory(setLoading, setStreamData, false);
  return (
    <>
      {showCreateStream ? <CreateStraem onClose={hideCreateStream} /> : null}
      <div className="dashboardContainer">
        <div className="dashboardContainerTop">
          <div className="dashboard">Dashboard</div>
          <div className="streamMoney" onClick={() => ShowCreateStream()}>
            Stream Money
          </div>
        </div>
        <DashboardBottom data={streamData} loading={loading} />
      </div>
    </>
  );
};

export default DashboardContainer;
