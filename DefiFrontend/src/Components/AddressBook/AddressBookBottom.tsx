import React, { useContext, useState, useEffect } from "react";
import "./styles/AddressBookBottom.css";
import AddressContainerApi, {
  IndvAddressContainer,
} from "../../../ContextApi/AddressContainerApi";
import { TokenAddress } from "../../../Children/AddressContainer";

interface AddressBookBottomProps {
  removeAddressBool: boolean;
  objRemoveCheckBox: Record<string, boolean>;
  AddRemoveAnAdressToRemovingObj: (address: string, contain: boolean) => void;
}

const AddressBookBottom = ({
  removeAddressBool,
  objRemoveCheckBox,
  AddRemoveAnAdressToRemovingObj,
}: AddressBookBottomProps) => {
  const value = useContext(AddressContainerApi);
  console.log(value);

  const [showingAddrress, setShowingAddress] = useState<IndvAddressContainer[]>(
    []
  );
  console.log(showingAddrress);

  useEffect(() => {
    if (!value?.selectedAddressContainer || !value?.addressContainer) return;
    if (value?.selectedAddressContainer.length === 0) {
      setShowingAddress(value?.addressContainer);
    } else {
      let data: IndvAddressContainer[] = [];
      for (let i = 0; i < value?.addressContainer.length; i++) {
        for (let j = 0; j < value?.selectedAddressContainer.length; j++) {
          if (
            value?.addressContainer[i].address ===
            value?.selectedAddressContainer[j]
          ) {
            data.push(value?.addressContainer[i]);
          }
        }
      }
      setShowingAddress(data);
    }
  }, [value?.selectedAddressContainer, value?.addressContainer]);
  const CopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };
  return (
    <>
      <div className="addressBookBotom">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ENS Name</th>
              <th>Address</th>
              <th>Active Streams </th>
            </tr>
          </thead>
          <tbody>
            {showingAddrress.length === 0 ? (
              <div>
                <div className="NoAddressAvailable">No Addresses Available</div>
              </div>
            ) : (
              showingAddrress.map((items, index) => {
                return (
                  <tr key={index}>
                    <td data-title="Name" className="imageName">
                      <div className="addressImageContainer">
                        <img src={items.image} className="addressImages" />
                        {items.name}
                      </div>
                    </td>
                    <td data-title="ENS Name">
                      {items.address.slice(0, 5)}...
                      {items.address.slice(37, 42)}
                    </td>
                    <td data-title="Address">
                      {items.address.slice(0, 5)}...
                      {items.address.slice(37, 42)}&nbsp;
                      <i
                        className="fa-solid fa-copy copyAddress"
                        onClick={() => CopyAddress(items.address)}
                      ></i>
                    </td>
                    <td data-title="Active Streams">-</td>
                    {removeAddressBool && (
                      <td>
                        <div
                          className={
                            objRemoveCheckBox[items.address]
                              ? "bgCheckBox checkBox"
                              : "checkBox"
                          }
                          onClick={() =>
                            AddRemoveAnAdressToRemovingObj(
                              items.address,
                              objRemoveCheckBox[items.address] ? false : true
                            )
                          }
                        />
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddressBookBottom;
