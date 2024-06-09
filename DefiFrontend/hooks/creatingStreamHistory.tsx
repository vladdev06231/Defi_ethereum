import React from "react";
import { useAccount } from "wagmi";
import Instances from "../Utils/ContractInstances";
import { StreamData } from "../src/Components/ActivityHistory/Card/CreateStream";
import { ActivityHistoryInput } from "./withdrawingHistory";

const useCreatingStreamHistory = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setStreamData: React.Dispatch<React.SetStateAction<StreamData[]>>,
  fromActivity: boolean,
  input?: ActivityHistoryInput
) => {
  const { address } = useAccount();
  const { streamContractInstance } = Instances();

  const fetchCreateStreamHistory = async () => {
    if (!address) return;
    let msgSender: string | undefined;
    if (fromActivity) {
      msgSender = !input?.address ? address : input?.address;
    } else {
      msgSender = address;
    }

    setLoading(() => true);
    try {
      const filtersAsReceiverForEth =
        streamContractInstance.filters.CreatingStreamWithEth(
          msgSender,
          null,
          null,
          null,
          null,
          null
        );
      const filtersAsSenderForEth =
        streamContractInstance.filters.CreatingStreamWithEth(
          null,
          msgSender,
          null,
          null,
          null,
          null
        );

      const filterAsReceiverForToken =
        streamContractInstance.filters.CreatingStreamWithToken(
          msgSender,
          null,
          null,
          null,
          null,
          null,
          null
        );
      const filterAsSenderForToken =
        streamContractInstance.filters.CreatingStreamWithToken(
          null,
          msgSender,
          null,
          null,
          null,
          null,
          null
        );

      const eventAsReceiverForToken = await streamContractInstance.queryFilter(
        filterAsReceiverForToken
      );
      const eventAsSenderForEth = await streamContractInstance.queryFilter(
        filtersAsSenderForEth
      );

      const eventAsReceiverForEth = await streamContractInstance.queryFilter(
        filtersAsReceiverForEth
      );

      const eventAsSenderForToken = await streamContractInstance.queryFilter(
        filterAsSenderForToken
      );
      let data: StreamData[] = [];

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
    } catch (err) {
      setLoading(() => false);
      console.log(err);
    }
  };
  React.useEffect(() => {
    fetchCreateStreamHistory();
  }, [address, input]);
};

export default useCreatingStreamHistory;
