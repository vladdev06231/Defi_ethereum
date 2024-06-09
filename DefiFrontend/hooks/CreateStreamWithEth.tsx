import { ethers } from "ethers";
import { useSigner } from "wagmi";
import { InputState } from "../src/Components/CreateStream/CreateStraem";
import Instances from "../Utils/ContractInstances";
import dateTimeStamp from "../Utils/SecondHourDay";
const useCreateStreamWithEth = () => {
  const { data } = useSigner();
  const { streamContractInstance } = Instances();

  async function createStreamWithEth(items: InputState) {
    const endTime = new Date(items?.endTime).getTime() / 1000;
    const startTime = new Date(items?.startTime).getTime() / 1000;
    const deposit = ethers.utils.parseEther(items.deposit);
    console.log(startTime);
    console.log(endTime);

    const res = await streamContractInstance
      .connect(data)
      .CreateStreamForEth(
        endTime,
        startTime,
        items.receiver,
        dateTimeStamp[items?.periodicity],
        {
          value: deposit,
          gasLimit: 300000,
        }
      );
    await res.wait();
  }

  return { createStreamWithEth };
};

export default useCreateStreamWithEth;
