// Common validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

// User Validations
const validateRole = (role) => {
  const validRoles = [
    "admin",
    "warehouse",
    "customerSupport",
    "logisticOperator",
  ];
  return validRoles.includes(role);
};

const validateUserInput = (userData, isUpdate = false) => {
  const errors = {};

  if (!isUpdate) {
    if (!userData.email) errors.email = "Email is required";
    if (!userData.password) errors.password = "Password is required";
    if (!userData.role) errors.role = "Role is required";
  }

  if (userData.email && !validateEmail(userData.email)) {
    errors.email = "Invalid email format";
  }

  if (userData.password && !validatePassword(userData.password)) {
    errors.password =
      "Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one special character";
  }

  if (userData.role && !validateRole(userData.role)) {
    errors.role =
      "Invalid role. Must be one of: admin, warehouse, customerSupport, logisticOperator";
  }

  if (userData.contactNumber && !validatePhoneNumber(userData.contactNumber)) {
    errors.contactNumber = "Contact number must be 10 digits";
  }

  if (userData.firstName && userData.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters long";
  }
  if (userData.lastName && userData.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters long";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Parcel Validations
const validateParcelInput = (parcelData, isUpdate = false) => {
  const errors = {};

  if (!isUpdate) {
    // Required fields for new parcel
    if (!parcelData.customerName)
      errors.customerName = "Customer name is required";
    if (!parcelData.customerPhone)
      errors.customerPhone = "Customer phone is required";
    if (!parcelData.customerEmail)
      errors.customerEmail = "Customer email is required";
    if (!parcelData.weight) errors.weight = "Weight is required";
    if (!parcelData.sourceStation)
      errors.sourceStation = "Source station is required";
    if (!parcelData.destinationStation)
      errors.destinationStation = "Destination station is required";
  }

  // Validate customer details
  if (parcelData.customerName && parcelData.customerName.length < 3) {
    errors.customerName = "Customer name must be at least 3 characters long";
  }

  if (
    parcelData.customerPhone &&
    !validatePhoneNumber(parcelData.customerPhone)
  ) {
    errors.customerPhone = "Invalid phone number format";
  }

  if (parcelData.customerEmail && !validateEmail(parcelData.customerEmail)) {
    errors.customerEmail = "Invalid email format";
  }

  // Validate weight and dimensions
  if (
    parcelData.weight &&
    (isNaN(parcelData.weight) || parcelData.weight <= 0)
  ) {
    errors.weight = "Weight must be a positive number";
  }

  if (parcelData.dimensions) {
    if (
      parcelData.dimensions.length &&
      (isNaN(parcelData.dimensions.length) || parcelData.dimensions.length <= 0)
    ) {
      errors.dimensions = {
        ...errors.dimensions,
        length: "Length must be a positive number",
      };
    }
    if (
      parcelData.dimensions.width &&
      (isNaN(parcelData.dimensions.width) || parcelData.dimensions.width <= 0)
    ) {
      errors.dimensions = {
        ...errors.dimensions,
        width: "Width must be a positive number",
      };
    }
    if (
      parcelData.dimensions.height &&
      (isNaN(parcelData.dimensions.height) || parcelData.dimensions.height <= 0)
    ) {
      errors.dimensions = {
        ...errors.dimensions,
        height: "Height must be a positive number",
      };
    }
  }

  // Validate stations
  if (
    parcelData.sourceStation &&
    parcelData.destinationStation &&
    parcelData.sourceStation === parcelData.destinationStation
  ) {
    errors.destinationStation =
      "Source and destination stations cannot be the same";
  }

  // Validate status if provided
  if (
    parcelData.status &&
    !["accepted", "in-transit", "delivered"].includes(parcelData.status)
  ) {
    errors.status =
      "Invalid status. Must be one of: accepted, in-transit, delivered";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Station Validations
const validateStationInput = (stationData, isUpdate = false) => {
  const errors = {};

  if (!isUpdate) {
    if (!stationData.name) errors.name = "Station name is required";
    if (!stationData.stationCode)
      errors.stationCode = "Station code is required";
    if (!stationData.location) errors.location = "Location is required";
  }

  if (stationData.name && stationData.name.length < 3) {
    errors.name = "Station name must be at least 3 characters long";
  }

  if (stationData.stationCode && stationData.stationCode.length < 2) {
    errors.stationCode = "Station code must be at least 2 characters long";
  }

  if (
    stationData.contactNumber &&
    !validatePhoneNumber(stationData.contactNumber)
  ) {
    errors.contactNumber = "Invalid phone number format";
  }

  if (stationData.location) {
    if (!stationData.location.city)
      errors.location = { ...errors.location, city: "City is required" };
    if (!stationData.location.state)
      errors.location = { ...errors.location, state: "State is required" };
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Train Validations
const validateTrainInput = (trainData, isUpdate = false) => {
  const errors = {};

  if (!isUpdate) {
    if (!trainData.trainNumber) errors.trainNumber = "Train number is required";
    if (!trainData.name) errors.name = "Train name is required";
    if (!trainData.type) errors.type = "Train type is required";
    if (!trainData.capacity) errors.capacity = "Capacity is required";
  }

  if (trainData.trainNumber && trainData.trainNumber.length < 3) {
    errors.trainNumber = "Train number must be at least 3 characters long";
  }

  if (trainData.name && trainData.name.length < 3) {
    errors.name = "Train name must be at least 3 characters long";
  }

  if (
    trainData.type &&
    !["express", "local", "freight"].includes(trainData.type)
  ) {
    errors.type = "Invalid train type. Must be one of: express, local, freight";
  }

  if (
    trainData.capacity &&
    (isNaN(trainData.capacity) || trainData.capacity <= 0)
  ) {
    errors.capacity = "Capacity must be a positive number";
  }

  if (trainData.schedule) {
    if (!Array.isArray(trainData.schedule)) {
      errors.schedule = "Schedule must be an array";
    } else {
      trainData.schedule.forEach((stop, index) => {
        if (!stop.station) {
          errors.schedule = {
            ...errors.schedule,
            [`${index}`]: "Station is required for each stop",
          };
        }
        if (!stop.arrivalTime || !stop.departureTime) {
          errors.schedule = {
            ...errors.schedule,
            [`${index}`]:
              "Arrival and departure times are required for each stop",
          };
        }
      });
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateRole,
  validateUserInput,
  validateParcelInput,
  validateStationInput,
  validateTrainInput,
};
