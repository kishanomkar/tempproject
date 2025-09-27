// A simple, reusable Node.js script to run Gemini from the command line.
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
const path = require('path');

/**
 * Converts a remote image URL to a GoogleGenerativeAI.Part object.
 * @param {string} url The URL of the image.
 * @returns {Promise<object>} A promise that resolves to a Part object.
 */
async function urlToGenerativePart(url) {
  try {
    // Determine MIME type from URL extension
    const extension = path.extname(url).toLowerCase();
    let mimeType;
    if (extension === ".png") {
      mimeType = "image/png";
    } else if (extension === ".jpg" || extension === ".jpeg") {
      mimeType = "image/jpeg";
    } else if (extension === ".webp") {
      mimeType = "image/webp";
    } else {
        // A default or throw an error if the format is unsupported
        throw new Error("Unsupported image format. Please use PNG, JPG, or WEBP.");
    }

    // Download the image and convert to base64
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64Data = Buffer.from(response.data).toString('base64');

    return {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };
  } catch (error) {
    console.error("Error fetching or processing image:", error.message);
    return null;
  }
}

async function run() {
    // --- Argument Parsing ---
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error("Usage: node gemini_cli.js \"<prompt>\" [--image <url>]");
        return;
    }
    const prompt = args[0];
    const imageFlagIndex = args.indexOf('--image');
    const imageUrl = imageFlagIndex !== -1 && args.length > imageFlagIndex + 1 ? args[imageFlagIndex + 1] : null;

    // --- API Key Configuration ---
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("Error: GOOGLE_API_KEY environment variable not found.");
        console.log("Please set your GOOGLE_API_KEY environment variable.");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        let model;
        let generationPromise;

        if (imageUrl) {
            // --- Vision Model Logic ---
            console.log("Using model: gemini-pro-vision\n");
            model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
            
            console.log("Downloading image...");
            const imagePart = await urlToGenerativePart(imageUrl);
            if (!imagePart) return; // Exit if image processing failed
            
            const promptParts = [prompt, imagePart];
            generationPromise = model.generateContentStream(promptParts);

        } else {
            // --- Text Model Logic ---
            console.log("Using model: gemini-pro\n");
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
            generationPromise = model.generateContentStream(prompt);
        }

        const result = await generationPromise;
        
        // --- Stream and Print the Response ---
        console.log("--- Gemini's Response ---");
        let completeResponse = '';
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          process.stdout.write(chunkText); // Write chunk without a newline
          completeResponse += chunkText;
        }
        console.log("\n-------------------------");

    } catch (error) {
        console.error("\nAn unexpected error occurred:", error.message);
    }
}

run();
