import { FormEvent, useState } from "react";
import "./styles/createStream.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../Loader/Loader";
import checkNotaNumber from "../../../Utils/CheckNumber";
import { useNetwork } from "wagmi";
import Assets from "../../../Utils/CryptoAddress";
import useCreateStreamWithToken from "../../../hooks/CreateStreamWithToken";
import useCreateStreamWithEth from "../../../hooks/CreateStreamWithEth";
import { toast } from "react-toastify";
export const EVM_Address_Regex = /^0x[a-fA-F0-9]{40}$/;

export interface InputState {
  receiver: string;
  deposit: string;
  tokenAddress: string;
  name?: string;
  image?: string;
  time?: string;
  startTime: Date;
  endTime: Date;
  periodicity: "second" | "hour" | "day";
}

interface CreateStreamProps {
  onClose: () => void;
}

const CreateStream = ({ onClose }: CreateStreamProps) => {
  const { chain } = useNetwork();
  const [input, setInput] = useState<InputState>({
    periodicity: "second",
    endTime: new Date(),
    startTime: new Date(),
    deposit: "",
    tokenAddress: "",
    receiver: "",
  });
  const [loader, setLoader] = useState(false);
  const [showCryptoDropdown, setCryptoDropdown] = useState(false);
  const { createStreamWithEth } = useCreateStreamWithEth();
  const { createStreamWithToken } = useCreateStreamWithToken(
    input.tokenAddress!
  );

  const handleClick = async (e: FormEvent) => {
    e.preventDefault();
    if (!EVM_Address_Regex.test(input?.receiver)) {
      return toast.error("Plz right Valid Receiver Address");
    }
    setLoader(() => true);

    try {
      if (input.tokenAddress === "eth") {
        await createStreamWithEth(input);
      } else {
        if (!EVM_Address_Regex.test(input?.tokenAddress)) {
          return toast.error("Plz write valid token address");
        }
        await createStreamWithToken(input);
      }
      toast.success("Successfull Created");
      onClose();
      setLoader(() => false);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
      setLoader(() => false);
    }
  };

  function handleDateChange(value: [Date, Date]) {
    setInput((x) => {
      return {
        ...x,
        startTime: value[0],
        endTime: value[1],
      };
    });
  }

  const SelectDropdown = (
    tokenAddress: string,
    name: string,
    image: string
  ) => {
    setInput((x) => {
      return {
        ...x,
        tokenAddress,
        name,
        image,
      };
    });
    showHideCryptoDropdown();
  };

  const options = ["second", "hour", "day"];
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "deposit" && checkNotaNumber(value)) return;
    setInput((x) => {
      return {
        ...x,
        [name]: value,
      };
    });
  };

  const showHideCryptoDropdown = () => {
    setCryptoDropdown((prev) => !prev);
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div>
          <div
            className="stream_Main_Container"
            onClick={() => onClose()}
          ></div>
          <form className="stream_Container" onSubmit={handleClick}>
            <div className="stream">Send Stream</div>
            <div>
              <label>
                <div>Receiver Wallet Address</div>
                <div>
                  <input
                    className="input"
                    name="receiver"
                    onChange={handleChange}
                    type="text"
                    required
                  />
                </div>
              </label>
            </div>
            <div className="tokenFlow">
              <label>
                <div className="Crypto">Crypto</div>
                <div
                  className="crypto"
                  onClick={() => showHideCryptoDropdown()}
                >
                  <div>
                    <div className="cryptoNameAndImagesIndv selectedCrypto">
                      {" "}
                      {input.name ? (
                        <img src={input.image} className="cryptoImages" />
                      ) : null}
                      <span> {input?.name ? input.name : "Select"}</span>
                      <i
                        className={
                          showCryptoDropdown
                            ? "fa-sharp fa-solid fa-arrow-down makeItUp"
                            : "fa-sharp fa-solid fa-arrow-down makeItDown"
                        }
                      ></i>
                    </div>
                  </div>
                  {showCryptoDropdown ? (
                    <div className="cryptoNameAndImages ">
                      {Assets[chain?.id || 80001].tokens.map((items, index) => {
                        return (
                          <div
                            className="cryptoNameAndImagesIndv"
                            onClick={() => {
                              SelectDropdown(
                                items.address,
                                items.name,
                                items.icon
                              );
                            }}
                          >
                            <div>
                              <img src={items.icon} className="cryptoImages" />
                            </div>
                            <div>{items.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </label>
              <div className="rateAndTime">
                <label>
                  <div>Amount & Periodicity</div>
                  <div className="twoInputs">
                    <input
                      name="deposit"
                      className="rate"
                      onChange={handleChange}
                      type="text"
                      required
                      value={input.deposit}
                    />
                    <select
                      className="time"
                      value={input?.periodicity}
                      name="periodicity"
                      onChange={handleChange}
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>
            </div>
            <div className="datePicker">
              <div>Select DateRange:</div>
              <ReactDatePicker
                minDate={new Date().setDate(new Date().getDate() + 1)}
                className="my-datepicker-class"
                portalId="date-picker-portal"
                selectsRange={true}
                dateFormat="yyyy/MM/dd"
                endDate={input.endTime}
                startDate={input.startTime}
                onChange={handleDateChange}
              />
            </div>

            <button type="submit">Send Stream</button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateStream;
