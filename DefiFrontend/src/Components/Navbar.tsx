import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";
import { YourApp } from "./CustomConnectButton";
import { useAccount } from "wagmi";

export default function Navbar() {
  const [res, setRes] = React.useState(true);
  const { isConnected } = useAccount();

  const navigate = useNavigate();

  return (
    <>
      <section className="main_Nav">
        <nav className="Nabvar_Container">
          <div className="navbar_Left">
            <div
              className="logo"
              onClick={() => {
                navigate("/"), setRes(true);
              }}>
              <span className="logo_Big">Stream </span>
              <span className="logo_Small">Hub</span>
            </div>
          </div>

          <ul
            className={
              res ? "linkContainer" : " linkContainer reslinkContainer"
            }
            onClick={() => setRes(true)}>
            <li>
              <NavLink to="/dashboard" className="link">
                <span>
                  <i className="fa-solid fa-table-columns"></i>{" "}
                </span>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="bg_Color">
              <NavLink to="/addressbook" className="link">
                <span>
                  <i className="fa-solid fa-landmark "></i>{" "}
                </span>{" "}
                <span>Address Book</span>
              </NavLink>
            </li>
            <li className="bg_Color">
              <NavLink to="/activityHistory" className="link">
                <span>
                  <i className="fa-solid fa-landmark "></i>{" "}
                </span>{" "}
                <span>Activity History</span>
              </NavLink>
            </li>

            <li>
              <span>
                {" "}
                {!isConnected && <i className="fa-solid fa-user"></i>}
              </span>
              <YourApp label="Sign In" />
            </li>
          </ul>
        </nav>
        <div className="ham" onClick={() => setRes((x) => !x)}>
          {res ? (
            <i className="fa-solid fa-bars fa-2x"></i>
          ) : (
            <i className="fa-solid fa-xmark fa-2x"></i>
          )}
        </div>
      </section>
      <div style={{ height: "60px" }}></div>
    </>
  );
}
