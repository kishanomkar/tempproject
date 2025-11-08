import { Router } from 'express';
import { body } from 'express-validator';
import * as touristController from '../controller/tourist.controller.js';
import touristMiddleware from '../middlewares/tourist.middleware.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

const router = Router();

// Registration routes
router.post('/registerforeigntourist', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], touristController.registerForeignTouristController);

router.post('/registerdomestictourist', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], touristController.registerDomesticTouristController);

// Login routes
router.post('/foreigntouristlogin', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('visaNumber').notEmpty().withMessage('Visa number is required'),
], touristController.loginForeignTouristController);

router.post('/domestictouristlogin', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('aadharNumber').notEmpty().withMessage('Aadhar number is required'),
], touristController.loginDomesticTouristController);

// Logout/profile routes
router.get('/foreigntouristlogout', touristMiddleware, touristController.logoutForeignTouristController);
router.get('/domestictouristlogout', touristMiddleware, touristController.logoutDomesticTouristController);
router.get('/foreigntouristprofile', touristMiddleware, touristController.getForeignTouristProfileController);
router.get('/domestictouristprofile', touristMiddleware, touristController.getDomesticTouristProfileController);

router.post('/update-location', touristMiddleware, touristController.updateLocationController);
router.post('/find-member', touristMiddleware, touristController.findMemberController);
router.get('/profile', touristMiddleware, touristController.getProfile);

// --- SAFETY DATA ROUTE ---

// Environment variable check
if (!process.env.GEMINI_API_KEY || !process.env.OPENWEATHER_API_KEY) {
  console.error("Missing required environment variables!");
  console.log("GEMINI_API_KEY:", !!process.env.GEMINI_API_KEY);
  console.log("OPENWEATHER_API_KEY:", !!process.env.OPENWEATHER_API_KEY);
}

// Gemini model initialization
let genAI;
let model;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Updated model to the recommended flash model
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
  console.log("Gemini AI model initialized successfully");
} catch (error) {
  console.error("Error initializing Gemini AI:", error);
}

// Safety Data route
router.get('/safety-data', async (req, res, next) => {
  try {
    console.log("\n--- NEW /safety-data REQUEST ---");
    const { lat, lon } = req.query;
    if (!lat || !lon)
      return res.status(400).json({ error: "Latitude and longitude are required." });

    // Fetch weather data
    let weatherResponse;
    try {
      weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
      );
      console.log("weather data:", weatherResponse.data);
    } catch (weatherError) {
      console.error("Weather API Error:", weatherError.message);
      if (weatherError.response) {
        console.error("Weather API Response:", weatherError.response.data);
      }
      // Fallback response
      return res.json({
        location: { city: "Unknown Location", lastUpdated: new Date().toLocaleTimeString() },
        safetyScore: { score: 75 },
        risks: [
          { name: "Time of Day", value: "Medium" },
          { name: "Weather", value: "Unknown" },
          { name: "Crowd Density", value: "Medium" }
        ],
        tip: "Unable to fetch weather data. Stay cautious and keep emergency contacts handy."
      });
    }

    const weatherData = weatherResponse.data;
    const weatherMain = weatherData.weather[0].main;
    const temp = weatherData.main.temp;
    const cityName = weatherData.name;

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const currentHour = now.getHours();

    // Updated prompt to request varied tip and specify JSON fields for reliability
    const prompt = `
      You are a real-time safety analyst for a travel app called TripShield.
      Analyze the following data for a user in ${cityName}.
    
      Current Data:
      - Time: ${currentTime} (${currentHour}:00)
      - Weather: ${weatherMain}
      - Temperature: ${temp}°C
    
      Perform a risk assessment and provide the following JSON structure:
      - "location": An object with "city" ("${cityName}") and "lastUpdated" ("${currentTime}").
      - "safetyScore": An object with a "score" (a number between 0 and 100).
      - "risks": An array of objects, each with "name" ("Time of Day", "Weather", "Crowd Density") and "value" ("Low", "Medium", or "High").
E     - "tip": A concise, creative, and actionable safety tip (less than 25 words). Make this tip unique and specific to the conditions, avoiding generic advice.
    `;

    try {
      // Added generationConfig to increase "creativity" and force JSON output
      const generationConfig = {
        temperature: 1.0, // 1.0 for maximum creativity/variability
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
        responseMimeType: "application/json", // Force JSON output
      };

      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig,
      });
      const response = await result.response;
      const responseText = response.text();
      console.log("\n--- GEMINI RAW RESPONSE ---\n", responseText, "\n---------------------------\n");

      // With responseMimeType: "application/json", no backticks should be present.
      const cleanJson = responseText.trim();

      try {
        const jsonData = JSON.parse(cleanJson);

        // Validate response structure
        if (!jsonData.location || !jsonData.safetyScore || !jsonData.risks || !jsonData.tip) {
          throw new Error("Invalid response format from AI");
        }

        // Ensure valid safety score
        if (typeof jsonData.safetyScore.score !== 'number' ||
            jsonData.safetyScore.score < 0 ||
            jsonData.safetyScore.score > 100) {
          jsonData.safetyScore.score = 75;
        }

        // Validate risk levels
        jsonData.risks = jsonData.risks.map(risk => ({
          name: risk.name || "Unknown Risk",
          value: ['Low', 'Medium', 'High'].includes(risk.value) ? risk.value : 'Medium'
        }));

        res.json(jsonData);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Raw Response:", responseText);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      // Gemini API call failure fallback
      console.error("\n--- GEMINI API CALL FAILED ---");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }

      res.json({
        location: { city: weatherData.name, lastUpdated: currentTime },
        safetyScore: { score: 75 },
        risks: [
          { name: "Time of Day", value: "Low" },
          { name: "Weather", value: "Low" },
          { name: "Crowd Density", value: "Low" }
        ],
        tip: "Stay alert and keep emergency contacts handy. Weather conditions are normal."
      });
    }
  } catch (error) {
    next(error); // Pass up to the global Express error handler
  }
});

// --- GLOBAL ERROR HANDLER ---
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

export default router;