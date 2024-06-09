import React, { useState } from "react";
import { ActivityHistoryInput } from "../../../../hooks/withdrawingHistory";
import "./styles/CancelStream.css";
import useCancellingHistory from "../../../../hooks/CancellingStreamHistory";

export interface StreamsDataForCancellingHistory {
  streamId: string;
  sender: string;
  recipient: string;
  senderBalance: string;
  recipientBalance: string;
  tokenAddress: boolean;
}

type CancelStreamProps = {
  input: ActivityHistoryInput;
};

const CancelStream: React.FC<CancelStreamProps> = ({ input }) => {
  const [loading, setLoading] = useState(false);
  const [streamData, setStreamData] = useState<
    StreamsDataForCancellingHistory[]
  >([]);
  useCancellingHistory(setLoading, setStreamData, input);
  console.log(streamData);

  return (
    <>
      <div className="cancelStreams">
        <table>
          <thead>
            <tr>
              <th>Stream Id</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Sender Balance</th>
              <th>Receiver Balance</th>
            </tr>
          </thead>

          {loading ? (
            <div className="loadingAndNo">...Loading...</div>
          ) : streamData.length === 0 ? (
            <div className="loadingAndNo">No History To Show</div>
          ) : (
            streamData.map((items, index) => {
              return (
                <tr key={index}>
                  <td data-title="Stream Id">{Number(items.streamId)}</td>
                  <td data-title="Sender">
                    {items.sender.slice(0, 5)}...{items.sender.slice(37, 42)}
                  </td>
                  <td data-title="Receiver">
                    {items.recipient.slice(0, 5)}...
                    {items.recipient.slice(37, 42)}
                  </td>

                  <td data-title="Sender Balance">
                    {Number(items.senderBalance)}{" "}
                    {items.tokenAddress ? "Token" : "Eth"}{" "}
                  </td>
                  <td data-title="Receiver Balance">
                    {Number(items.recipientBalance)}
                    {items.tokenAddress ? "Token" : "Eth"}
                  </td>
                </tr>
              );
            })
          )}
        </table>
      </div>
    </>
  );
};

export default CancelStream;
