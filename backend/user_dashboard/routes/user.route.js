import { Router } from "express";
import * as userController from "../controller/auth.controller.js";
import auth from "../middlewares/user.middleware.js";

const router = Router();

// ------------------ PROFILE (Protected) ------------------
router.get(
  "/profile/foreign",
  auth.authForeignUser,
  userController.foreignUserProfileController
);

router.get(
  "/profile/domestic",
  auth.authDomesticUser,
  userController.domesticUserProfileController
);

// ------------------ REGISTRATION ------------------
router.post("/register/foreign", userController.registerForeignUser);
router.post("/register/domestic", userController.registerDomesticUser);

// ------------------ LOGIN ------------------
router.post("/login/foreign", userController.loginForeignUser);
router.post("/login/domestic", userController.loginDomesticUser);

// ------------------ LOGOUT ------------------
router.post("/logout/foreign", auth.authForeignUser, userController.logoutForeignUser);
router.post("/logout/domestic", auth.authDomesticUser, userController.logoutDomesticUser);

export default router;
