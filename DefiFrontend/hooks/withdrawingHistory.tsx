import React from "react";
import { useAccount } from "wagmi";
import { StreamDataForWithdrawing } from "../src/Components/ActivityHistory/Card/WithdrawStreams";
import Instances from "../Utils/ContractInstances";
import EthereumBlockByDate from "../Utils/EthereumBlockByDate";
export interface ActivityHistoryInput {
  address: string;
  startTime: Date | null;
  endTime: Date | null;
}

const usewWithdrawingHistory = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setStreamData: React.Dispatch<
    React.SetStateAction<StreamDataForWithdrawing[]>
  >,
  input: ActivityHistoryInput
) => {
  const { address } = useAccount();
  const { streamContractInstance } = Instances();
  const getBlockByDate = EthereumBlockByDate();
  const fetchWithDrawHistory = async () => {
    const from = !input.startTime ? 0 : await getBlockByDate(input?.startTime);
    const to = !input.endTime ? "latest" : await getBlockByDate(input?.endTime);
    const msgSender = !input.address ? address : input.address;
    setLoading(() => true);
    try {
      const filterForEthAsSender =
        streamContractInstance.filters.WithdrawDepositOfStreamWithEth(address);
      const filterForEthAsReceiver =
        streamContractInstance.filters.WithdrawDepositOfStreamWithEth(
          null,
          msgSender,
          null,
          null,
          null
        );

      const filterForTokenAsReceiver =
        streamContractInstance.filters.WithdrawDepositOfStreamWithToken(
          msgSender,
          null,
          null,
          null,
          null,
          null
        );

      const filterForTokenAsSender =
        streamContractInstance.filters.WithdrawDepositOfStreamWithToken(
          null,
          msgSender,
          null,
          null,
          null,
          null
        );

      const eventForEthAsSender = await streamContractInstance.queryFilter(
        filterForEthAsSender,
        from,
        to
      );
      const eventAsSenderForToken = await streamContractInstance.queryFilter(
        filterForTokenAsSender,
        0,
        to
      );
      const eventAsReceiverForToken = await streamContractInstance.queryFilter(
        filterForTokenAsReceiver,
        0,
        to
      );

      const eventAsReceiverForEth = await streamContractInstance.queryFilter(
        filterForEthAsReceiver
      );
      let data: StreamDataForWithdrawing[] = [];

      eventAsReceiverForEth.map((items: any) => {
        data.push(items.args);
      });
      eventForEthAsSender.map((items: any) => {
        data.push(items.args);
      });
      eventAsReceiverForToken.map((items: any) => {
        data.push(items.args);
      });
      eventAsSenderForToken.map((items: any) => {
        data.push(items.args);
      });
      setLoading(() => false);
      setStreamData(() => data);
      console.log("arrya", data);
    } catch (error) {
      console.log(error);
      setLoading(() => false);
    }
  };

  React.useEffect(() => {
    fetchWithDrawHistory();
  }, [input, address]);
};

export default usewWithdrawingHistory;
