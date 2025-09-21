import { Router } from "express";
<<<<<<< HEAD
import * as userController from "../controller/auth.controller.js";
=======
import userController from "../controller/auth.controller.js";
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
import auth from "../middlewares/user.middleware.js";

const router = Router();

<<<<<<< HEAD
// ------------------ PROFILE (Protected) ------------------
router.get(
  "/profile/foreign",
  auth.authForeignUser,
  userController.foreignUserProfileController
);

=======


router.get(
  "/profile/foreign",
  auth.authForeignUser,
  userController.foreignUserProfileController
);
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
router.get(
  "/profile/domestic",
  auth.authDomesticUser,
  userController.domesticUserProfileController
);

<<<<<<< HEAD
// ------------------ REGISTRATION ------------------
router.post("/register/foreign", userController.registerForeignUser);
router.post("/register/domestic", userController.registerDomesticUser);

// ------------------ LOGIN ------------------
router.post("/login/foreign", userController.loginForeignUser);
router.post("/login/domestic", userController.loginDomesticUser);

// ------------------ LOGOUT ------------------
router.post("/logout/foreign", auth.authForeignUser, userController.logoutForeignUser);
router.post("/logout/domestic", auth.authDomesticUser, userController.logoutDomesticUser);
=======

router.post("/register/foreign", userController.registerForeignUser);
router.post("/register/domestic", userController.registerDomesticUser);


router.post("/login/foreign", userController.loginForeignUSer);
router.post("/login/domestic", userController.loginDomesticUser);


router.post("/logout/foreign", userController.logoutForeignUser);
router.post("/logout/domestic", userController.logoutDomesticUser);
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d

export default router;
