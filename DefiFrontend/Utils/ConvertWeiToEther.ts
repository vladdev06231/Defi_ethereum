import { BigNumber, ethers } from "ethers";

const convertWeiToEther = (n: BigNumber) => ethers.utils.formatEther(n);

export default convertWeiToEther;
