import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 p-4 bg-light min-vh-100">
        <div className="bg-white rounded-4 shadow-sm p-4 h-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;