import { BigNumber } from "ethers";

const TimeStampToValidDate = (timeStamp: BigNumber) => {
  const newTimeStamp = Number(timeStamp) * 1000 + 86400 * 1000;
  const date = new Date(newTimeStamp);
  const formattedDate = date.toISOString().slice(0, 10);
  return formattedDate;
};

export default TimeStampToValidDate;
