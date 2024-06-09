import React from "react";
import { useAccount } from "wagmi";
import Instances from "../Utils/ContractInstances";
import { ActivityHistoryInput } from "./withdrawingHistory";
import { StreamsDataForCancellingHistory } from "../src/Components/ActivityHistory/Card/CancelStream";
import EthereumBlockByDate from "../Utils/EthereumBlockByDate";

const useCancellingHistory = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setStreamData: React.Dispatch<
    React.SetStateAction<StreamsDataForCancellingHistory[]>
  >,
  input: ActivityHistoryInput
) => {
  const { address } = useAccount();

  const { streamContractInstance } = Instances();
  const getBlockByDate = EthereumBlockByDate();
  const fetchWithDrawHistory = async () => {
    try {
      setLoading(() => true);
      const from = !input.startTime
        ? 0
        : await getBlockByDate(input?.startTime);
      const to = !input.endTime
        ? "latest"
        : await getBlockByDate(input?.endTime);

      let msgSender = !input.address ? address : input.address;
      console.log(msgSender);
      const filterForEthAsSender =
        streamContractInstance.filters.CancelStreamWithEth(
          null,
          msgSender,
          null,
          null,
          null
        );
      const filterForEthAsReceiver =
        streamContractInstance.filters.CancelStreamWithEth(
          null,
          null,
          msgSender,
          null,
          null
        );
      const filterForTokenAsReceiver =
        streamContractInstance.filters.CancelStreamWithToken(
          null,
          null,
          msgSender,
          null,
          null,
          null
        );
      const filterForTokenAsSender =
        streamContractInstance.filters.CancelStreamWithToken(
          null,
          msgSender,
          null,
          null,
          null,
          null
        );
      const eventAsReceiverForToken = await streamContractInstance.queryFilter(
        filterForEthAsSender,
        from,
        to
      );
      const eventAsSenderForEth = await streamContractInstance.queryFilter(
        filterForTokenAsSender,
        from,
        to
      );

      const eventAsReceiverForEth = await streamContractInstance.queryFilter(
        filterForTokenAsReceiver,
        from,
        to
      );

      const eventAsSenderForToken = await streamContractInstance.queryFilter(
        filterForEthAsReceiver,
        from,
        to
      );
      let data: StreamsDataForCancellingHistory[] = [];

      eventAsReceiverForEth.map((items: any) => {
        data.push(items.args);
      });
      eventAsSenderForEth.map((items: any) => {
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
    } catch (error) {
      setLoading(() => false);
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchWithDrawHistory();
  }, [address, input]);
};

export default useCancellingHistory;
