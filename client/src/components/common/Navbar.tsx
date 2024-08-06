import { Link, NavLink } from "react-router-dom";
import "./Navbar.scss";
import { useState } from "react";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav>
      <Link to={"/"} className="title">
        Starlinks Global
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to={"/productConsole"}>Product Console</NavLink>
        </li>
        <li>
          <NavLink to={"/"}>Actions</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
