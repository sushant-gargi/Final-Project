import React, { useState, useEffect } from "react";
import axios from "axios";

import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";
import "./LoginScreen.css";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function Login(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    const user = {
      email,
      password,
    };
    try {
      const result = (await axios.post("/api/users/login", user)).data;
      localStorage.setItem("currentUser", JSON.stringify(result));
      window.location.href = "/home";
    } catch (error) {
      setError("Invalid Credentials");
    }
    setLoading(false);
  }

  return (
    <div className="login-container">
      {loading && <Loader />}
      <div className="login-wrapper">
        <div className="login-content">
          {error.length > 0 && <Error msg={error}></Error>}
          <div className="login-box">
            <h2 className="login-title">Login</h2>
            <form onSubmit={Login} className="login-form">
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {loading ? (
                <div className="login-loading">Login...Please Wait...</div>
              ) : (
                <button className="btn btn-primary mt-3" type="submit">
                  Login
                </button>
              )}
            </form>
            <div className="login-links">
              <span>New here? <a href="/register">Sign Up</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
