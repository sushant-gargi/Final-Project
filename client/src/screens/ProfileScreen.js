// ProfileScreen.js

import React, { useEffect } from "react";
import { Tabs, Tag, Button } from "antd";
import MyBookingScreen from "./MyBookingScreen";
import "./ProfileScreen.css";

const { TabPane } = Tabs;

function ProfileScreen() {
  // Fetch user information from local storage
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};

  // Redirect to login page if user is not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  return (
    <div className="profile-container">
      <Tabs defaultActiveKey="1">
        {/* Profile Tab */}
        <TabPane tab="Profile" key="1">
          <div className="profile-content">
            <div className="profile-details">
              <h2 className="profile-title">My Profile</h2>
              <p className="profile-info">Name: {user.name}</p>
              <p className="profile-info">Email: {user.email}</p>
              {user.isAdmin && <Tag className="admin-tag">Admin</Tag>}
              <Button
                type="primary"
                href={user.isAdmin ? "/admin" : "/"}
                className="profile-button"
              >
                {user.isAdmin ? "Go to Admin" : "Go to Home"}
              </Button>
            </div>
          </div>
        </TabPane>

        {/* Booking Tab */}
        <TabPane tab="Booking" key="2">
          <MyBookingScreen />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default ProfileScreen;
