import { Router } from "express";
import userController from "../controller/auth.controller.js";
import auth from "../middlewares/user.middleware.js"; 

const router = Router();

router.get("/profile/foreign", auth.authForeignUser, userController.foreignUserProfileController);
router.get("/profile/domestic", auth.authDomesticUser, userController.domesticUserProfileController);

router.post("/register/foreign", userController.registerForeignUser);
router.post("/register/domestic", userController.registerDomesticUser);


router.post("/login/foreign", userController.loginForeignUSer);
router.post("/login/domestic", userController.loginDomesticUser);


router.post("/logout/foreign", userController.logoutForeignUser);
router.post("/logout/domestic", userController.logoutDomesticUser);

export default router;

