import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

// Common Location Schema for GeoJSON
const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
  }
}, {_id: false});


// ---------------- FOREIGN TOURIST SCHEMA ----------------
const foreignTouristsSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    gender: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    nationality: { type: String, required: true },
    passportNumber: { type: String, required: true },
    visaNumber: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    flightNumber: { type: String, required: true },
    destination: { type: String, required: true },
    password: { type: String, required: true, select: false },
    smartTouristId: { type: String, required: true },
    // ✅ ADDED LOCATION FIELD
    location: locationSchema
  },
  { timestamps: true }
);

// ---------------- DOMESTIC TOURIST SCHEMA ----------------
const domesticTouristsSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    gender: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    nationality: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    drivingLicenseNumber: { type: String },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date },
    flightNumber: { type: String },
    destination: { type: String, required: true },
    password: { type: String, required: true, select: false },
    smartTouristId: { type: String, required: true },
    // ✅ ADDED LOCATION FIELD
    location: locationSchema
  },
  { timestamps: true }
);

// --- METHODS (hashPassword, isValidPassword, generateAuthToken) remain the same ---

foreignTouristsSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

foreignTouristsSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

foreignTouristsSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, type: 'Foreign' },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

domesticTouristsSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

domesticTouristsSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

domesticTouristsSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, type: 'Domestic' },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export const foreignUser = mongoose.model("foreignUser", foreignTouristsSchema);
export const domesticUser = mongoose.model("domesticUser", domesticTouristsSchema);

