import { createContext } from "react";

export interface IndvAddressContainer {
  name: string;
  address: string;
  image: string;
  activeStream?: string;
}

export interface AddressContainerApiInterface {
  addressContainer: IndvAddressContainer[];
  fetchAddressContainer: () => void;
  selectedAddressContainer: string[];
  fetchSelectedAddressContainer: () => void;
  addressObj: any;
}

const AddressContainerApi = createContext<AddressContainerApiInterface | null>(
  null
);

export default AddressContainerApi;
