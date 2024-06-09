import { useSigner } from "wagmi";
import Instances from "../Utils/ContractInstances";
const useWithdrawFromStream = () => {
  const { data } = useSigner();
  const { streamContractInstance } = Instances();

  async function WithdrawFromStream(streamId: number) {
    const res = await streamContractInstance
      .connect(data)
      .withdrawFromStream(streamId, { gasLimit: 300000 });

    await res.wait();
  }

  return WithdrawFromStream;
};

export default useWithdrawFromStream;
