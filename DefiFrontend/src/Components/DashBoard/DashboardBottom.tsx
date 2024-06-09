import React from "react";
import "./styles/DashboardBottom.css";
import StreaminIndv from "./StreaminIndv";

interface DashboardBottomProps {
  data: any;
  loading: boolean;
}

const DashboardBottom: React.FC<DashboardBottomProps> = ({ data, loading }) => {
  return (
    <>
      <div className="dashboardBottom">
        <table>
          <thead>
            <tr>
              <th className="status">Status</th>
              <th>Receiver</th>
              <th>deposit</th>
              <th>Process</th>
              <th>Start Time</th>
              <th>Stop Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loadingAndNo">Loading...</tr>
            ) : data.length === 0 ? (
              <tr className="loadingAndNo">No History To Show</tr>
            ) : (
              data.map((items: any, index: number) => {
                return <StreaminIndv data={items} />;
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardBottom;
