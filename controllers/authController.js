const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const validateRole = (role) => {
  const validRoles = ["admin", "warehouse", "customerSupport", "logisticOperator"];
  return validRoles.includes(role);
};

const validateUserInput = (userData, isUpdate = false) => {
  const errors = {};

  if (!isUpdate) {
    // Required fields for new user creation
    if (!userData.email) errors.email = "Email is required";
    if (!userData.password) errors.password = "Password is required";
    if (!userData.role) errors.role = "Role is required";
  }

  // Validate email if provided
  if (userData.email && !validateEmail(userData.email)) {
    errors.email = "Invalid email format";
  }

  // Validate password if provided
  if (userData.password && !validatePassword(userData.password)) {
    errors.password = "Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one special character";
  }

  // Validate role if provided
  if (userData.role && !validateRole(userData.role)) {
    errors.role = "Invalid role. Must be one of: admin, warehouse, customerSupport, logisticOperator";
  }

  // Validate phone number if provided
  if (userData.contactNumber && !validatePhoneNumber(userData.contactNumber)) {
    errors.contactNumber = "Contact number must be 10 digits";
  }

  // Validate names if provided
  if (userData.firstName && userData.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters long";
  }
  if (userData.lastName && userData.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters long";
  }

  // Validate employee ID if required based on role
  if (["admin", "station-master"].includes(userData.role)) {
    if (!userData.employeeId) {
      errors.employeeId = "Employee ID is required for this role";
    } else if (userData.employeeId.length < 5) {
      errors.employeeId = "Employee ID must be at least 5 characters long";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

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
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name
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
      return res.status(403).json({ 
        message: "Unauthorized: Only admins can create users" 
      });
    }

    // Validate user input
    const { isValid, errors } = validateUserInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        message: "Validation failed",
        errors
      });
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
        name: newUser.name
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if requester is admin or the user themselves
    if (req.user.role !== "admin" && req.user.role !== "railwayAdmin" && req.user.userId !== userId) {
      return res.status(403).json({ 
        message: "Unauthorized: You can only update your own profile or must be an admin" 
      });
    }

    // Validate user input
    const { isValid, errors } = validateUserInput(req.body, true);
    if (!isValid) {
      return res.status(400).json({
        message: "Validation failed",
        errors
      });
    }

    // Find user and update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow role changes unless admin
    if (req.body.role && req.user.role !== "admin" && req.user.role !== "railwayAdmin") {
      return res.status(403).json({ 
        message: "Unauthorized: Only admins can change user roles" 
      });
    }

    // Update user fields
    Object.keys(req.body).forEach(key => {
      if (key !== "password") { // Handle password separately
        user[key] = req.body[key];
      }
    });

    // Handle password update if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
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
    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      // Create admin user
      await User.create({
        email: process.env.ADMIN_EMAIL || "admin@railtracer.com",
        password: process.env.ADMIN_PASSWORD || "adminPassword123!",
        firstName: "System",
        lastName: "Admin",
        role: "admin",
        employeeId: "ADMIN001",
        department: "Administration",
        contactNumber: "0000000000",
      });
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists, skipping initialization");
    }
  } catch (error) {
    if (error.code === 11000) {
      console.log(
        "Admin user already exists with this email, skipping initialization"
      );
    } else {
      console.error("Error initializing admin:", error);
    }
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
