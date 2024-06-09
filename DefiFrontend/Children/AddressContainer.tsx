import React, { ReactNode, useState, useEffect } from "react";
import AddressContainerApi, {
  IndvAddressContainer,
} from "../ContextApi/AddressContainerApi";
import { useNetwork } from "wagmi";
import Assets from "../Utils/CryptoAddress";

export interface TokenAddress {
  [key: string]: {
    name: string;
    icon: string;
  };
}

const AddressContainer = ({ children }: { children: ReactNode }) => {
  const [addressContainer, setAddressContainer] = useState<
    IndvAddressContainer[]
  >([]);
  const [selectedAddressContainer, setSelectedAddressContainer] = useState([]);
  const [addressObj, setAddressObj] = useState<TokenAddress>({});

  const { chain } = useNetwork();
  const fetchAddressContainer = () => {
    const res = localStorage.getItem("MainAddress");
    if (!res) return;
    const AddressContainerFromLocalStorage = JSON.parse(res);
    setAddressContainer(() => AddressContainerFromLocalStorage);
  };
  const fetchSelectedAddressContainer = () => {
    const res = localStorage.getItem("selectedAddress");
    if (!res) return;
    const array = JSON.parse(res);
    setSelectedAddressContainer(() => array);
  };

  const fetchTokenAddress = () => {
    let obj: TokenAddress = {};

    Assets[80001].tokens.map((items) => {
      obj = {
        ...obj,
        [items.address]: {
          name: items.name,
          icon: items.icon,
        },
      };
    });
    setAddressObj(() => obj);
  };

  useEffect(() => {
    fetchAddressContainer();
    fetchSelectedAddressContainer();
  }, []);

  useEffect(() => {
    if (!chain) return;
    fetchTokenAddress();
  }, [chain]);

  const value = {
    addressContainer,
    selectedAddressContainer,
    fetchAddressContainer,
    fetchSelectedAddressContainer,
    addressObj,
  };
  return (
    <AddressContainerApi.Provider value={value}>
      {children}
    </AddressContainerApi.Provider>
  );
};

export default AddressContainer;
