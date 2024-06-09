import React, { ChangeEvent, useContext } from "react";
import Images from "../../../Datas/ImageData";
import "./styles/AddAnAddress.css";
import AddressContainerApi from "../../../../ContextApi/AddressContainerApi";
import { EVM_Address_Regex } from "../../CreateStream/CreateStraem";
import { toast } from "react-toastify";
const AddAnAddress = ({ hideAddAddress }: { hideAddAddress: () => void }) => {
  const [input, setInput] = React.useState({
    name: "",
    address: "",
  });

  const value = useContext(AddressContainerApi);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const MakeObjectOfImageAndAddress = () => {
    const randomImages = Date.now() % 3;
    let AddressData = {
      address: input.address,
      name: input.name,
      image: Images[randomImages],
    };
    return AddressData;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EVM_Address_Regex.test(input?.address)) {
      return toast.error("Plz right Valid Addres");
    }

    const res = localStorage.getItem("MainAddress");
    const AddressContainerFromLocalStorage = res ? JSON.parse(res) : null;
    console.log(res);

    if (!res || AddressContainerFromLocalStorage.length === 0) {
      let addressContainer = [];
      let data = MakeObjectOfImageAndAddress();
      addressContainer.push(data);
      console.log(addressContainer);
      localStorage.setItem("MainAddress", JSON.stringify(addressContainer));
      hideAddAddress();
      toast.success("Address Added SuccessFully");
      return value?.fetchAddressContainer();
    }

    let data = MakeObjectOfImageAndAddress();
    AddressContainerFromLocalStorage.push(data);

    localStorage.setItem(
      "MainAddress",
      JSON.stringify(AddressContainerFromLocalStorage)
    );
    value?.fetchAddressContainer();
    hideAddAddress();
    toast.success("Addresss Added Successfully");
  };
  return (
    <>
      <div className="AddAddress">
        <i
          className="fa-solid fa-xmark cross fa-xl"
          onClick={() => hideAddAddress()}
        ></i>
        <div className="addAdnAddressTopic">Add An Address</div>
        <form onSubmit={handleSubmit} className="addAddressForm">
          <input
            name="name"
            type="text"
            onChange={(e) => handleChange(e)}
            placeholder="Name"
            required
          />
          <input
            name="address"
            type="text"
            onChange={(e) => handleChange(e)}
            placeholder="Address Or ENS"
            required
          />
          <button type="submit"></button>
        </form>
      </div>
    </>
  );
};

export default AddAnAddress;
