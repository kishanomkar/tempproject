import { Router } from "express";
import * as userController from "../controller/auth.controller.js";  // ✅ fixed import
import auth from "../middlewares/user.middleware.js"; 

const router = Router();

// ✅ Profile routes (protected)
router.get("/profile/foreign", auth.authForeignUser, userController.foreignUserProfileController);
router.get("/profile/domestic", auth.authDomesticUser, userController.domesticUserProfileController);

// ✅ Registration
router.post("/register/foreign", userController.registerForeignUser);
router.post("/register/domestic", userController.registerDomesticUser);

// ✅ Login
router.post("/login/foreign", userController.loginForeignUser);
router.post("/login/domestic", userController.loginDomesticUser);

// ✅ Logout
router.post("/logout/foreign", userController.logoutForeignUser);
router.post("/logout/domestic", userController.logoutDomesticUser);

export default router;
