import { NavLink, Outlet } from "react-router-dom";
import "../app/styles.css";
import logo from "../assets/logo.svg";

export default function App() {
  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <img src={logo} alt="Logo" className="logo" />

        <NavLink
          to="/lists"
          className={({ isActive }) => (isActive ? "nav active" : "nav")}
        >
          🛒 My lists
        </NavLink>

        <NavLink
          to="/archived"
          className={({ isActive }) => (isActive ? "nav active" : "nav")}
        >
          🧺 Archived
        </NavLink>
      </aside>


      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
