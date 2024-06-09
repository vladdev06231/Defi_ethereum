import { useSigner } from "wagmi";
import Instances from "../Utils/ContractInstances";
import { BigNumber } from "ethers";
const useCancelStream = () => {
  const { data } = useSigner();
  const { streamContractInstance } = Instances();

  async function cancelStream(streamId: BigNumber) {
    const res = await streamContractInstance
      .connect(data)
      .CancelStream(streamId, { gasLimit: 300000 });
    await res.wait();
  }

  return cancelStream;
};

export default useCancelStream;
