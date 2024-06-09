import React, { useState } from "react";
import "./styles/WithdrawStream.css";
import useWithdrawingHistory, {
  ActivityHistoryInput,
} from "../../../../hooks/withdrawingHistory";
import convertWeiToEther from "../../../../Utils/ConvertWeiToEther";
import TimeStampToValidDate from "../../../../Utils/TimeStampTODate";
import { BigNumber } from "ethers";

export interface StreamDataForWithdrawing {
  streamId: number;
  sender: string;
  receiver: string;
  amount: BigNumber;
  tokenAddress: string | null;
  time: BigNumber;
}

const WithdrawStreams = ({ input }: { input: ActivityHistoryInput }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [streamData, setStreamData] = useState<StreamDataForWithdrawing[]>([]);
  useWithdrawingHistory(setLoading, setStreamData, input);

  return (
    <>
      <div className="withDrawStreams">
        <table>
          <thead>
            <tr>
              <th>Stream Id</th>
              <th>Sender</th>
              <th>receiver</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="loadingAndNo">
                  ...Loading...
                </td>
              </tr>
            ) : streamData.length === 0 ? (
              <tr>
                <td colSpan={5} className="loadingAndNo">
                  No History To Show
                </td>
              </tr>
            ) : (
              streamData.map(
                (items: StreamDataForWithdrawing, index: number) => {
                  return (
                    <tr key={index}>
                      <td data-title="Stream Id">{Number(items.streamId)}</td>
                      <td data-title="Sender">
                        {`${items.sender.slice(0, 5)}...${items.sender.slice(
                          37,
                          42
                        )}`}
                      </td>
                      <td data-title="Receiver">
                        {`${items.receiver.slice(
                          0,
                          5
                        )}...${items.receiver.slice(37, 42)}`}
                      </td>
                      <td data-title="Amount">
                        {`${convertWeiToEther(items?.amount)} ${
                          items.tokenAddress ? "Token" : "Eth"
                        }`}
                      </td>
                      <td data-title="Time">
                        {TimeStampToValidDate(items?.time)}
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WithdrawStreams;
