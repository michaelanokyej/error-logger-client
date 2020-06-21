import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

const navBar = (props) => {
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <NavLink to="/">
          <img src="lga-logo.png" alt="logo" />
        </NavLink>
      </div>
      <nav className="main-navigation__items">
        <ul>
          <li>
            <NavLink to="/errors">Errors</NavLink>
          </li>
          <li>
            <NavLink to="/pollers">Pollers</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default navBar;
