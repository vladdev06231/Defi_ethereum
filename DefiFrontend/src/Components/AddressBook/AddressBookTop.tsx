import React from "react";
import "./styles/AddressBookTop.css";

const AddressBookTop = () => {
  return (
    <>
      <section className="AddressBookTop">
        <div className="AddressBookTopLeft">Address Book</div>
        <div className="AddressBookTopRight">
          {/* <div className="importExport">Import</div>
          <div className="importExport">Export</div> */}
        </div>
      </section>
    </>
  );
};

export default AddressBookTop;
