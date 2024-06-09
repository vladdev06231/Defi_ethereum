import { useSigner } from "wagmi";
import Instances from "../Utils/ContractInstances";
import dateTimeStamp from "../Utils/SecondHourDay";
import { ethers } from "ethers";
import { InputState } from "../src/Components/CreateStream/CreateStraem";
const useCreateStreamWithToken = (erc20Address: string) => {
  const { data } = useSigner();
  const { streamContractInstance, ERC20Instances } = Instances(erc20Address);

  async function createStreamWithToken(items: InputState) {
    const endTime = new Date(items?.endTime).getTime() / 1000;
    const startTime = new Date(items?.startTime).getTime() / 1000;
    const deposit = ethers.utils.parseEther(items?.deposit);
    const res2 = await ERC20Instances.connect(data).approve(
      streamContractInstance.address,
      deposit
    );

    await res2.wait();

    const res = await streamContractInstance
      .connect(data)
      .CreateStreamForToken(
        endTime,
        startTime,
        deposit,
        items.tokenAddress,
        items.receiver,
        dateTimeStamp[items?.periodicity],
        { gasLimit: 300000 }
      );
    await res.wait();
  }

  return { createStreamWithToken };
};

export default useCreateStreamWithToken;
