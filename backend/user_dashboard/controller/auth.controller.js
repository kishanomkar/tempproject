import {foreignUser, domesticUser} from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


async function registerForeignUser(req, res) {
   const { fullname, userId, smartTouristId, email, phoneNumber, } = req.body;


    const isAlreadyRegistered = await foreignUser.findOne({ userId });

    if (isAlreadyRegistered) {
        return res.status(400).json({ message: 'User already registered' });
    }
    const hashPassword = await bcrypt.hash(req.body.password,10);
    const ForeignUser = await foreignUser.create({
        fullname,
        contactInformation: {
            email,
            phoneNumber
        },
        password: hashPassword,
        userId,
        smartTouristId
    })

    const token = jwt.sign({ id: ForeignUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'User registered successfully', ForeignUser });

}
async function registerDomesticUser(req, res) {
    const { fullname, userId, smartTouristId, email, phoneNumber, password } = req.body;
 
    const isAlreadyRegistered = await domesticUser.findOne({ userId });

    if (isAlreadyRegistered) {
        return res.status(400).json({ message: 'User already registered' });
    }
    const hashPassword = await bcrypt.hash(req.body.password,10);
    const DomesticUser = await domesticUser.create({
        fullname,
        contactInformation: {
            email,
            phoneNumber
        },
        password: hashPassword,
        userId,
        smartTouristId
    })

    const token = jwt.sign({ id: DomesticUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'User registered successfully', DomesticUser });
}

async function loginForeignUSer(req, res) {
    const { userId, password } = req.body;
    const user = await foreignUser.findOne({ userId });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'User logged in successfully', user });
}

async function loginDomesticUser(req, res) {
    const { userId, password } = req.body;
    const user = await domesticUser.findOne({ userId });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'User logged in successfully', user });

}

async function logoutForeignUser(req, res) {
     try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    }); 

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function logoutDomesticUser(req, res) {
     try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    }); 

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function foreignUserProfileController(req, res){
    const user = req.user;
    console.log(req.user);
    res.status(200).json({ user });
}
async function domesticUserProfileController(req, res){
    const user = req.user;
    console.log(req.user);
    res.status(200).json({ user });
}


export default { registerForeignUser, registerDomesticUser, loginForeignUSer, loginDomesticUser, logoutForeignUser, logoutDomesticUser , foreignUserProfileController, domesticUserProfileController     };


