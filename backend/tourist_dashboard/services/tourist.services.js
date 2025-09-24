import { foreignUser, domesticUser } from "../models/user.model.js";
import mongoose from "mongoose"; // ✅ Ensure mongoose is imported


// --- Keep all your other service functions (registerForeignTourist, etc.) below ---

export const registerForeignTourist = async({
    fullname,gender,date_of_birth,nationality,passportNumber,visaNumber,email,phoneNumber,arrivalDate,departureDate,flightNumber,destination,password,smartTouristId
})=>{
    if(!fullname || !gender || !date_of_birth || !nationality || !passportNumber || !visaNumber || !email || !phoneNumber || !arrivalDate || !departureDate || !flightNumber|| !destination || !password || !smartTouristId) {
        throw new Error("All fields are required");
    }
    const hashPassword = await foreignUser.hashPassword(password);

    const newForeignTourist = await foreignUser.create({
        fullname,
        gender,
        date_of_birth,
        nationality,
        passportNumber,
        visaNumber,
        email,
        phoneNumber,
        arrivalDate,
        departureDate,
        flightNumber,
        destination,
        password: hashPassword,
        smartTouristId
    });

    return newForeignTourist;
}


export const registerDomesticTourist = async({
    fullname,gender,date_of_birth,nationality,aadharNumber,drivingLicenseNumber,email,phoneNumber,arrivalDate,departureDate,flightNumber,destination,password,smartTouristId,lat,lng // ✅ Add lat & lng
})=>{
    if(!fullname || !gender || !date_of_birth || !nationality || !aadharNumber || !email || !phoneNumber || !arrivalDate || !departureDate || !destination || !password || !smartTouristId){
        throw new Error("All required fields are not provided");
    }
    const hashPassword = await domesticUser.hashPassword(password);

    const newDomesticTourist = await domesticUser.create({
        fullname,
        gender,
        date_of_birth,
        nationality,
        aadharNumber,
        drivingLicenseNumber,
        email,
        phoneNumber,
        arrivalDate,
        departureDate,
        flightNumber,
        destination,
        password: hashPassword,
        smartTouristId,
        // ✅ Format and save location data
        location: (lat && lng) ? { type: 'Point', coordinates: [lng, lat] } : undefined
    });

    return newDomesticTourist;
}

/**
 * Updates the location for a tourist by their ID.
 * It intelligently checks both foreign and domestic collections.
 */
export const updateTouristLocation = async (userId, { lat, lng }) => {
  // 1. Validate the user ID format to prevent database errors.
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Update Location Service: Invalid user ID format provided.");
    throw new Error("Invalid user ID");
  }

  // 2. Define the update payload. Using GeoJSON format for the 'location' field.
  const locationUpdate = {
    $set: {
      location: {
        type: "Point",
        coordinates: [lng, lat], // GeoJSON format is [longitude, latitude]
      },
    },
  };

  // 3. Attempt to find and update the user in the foreignUser collection first.
  let updatedTourist = await foreignUser.findByIdAndUpdate(userId, locationUpdate, {
    new: true, // This option returns the modified document.
  });

  // 4. If the user wasn't found as a foreign tourist, try the domesticUser collection.
  if (!updatedTourist) {
    updatedTourist = await domesticUser.findByIdAndUpdate(userId, locationUpdate, {
      new: true,
    });
  }

  // 5. Return the updated tourist document, or 'null' if not found in either collection.
  return updatedTourist;
};


export const findMemberByCredentials = async ({ smartTouristId, email }) => {
  if (!smartTouristId || !email) {
    throw new Error("Smart Tourist ID and email are required.");
  }

  // Define the fields to return (projection)
  const projection = {
    fullname: 1,
    location: 1,
    smartTouristId: 1,
    _id: 0 // Exclude the internal ID
  };

  // Try to find the member in the domestic collection first
  let member = await domesticUser.findOne({ smartTouristId, email }, projection);

  // If not found, try the foreign collection
  if (!member) {
    member = await foreignUser.findOne({ smartTouristId, email }, projection);
  }

  // Return the found member, or null if they don't exist
  return member;
};