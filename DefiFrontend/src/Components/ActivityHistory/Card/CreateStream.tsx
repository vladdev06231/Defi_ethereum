import React, { useState } from "react";
import useCreatingStreamHistory from "../../../../hooks/creatingStreamHistory";
import "./styles/CreateStreams.css";
import convertWeiToEther from "../../../../Utils/ConvertWeiToEther";
import TimeStampToValidDate from "../../../../Utils/TimeStampTODate";
import { BigNumber } from "ethers";
import { ActivityHistoryInput } from "../../../../hooks/withdrawingHistory";

export interface StreamData {
  streamId: string;
  sender: string;
  receiver: string;
  deposit: BigNumber;
  TokenAddress: boolean;
  startTime: BigNumber;
  endTime: BigNumber;
}

const CreateStreams = ({ input }: { input: ActivityHistoryInput }) => {
  const [loading, setLoading] = useState(false);
  const [streamData, setStreamData] = useState<StreamData[]>([]);
  useCreatingStreamHistory(setLoading, setStreamData, true, input);

  return (
    <>
      <div className={"createStreams"}>
        <table className={loading ? "tbody" : ""}>
          <thead>
            <tr>
              <th>Stream Id</th>
              <th>Sender</th>
              <th>receiver</th>
              <th>Deposit</th>
              <th>StartTime</th>
              <th>EndTime</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loadingAndNo">Loading...</tr>
            ) : streamData.length === 0 ? (
              <tr className="loadingAndNo">No History To Show</tr>
            ) : (
              streamData.map((items, index) => {
                return (
                  <tr key={index}>
                    <td data-title="Stream Id">{Number(items.streamId)}</td>
                    <td data-title="Sender">
                      {items.sender.slice(0, 5)}...
                      {items.sender.slice(37, 42)}
                    </td>
                    <td data-title="Receiver">
                      {items.receiver.slice(0, 5)}...
                      {items.receiver.slice(37, 42)}
                    </td>
                    <td data-title="Deposit">
                      {convertWeiToEther(items.deposit)}{" "}
                      {items.TokenAddress ? "Token" : "Eth"}{" "}
                    </td>
                    <td data-title="Start Time">
                      {TimeStampToValidDate(items.startTime)}
                    </td>
                    <td data-title="End Time">
                      {TimeStampToValidDate(items.endTime)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CreateStreams;
