import { Router } from "express";
import userController from "../controller/auth.controller.js"; 

const router = Router();

router.post("/register/foreign", userController.registerForeignUser);
router.post("/register/domestic", userController.registerDomesticUser);
router.post("/login/foreign", userController.loginForeignUSer);
router.post("/login/domestic", userController.loginDomesticUser);
router.post("/logout/foreign", userController.logoutForeignUser);
router.post("/logout/domestic", userController.logoutDomesticUser);
router.get("/profile/foreign", userController.foreignUserProfileController);
router.get("/profile/domestic", userController.domesticUserProfileController);

export default router;