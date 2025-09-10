import {validationResult} from 'express-validator';
import Police from '../models/police.model.js';
import * as policeService from "../services/police.services.js"
import mongoose from 'mongoose';
export const registerPoliceController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
    const police = await policeService.registerPolice(req.body);
    const token = police.generateAuthToken();

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" }); // store JWT in cookie
    delete police._doc.password; 
    res.status(200).json({ police, token });

  } catch (error) {
    res.status(400).send(error.message);
  }
}
