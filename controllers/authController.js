const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login
    // user.lastLogin = new Date();
    // await user.save();
    console.log(user);
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        // firstName: user.firstName,
        // lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    // Check if requester is admin
    if (req.user.role !== "admin" && req.user.role !== "railwayAdmin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can create users" });
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or Employee ID already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Check if requester is admin
    if (req.user.role !== "admin" && req.user.role !== "railwayAdmin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can view all users" });
    }

    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Middleware to verify JWT token
exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Initialize admin user if none exists
exports.initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        email: "admin@gmail.com",
        password: "admin123",
        firstName: "System",
        lastName: "Admin",
        role: "admin",
        employeeId: "ADMIN001",
        department: "Administration",
        contactNumber: "0000000000",
      });
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

// Initialize customer support user
exports.initializeCustomerSupport = async () => {
  try {
    // Check if customer support user exists
    const existingUser = await User.findOne({
      email: "support@railtracer.com",
    });

    if (!existingUser) {
      await User.create({
        firstName: "Customer",
        lastName: "Support",
        name: "Customer Support",
        email: "support@railtracer.com",
        password: "support123",
        role: "customer-support",
      });
      console.log("Customer support user created successfully");
    }
  } catch (error) {
    console.error("Error creating customer support user:", error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};
