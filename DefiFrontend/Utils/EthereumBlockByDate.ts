import React from "react";
import { useProvider } from "wagmi";
import EthDater from "ethereum-block-by-date";
const EthereumBlockByDate = () => {
  const provider = useProvider();
  const dater = new EthDater(
    provider // Ethers provider, required.
  );

  const getBlockByDate = async (date: Date) => {
    let block = dater.getDate(
      date, // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
      true, // Block after, optional. Search for the nearest block before or after the given date. By default true.
      false // Refresh boundaries, optional. Recheck the latest block before request. By default false.
    );
    return block;
  };

  return getBlockByDate;
};

export default EthereumBlockByDate;
