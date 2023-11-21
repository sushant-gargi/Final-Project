import React from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 2000,
});

function LandingScreen() {
  return (
    <div>
   

      <div className="row landing">
        <div className="col-md-12 text-center">
          <h2 data-aos="zoom-in" style={{ color: "white", fontSize: "100px" }}>
            MERN HOTEL BOOKING
          </h2>
          <h1 data-aos="zoom-out" style={{ color: "white" }}>
            Your Comfort, Our Priority.
          </h1>
          <p style={{ color: "white", fontSize: "18px", marginBottom: "30px" }}>
            Discover a world of luxury and comfort with our premium hotel booking services.
          </p>
          <Link to="/home">
            <button className="btn btn-primary landingBtn">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingScreen;
