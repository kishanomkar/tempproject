import express from "express";
import { sendAlert, getAlerts } from "../controller/police.controller.js";

const router = express.Router();

// Police sends a new alert
router.post("/send", sendAlert);

// Tourists get alerts
router.get("/", getAlerts);

export default router;
