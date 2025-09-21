// secretIdGenerator.js

let secretId = null;

// Function to generate random 100-char ID
export function generateComplexId(length = 100) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]|:;<>,.?/~`";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

const secret_QR_KEY = import.meta.env.VITE_QR_DATA_SECRET_KEY;

// Process scanned keyword
export function processKeyword(keyword) {
  if (keyword && keyword.trim() === secret_QR_KEY) {
    secretId = generateComplexId();
    console.log("✅ Secret ID generated:", secretId);
    return secretId;
  }
  return null; // if not "hellow"
}

// Getter for secretId
export function getSecretId() {
  return secretId;
}
