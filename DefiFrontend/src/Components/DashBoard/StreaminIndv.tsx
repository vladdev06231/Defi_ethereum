import React, { useContext } from "react";
import Instances from "../../../Utils/ContractInstances";
import convertWeiToEther from "../../../Utils/ConvertWeiToEther";
import useWithdrawFromStream from "../../../hooks/useWithdraw";
import Loader from "../Loader/Loader";
import TimeStampToValidDate from "../../../Utils/TimeStampTODate";
import AddressContainerApi from "../../../ContextApi/AddressContainerApi";
import useCancelStream from "../../../hooks/CancellingStream";
import { toast } from "react-toastify";
import { TokenAddress } from "../../../Children/AddressContainer";

interface Props {
  data: any;
}

const StreaminIndv: React.FC<Props> = ({ data }) => {
  const [dataFromContract, setDatFromContract] = React.useState<any>();
  const [showCancelWithdraw, setShowCancelWithdraw] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const value = useContext(AddressContainerApi);

  const { streamContractInstance } = Instances();
  const cancelStream = useCancelStream();

  const WithdrawStream = useWithdrawFromStream();

  const fetchStreamData = async () => {
    const res = await streamContractInstance.getStreamDetails(data.streamId);
    setDatFromContract(res);
    console.log(res);
  };

  React.useEffect(() => {
    fetchStreamData();
  }, []);

  const showAndHideCancelAndWithdraw = () => {
    setShowCancelWithdraw((prev) => !prev);
  };

  const Withdraw = async () => {
    setLoader(() => true);
    try {
      await WithdrawStream(Number(data.streamId));
      setLoader(() => false);
      fetchStreamData();
      toast.success("Successfully Withdrawn");
    } catch (error) {
      console.log(error);
      setLoader(() => false);
      toast.error("Something Went Wrong");
    }
  };

  const Cancel = async () => {
    setLoader(() => true);
    try {
      await cancelStream(data.streamId);
      setLoader(() => false);
      fetchStreamData();
      toast.success("Successfully Withdrawn");
    } catch (error) {
      console.log(error);
      setLoader(() => false);
      toast.error("Something Went Wrong");
    }
  };

  if (!dataFromContract || !value?.addressObj) return null;

  let exist = dataFromContract.Exist;

  return (
    <tr>
      <td data-title="Status" className="status">
        <div className={exist ? "Streaming" : "Cancelled"}>
          {exist ? "Streaming" : "Cancelled"}
          {showCancelWithdraw ? (
            <div
              onClick={() => showAndHideCancelAndWithdraw()}
              className="coverScreen"
            ></div>
          ) : null}
          {loader ? <Loader /> : null}
        </div>
      </td>
      <td data-title="Receiver" className="receiver">
        {data.receiver.slice(0, 8)}....
        {data.receiver.slice(34, 42)}
      </td>
      <td data-title="Deposit" className="Deposit">
        <span>
          {!data.tokenAddress
            ? convertWeiToEther(dataFromContract.deposit)
            : Number(dataFromContract.deposit) /
              10 ** value?.addressObj[dataFromContract.tokenAddress].decimal}
        </span>

        <div className="cryptoDashboard">
          <img
            src={
              !data.TokenAddress
                ? value?.addressObj["eth"].icon
                : value?.addressObj[data.TokenAddress].icon
            }
            className="cryptoImagesDashboard"
          />
          {!data.TokenAddress
            ? "Eth"
            : value?.addressObj[data.TokenAddress].name}
        </div>
      </td>
      <td data-title="Process" className="bar">
        <div className="progressBar">
          <div
            className={
              dataFromContract.Exist
                ? "progressBarGreenColor"
                : "progressBarGreenColor progressBarRedColor"
            }
            style={{
              width: `${
                (Number(convertWeiToEther(dataFromContract.balanceOut)) /
                  Number(convertWeiToEther(dataFromContract.deposit))) *
                100
              }%`,
              height: "4px",
            }}
          ></div>
        </div>
      </td>
      <td data-title="End Time">
        {TimeStampToValidDate(dataFromContract.startTime)}
      </td>
      <td data-title="Start Time">
        {TimeStampToValidDate(dataFromContract.endTime)}
      </td>
      <td>
        <i
          className="fa-solid fa-ellipsis-vertical fa-2x ellipse"
          onClick={() => showAndHideCancelAndWithdraw()}
        ></i>
        {showCancelWithdraw ? (
          <div className="cancelWithdraw">
            <div
              className={
                exist
                  ? " addAddress Withdraw"
                  : "addAddress withdraw withOpacity"
              }
              onClick={() => (exist ? Withdraw() : undefined)}
            >
              Withdraw
            </div>
            <div
              className={exist ? " removeAddress" : "removeAddress withOpacity"}
              onClick={() => (exist ? Cancel() : undefined)}
            >
              Cancel
            </div>
          </div>
        ) : null}
      </td>
    </tr>
  );
};

export default StreaminIndv;
