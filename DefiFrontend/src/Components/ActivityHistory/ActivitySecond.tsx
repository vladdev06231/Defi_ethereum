import React from "react";
import ReactDatePicker from "react-datepicker";
import { ActivityHistoryInput } from "../../../hooks/withdrawingHistory";
import "./styles/ActivityHistorySecond.css";

export interface activityInput {
  address: string;
  startTime: Date | null;
  endTime: Date | null;
}
interface ActivityProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (value: [Date, Date]) => void;
  input: activityInput;
}
const ActivitySecond = ({
  handleChange,
  handleDateChange,
  input,
}: ActivityProps) => {
  return (
    <>
      <div className="activityDateAndAddress">
        <form>
          <input
            type="text"
            placeholder="Address.."
            name="address"
            onChange={handleChange}
          />
        </form>
        <div className="date">
          <div className="my-datepicker-class"> Something New Coming Soon</div>
          {false && (
            <ReactDatePicker
              placeholderText="Choose Date Range "
              className="my-datepicker-class"
              maxDate={new Date()}
              selectsRange
              dateFormat="yyyy/MM/dd"
              endDate={input?.endTime}
              startDate={input?.startTime}
              onChange={handleDateChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ActivitySecond;
