import React, { useContext } from "react";
import "./styles/AddressBookMiddle.css";
import AllAadressCard from "./Cards/AllAadressCard";
import AllStreamCard from "./Cards/AllStreamCard";
import AddAnAddress from "./Cards/AddAnAddress";
import AddressContainerApi from "../../../ContextApi/AddressContainerApi";

interface AdressBookMiddleProps {
  removeAddressBool: boolean;
  setRemoveAddressBool: React.Dispatch<React.SetStateAction<boolean>>;
  RemoveSelectedAddressFromAddressContainer: () => void;
}

const AddressBookMiddle = ({
  removeAddressBool,
  setRemoveAddressBool,
  RemoveSelectedAddressFromAddressContainer,
}: AdressBookMiddleProps) => {
  const [allAdressesShow, setAllAddressShow] = React.useState(false);
  const [allStreamsShow, setAllShowStreams] = React.useState(false);
  const [showAddAddress, setShowAddAddress] = React.useState(false);
  const value = useContext(AddressContainerApi);
  const showAlddAddress = () => {
    setAllAddressShow((prev) => !prev);
  };

  const showAllStreams = () => {
    setAllShowStreams((prev) => !prev);
  };

  const hideAllAddress = () => {
    setAllAddressShow(() => false);
  };

  const hideAllStreams = () => {
    setAllShowStreams(() => false);
  };

  const hideStreamAndAddress = () => {
    hideAllAddress();
    hideAllStreams();
    hideAddAddress();
  };

  const hideAddAddress = () => {
    setShowAddAddress(() => false);
  };

  const ShowAddAddress = () => {
    setShowAddAddress(() => true);
  };

  const showRemoveAddress = () => {
    setRemoveAddressBool(() => true);
  };

  const hideRemoveAddAddress = () => {
    setRemoveAddressBool(() => false);
  };

  return (
    <>
      {allAdressesShow || allStreamsShow || showAddAddress ? (
        <div
          className={
            showAddAddress ? "coverScreen bgCoverScreen" : "coverScreen"
          }
          onClick={() => hideStreamAndAddress()}
        ></div>
      ) : null}
      {showAddAddress ? <AddAnAddress hideAddAddress={hideAddAddress} /> : null}
      <div className="AddressBookMiddle">
        <div className="AddressBookMiddleLeftAndRight  resDrop">
          <div className="allAddessContainer">
            <div
              className="allAddressAllStreams"
              onClick={() => showAlddAddress()}
            >
              {value?.selectedAddressContainer.length === 0
                ? " All Adrresses"
                : "Selected Adrresses"}
              <i
                className={
                  allAdressesShow
                    ? "fa-sharp fa-solid fa-arrow-down makeItUp"
                    : "fa-sharp fa-solid fa-arrow-down makeItDown"
                }
              ></i>
            </div>
            {allAdressesShow ? (
              <div className="addressOption adressesAndStreamOption ">
                {" "}
                <AllAadressCard />
              </div>
            ) : null}
          </div>
          <div className="allAddessContainer">
            <div
              className="allAddressAllStreams"
              onClick={() => showAllStreams()}
            >
              <span>All Streams</span>
              {/* <i
                className={
                  allStreamsShow
                    ? "fa-sharp fa-solid fa-arrow-down makeItUp"
                    : "fa-sharp fa-solid fa-arrow-down makeItDown"
                }></i> */}
            </div>
            {false ? (
              <div className="adressesAndStreamOption streamOption">
                <AllStreamCard />
              </div>
            ) : null}
          </div>
        </div>
        {!removeAddressBool ? (
          <div className="AddressBookMiddleLeftAndRight resMoveTop">
            <div className="addAddress " onClick={() => ShowAddAddress()}>
              <span>Add</span>
              <span className="cancelInResponsive">Address</span>
            </div>
            <div className="removeAddress " onClick={() => showRemoveAddress()}>
              Remove <span className="cancelInResponsive">Address</span>
            </div>
          </div>
        ) : (
          <div className="AddressBookMiddleLeftAndRight resMoveTop">
            <div
              className={
                value?.addressContainer.length === 0
                  ? "removeAddress disableRemoveAddress"
                  : "removeAddress"
              }
              onClick={() =>
                value?.addressContainer.length === 0
                  ? null
                  : RemoveSelectedAddressFromAddressContainer()
              }
            >
              Confirm <span className="cancelInResponsive">Remove</span>
            </div>
            <div
              className="removeAddress cancelRemove"
              onClick={() => hideRemoveAddAddress()}
            >
              Cancel
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddressBookMiddle;
