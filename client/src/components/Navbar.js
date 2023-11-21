import React from "react";
import "./Navbar.css"; // Import the CSS file for Navbar styles

function Navbar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  function Logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  }

  const navAction = () => {
    if (user) {
      return (
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-user mr-2"></i>
              {user.name}
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="/profile">
                Profile
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#" onClick={Logout}>
                Logout
              </a>
            </div>
          </li>
        </ul>
      );
    }

    return (
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="/register">
            Register
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/login">
            Login
          </a>
        </li>
      </ul>
    );
  };

  return (
    <div>
      {/* Navbar with light blue background */}
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
        <a className="navbar-brand" href="/home">
          Booking.com
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {navAction()}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
