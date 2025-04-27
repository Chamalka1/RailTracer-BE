const Parcel = require('../models/parcel');

// Generate a random string of specified length
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Generate a unique tracking number
exports.generateTrackingNumber = async () => {
    let isUnique = false;
    let trackingNumber;

    while (!isUnique) {
        // Format: RT-YYYY-XXXXX (RT for RailTracer, YYYY for year, XXXXX for random string)
        const year = new Date().getFullYear();
        const randomPart = generateRandomString(5);
        trackingNumber = `RT-${year}-${randomPart}`;

        // Check if tracking number already exists
        const existingParcel = await Parcel.findOne({ trackingNumber });
        if (!existingParcel) {
            isUnique = true;
        }
    }

    return trackingNumber;
}; 