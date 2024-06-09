import { useContract } from "wagmi";
import defi from "../../Defi-main/artifacts/contracts/Lock.sol/Defi.json";
import ERC20Abi from "../../Defi-main/artifacts/contracts/ERC20.sol/ERC20Token.json";
import { useProvider } from "wagmi";

export interface ContractInstances {
  streamContractInstance: any;
  ERC20Instances: any;
}

export default function Instances(erc20address?: string): ContractInstances {
  const provider = useProvider();

  const streamContractInstance = useContract({
    address: "0x742B65b24285E9042033E78Ba86d2BDEbfaF7cd6",
    abi: defi.abi,
    signerOrProvider: provider,
  });

  const ERC20Instances = useContract({
    address: erc20address,
    abi: ERC20Abi.abi,
    signerOrProvider: provider,
  });

  return {
    streamContractInstance,
    ERC20Instances,
  };
}
