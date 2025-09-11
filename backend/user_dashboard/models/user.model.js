import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();    

const userSchema = new mongoose.Schema({
userId:{
    type:String,
    required:true,
    
},
fullName:{
    type:String,
    required:true
},
gender:{
    type:String,
    required:true
},
dateOfBirth:{
    type:Date,
    required:true
},
nationality:{
    type:String,
    required:true
},
identityDocuments:{
    aadharCard:{
        type:String,
    },
    passportNumber:{
        type:String,
    },
    drivingLicense:{
        type:String,
    },
    visaNumber:{
        type:String,
    },
},
contactInformation:{
    email:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true,
    },
},
travelDetails:{
    arrivalDate:{
        type:Date,
        
    },
    departureDate:{
        type:Date,
        
    },
    filghtNumber:{
        type:String,
        
    },
    originCountry:{
        type:String,
        required:true,
    },
    destination:{
        type:String,
        required:true,
    },
    hotel:{
        type:String,
    },
},
    
smartTouristId:{
    type:String,
    unique:true,
}
    

}, {timestamps:true});

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,30)
}
userSchema.methods.isValidPassword = async function(hashPassword,password){
    return await bcrypt.compare(password,hashPassword)
}   

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id, email:this.email}, process.env.JWT_SECRET, {expiresIn:'7d'});
    return token;
}
const User = mongoose.model('User', userSchema);

export default User;