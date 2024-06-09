import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import "./styles/AllAddressCard.css";
import AddressContainerApi, {
  IndvAddressContainer,
} from "../../../../ContextApi/AddressContainerApi";

const AllAadressCard = () => {
  const value = useContext(AddressContainerApi);
  const [input, setInput] = useState<string>("");
  const [selectedObj, setSelectedObj] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [data, setData] = useState<IndvAddressContainer[]>(
    value?.addressContainer || []
  );

  const AddToSelectedAddressContainer = (items: IndvAddressContainer): void => {
    const res = localStorage.getItem("selectedAddress");

    if (!res) {
      let addressContainer = [items.address];
      localStorage.setItem("selectedAddress", JSON.stringify(addressContainer));
      value?.fetchSelectedAddressContainer();
      return;
    }

    const SelectedAddressContainerFromLocalStorage2 = JSON.parse(
      res
    ) as string[];

    SelectedAddressContainerFromLocalStorage2.push(items.address);
    localStorage.setItem(
      "selectedAddress",
      JSON.stringify(SelectedAddressContainerFromLocalStorage2)
    );
    value?.fetchSelectedAddressContainer();
  };

  const removeFromSelectedAddressContainer = (
    item: IndvAddressContainer
  ): void => {
    const res = localStorage.getItem("selectedAddress");
    if (!res) return;
    const SelectedAddressContainerFromLocalStorage = JSON.parse(
      res
    ) as string[];

    let data: string[] = [];

    SelectedAddressContainerFromLocalStorage.forEach((items) => {
      if (item.address !== items) {
        data.push(items);
      }
    });

    localStorage.setItem("selectedAddress", JSON.stringify(data));
    value?.fetchSelectedAddressContainer();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
    let filteredAddress: IndvAddressContainer[] = [];

    value?.addressContainer.forEach((items, index) => {
      if (
        items.address.toUpperCase().includes(e.target.value.toUpperCase()) ||
        items.name.toUpperCase().includes(e.target.value.toUpperCase())
      ) {
        filteredAddress.push(items);
      }
      setData(filteredAddress);
    });
  };

  useEffect(() => {
    let obj: { [key: string]: boolean } = {};
    value?.selectedAddressContainer.forEach((items) => {
      obj = { ...obj, [items]: true };
    });
    setSelectedObj(obj);
  }, [value?.selectedAddressContainer]);

  return (
    <>
      <div className="AllAddressCard">
        <form>
          <input
            type="text"
            className="addressInput"
            onChange={(e) => handleChange(e)}
            placeholder="Address Or Name"
          />
        </form>
        <div className="AllAddressAddressBook">Address Book</div>
        {data.map((items, index) => {
          return (
            <div className="AllAddressImageAddress" key={index}>
              <img src={items.image} className="AllAddressImage" />
              <span>{items.name}</span>
              <div
                className={
                  selectedObj[items.address]
                    ? "checkBox bgCheckBox"
                    : "checkBox"
                }
                onClick={() =>
                  selectedObj[items.address]
                    ? removeFromSelectedAddressContainer(items)
                    : AddToSelectedAddressContainer(items)
                }
              ></div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AllAadressCard;
