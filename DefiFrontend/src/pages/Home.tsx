import "../Styles/Home.css";
import { YourApp } from "../Components/CustomConnectButton";
import { useAccount } from "wagmi";
import { useState } from "react";
import Instances from "../../Utils/ContractInstances";
import CreateStraem from "../Components/CreateStream/CreateStraem";
const Home = () => {
  const [showStream, setShowStream] = useState(false);

  const { isConnected } = useAccount();
  const handleClick = () => {
    setShowStream((x) => !x);
  };
  const { streamContractInstance } = Instances();
  const getData = async () => {
    try {
      const data = await streamContractInstance.getStreamDetails(0);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(streamContractInstance);
  return (
    <>
      {showStream ? (
        <CreateStraem onClose={() => setShowStream(() => false)} />
      ) : null}
      <div className="home_Main_Container">
        <div className="home_Container">
          <div onClick={() => getData()}>
            Tap the button below to create your first stream
          </div>
          <div className="border"></div>
          <button
            className="createStream"
            onClick={isConnected ? handleClick : undefined}
          >
            <i className="fa-regular fa-paper-plane"></i> &nbsp;
            {isConnected ? "Create Stream" : <YourApp label="Create Stream" />}
          </button>
          <button className="getPaid">
            <i className="fa-solid fa-arrow-down arrow"></i> &nbsp; Get Paid
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
