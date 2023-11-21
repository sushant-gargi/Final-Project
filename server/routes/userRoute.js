// users.js

const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      // Duplicate email error
      return res.status(400).json({ message: "Email already exists. Please use a different email address." });
    }
    console.error(error);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      const temp = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
      };
      res.status(200).json(temp); // 200 OK status for successful login
    } else {
      return res.status(401).json({ message: "Login Failed" }); // 401 Unauthorized status for failed login
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users); // 200 OK status for successful retrieval of users
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/makeadmin", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isAdmin = true;
    await user.save();
    res.status(200).json({ message: "User is now an admin" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/deleteuser", async (req, res) => {
  try {
    const userId = req.body.userId;
    const result = await User.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// New route for updating user information
router.post("/updateuser", async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    // Validate that the required fields are provided
    if (!userId || !name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
