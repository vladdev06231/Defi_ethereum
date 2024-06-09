import "./App.css";
import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./Components/Navbar";
import { ToastContainer } from "react-toastify";
import AddressBook from "./pages/AddressBook";
import Activity from "./pages/Activity";

function App() {
  let routesElement = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/addressbook",
      element: <AddressBook />,
    },
    {
      path: "/activityhistory",
      element: <Activity />,
    },
  ];

  return (
    <>
      <Navbar />
      <Routes>
        {routesElement.map(({ path, element }, index) => {
          return path === "/" || path === "/bid" ? (
            <Route exact={true} path={path} element={element} key={index} />
          ) : (
            <Route path={path} element={element} key={index} />
          );
        })}
      </Routes>
      <ToastContainer
        z-index={4567}
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
