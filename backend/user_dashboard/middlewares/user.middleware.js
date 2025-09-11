import { foriengUser } from "../models/user.model.js";
import { domesticUser } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function authForeignUser(req, res, next) {
        const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await foriengUser.findById(decoded.id);

        req.user = user;

        next()

    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }



}

async function authDomesticUser(req, res, next) {
        const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }   
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await domesticUser.findById(decoded.id);

        req.user = user;
        next()

    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export default { authForeignUser, authDomesticUser };
