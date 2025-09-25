import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

const policeSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    service_id:{
        type:String,
        required:true,
        unique:true
    },
    rank:{
        type:String,
        required:true
    },
    phone_no:{
        type:String,
        required:true,
        unique:true
    },
    station:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    place_of_posting:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    }

}, { timestamps: true });

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  timestamp: { type: Date, default: Date.now },
});


policeSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10)
}

policeSchema.methods.isValidPassword = async function(hashPassword,password){
    return await bcrypt.compare(password,hashPassword)
}

policeSchema.methods.generateAuthToken = function(){
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
} 

const Police = mongoose.model('Police',policeSchema);

export default Police;
export const Alert = mongoose.model('Alert', alertSchema);