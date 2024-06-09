import React, { useContext } from "react";
import AddressBookTop from "../Components/AddressBook/AddressBookTop";
import AddressBookMiddle from "../Components/AddressBook/AddressBookMiddle";
import AddressBookBottom from "../Components/AddressBook/AddressBookBottom";
import "../Styles/AddressBook.css";
import AddressContainerApi from "../../ContextApi/AddressContainerApi";
import { IndvAddressContainer } from "../../ContextApi/AddressContainerApi";
import { toast } from "react-toastify";
const AddressBook = () => {
  const value = useContext(AddressContainerApi);

  const [removeAddressBool, setRemoveAddressBool] = React.useState(false);
  const [objRemoveCheckBox, setObjRemoveCheckBox] = React.useState<{
    [key: string]: boolean;
  }>({});

  const AddRemoveAnAdressToRemovingObj = (
    address: string,
    contain: boolean
  ) => {
    setObjRemoveCheckBox((prev) => {
      return {
        ...prev,
        [address]: contain,
      };
    });
  };

  const RemoveSelectedAddressFromAddressContainer = () => {
    const res = localStorage.getItem("MainAddress");
    if (!res) return;
    const AddressContainerFromLocalStorage = JSON.parse(res);

    let data: IndvAddressContainer[] = [];
    AddressContainerFromLocalStorage.map((items: IndvAddressContainer) => {
      if (!objRemoveCheckBox[items.address]) return data.push(items);
    });
    localStorage.setItem("MainAddress", JSON.stringify(data));
    value?.fetchAddressContainer();
    setObjRemoveCheckBox({});
    const res2 = localStorage.getItem("selectedAddress");
    if (!res2) return;
    const SelectedAddressContainerFromLocalStorage2 = JSON.parse(res2);

    let data2: string[] = [];

    SelectedAddressContainerFromLocalStorage2.map((items: string) => {
      if (!objRemoveCheckBox[items]) return data2.push(items);
    });

    localStorage.setItem("selectedAddress", JSON.stringify(data2));
    value?.fetchSelectedAddressContainer();
    toast.success("Sucessfully Removed");
  };

  return (
    <>
      <div className="AddressBookContainer">
        <AddressBookTop />
        <AddressBookMiddle
          removeAddressBool={removeAddressBool}
          setRemoveAddressBool={setRemoveAddressBool}
          RemoveSelectedAddressFromAddressContainer={
            RemoveSelectedAddressFromAddressContainer
          }
        />
        <AddressBookBottom
          removeAddressBool={removeAddressBool}
          objRemoveCheckBox={objRemoveCheckBox}
          AddRemoveAnAdressToRemovingObj={AddRemoveAnAdressToRemovingObj}
        />
      </div>
    </>
  );
};

export default AddressBook;
