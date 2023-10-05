import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";

export default function Frame() {
  return (
    <>
      <NavBar />
      <div className="pt-16 h-screen">
        <Outlet />
      </div>
    </>
  );
}
