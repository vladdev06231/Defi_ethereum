import React from "react";
import "./styles/AllStreamCard.css";

const AllStreamCard = () => {
  const Stream = [
    {
      name: " All Stream",
      css: "fa-solid fa-bars",
    },
    {
      name: "Has Active Streams",
      css: "fa-solid fa-check",
    },
    {
      name: "Has No Active Streams",
      css: "fa-solid fa-xmark",
    },
  ];

  return (
    <>
      <div className="AllStreamCard">
        {Stream.map((items, index) => {
          return (
            <div className="streamIndv">
              <div className="icon">
                <i className={`${items.css}`}></i>
              </div>
              <div>{items.name}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AllStreamCard;
