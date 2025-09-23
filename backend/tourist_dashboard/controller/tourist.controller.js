import { validationResult } from "express-validator";
import { foreignUser,domesticUser } from "../models/user.model.js";
import * as touristService from "../services/tourist.services.js"

export const registerForeignTouristController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
    const foreignTourist = await touristService.registerForeignTourist(req.body);
    const token = foreignTourist.generateAuthToken();

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" }); // store JWT in cookie
    delete foreignTourist._doc.password;
    res.status(201).json({ foreignTourist, token });
} catch (error) {
    res.status(500).json({ error: error.message });
}
}

export const registerDomesticTouristController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const domesticTourist = await touristService.registerDomesticTourist(req.body);
        const token = domesticTourist.generateAuthToken();

        res.cookie("token", token, { httpOnly: true, sameSite: "strict" }); // store JWT in cookie
        delete domesticTourist._doc.password;
        res.status(201).json({ domesticTourist, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const loginForeignTouristController = async (req, res) => {
  try {
    const { email, password, visaNumber } = req.body;

    const foreignTourist = await foreignUser.findOne({ email }).select("+password");
    if (!foreignTourist) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (foreignTourist.visaNumber !== visaNumber) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await foreignTourist.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = foreignTourist.generateAuthToken();
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

    const userProfile = { ...foreignTourist._doc };
    delete userProfile.password;

    res.status(200).json({
      message: "Login successful",
      token,                  // ✅ return token here
      foreignTourist: userProfile,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
};


export const loginDomesticTouristController = async (req, res) => {
  try {
    const { email, password, aadharNumber } = req.body;

    const domesticTourist = await domesticUser.findOne({ email }).select("+password");
    if (!domesticTourist) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (domesticTourist.aadharNumber !== aadharNumber) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await domesticTourist.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = domesticTourist.generateAuthToken();
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

    const userProfile = { ...domesticTourist._doc };
    delete userProfile.password;

    res.status(200).json({
      message: "Login successful",
      token,                  // ✅ return token here
      domesticTourist: userProfile,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
};




export const logoutForeignTouristController = async (req, res) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
        res.status(200).send("Logged out successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const logoutDomesticTouristController = async (req, res) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
        res.status(200).send("Logged out successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getForeignTouristProfileController = async (req, res) => {
    try {
        const foreignTouristId = req.foreignTourist._id;
        const foreignTourist = await foreignUser.findById(foreignTouristId).select("-password");
        if (!foreignTourist) {
            return res.status(404).send("Foreign tourist not found");
        }
        res.status(200).json({ foreignTourist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getDomesticTouristProfileController = async (req, res) => {
    try {
        const domesticTouristId = req.domesticTourist._id;
        const domesticTourist = await domesticUser.findById(domesticTouristId).select("-password");
        if (!domesticTourist) {
            return res.status(404).send("Domestic tourist not found");
        }
        res.status(200).json({ domesticTourist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateLocationController = async (req, res) => {
  try {
    // 1. The middleware has already verified the token and attached the user object.
    //    We get the user's ID directly from the request.
    const userId = req.foreignTourist?._id || req.domesticTourist?._id;
    const { lat, lng } = req.body;

    // 2. A safety check to ensure we have a user ID and location data.
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Could not identify tourist from the token" });
    }
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "Latitude and longitude are required in the request body" });
    }

    // 3. Call the service to perform the database update.
    const updatedTourist = await touristService.updateTouristLocation(userId, { lat, lng });

    // 4. ✅ **THE CRITICAL FIX**:
    //    Check if the service returned a valid user. If it returned 'null', it means
    //    the user ID from the token was not found in the database.
    if (!updatedTourist) {
      // Respond with a 404 Not Found error instead of crashing.
      return res.status(404).json({ message: "Tourist not found in database for location update." });
    }

    // 5. If successful, send back a 200 OK response with the updated location.
    res.status(200).json({
      message: "Location updated successfully",
      location: updatedTourist.location, // This is now safe to access.
    });

  } catch (error) {
    // 6. If any other unexpected error occurs (e.g., database connection loss),
    //    this catch block will handle it and send a generic 500 error.
    console.error("CRITICAL ERROR in updateLocationController:", error);
    res.status(500).json({ message: "Server error while updating location" });
  }
};