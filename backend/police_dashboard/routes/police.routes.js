import { Router }  from 'express';
import { body } from 'express-validator';
import * as policeController from '../controller/police.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createAlert, getAllAlerts } from '../controller/police.controller.js';
import { sendAlert } from '../controller/police.controller.js';
// import * as touristController from '../controller/tourist.controller.js'; 

const router = Router();

router.post('/registerpolice', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], policeController.registerPoliceController);


router.post('/policelogin',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],policeController.loginPoliceController)


router.get('/policelogout',
    authMiddleware,
    policeController.logoutPoliceController
)


router.get('/policeprofile',
    authMiddleware,
    policeController.policeProfileController
)

router.get(
    '/total-tourist', 
    authMiddleware, 
    policeController.getAllTouristsController
);
// router.post('/create-foreign-tourist',[
//     body('contactInformation.email').isEmail().withMessage('Invalid email format'),
//     body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
// ],authMiddleware,touristController.registerForeignTouristController)

// router.post('/create-domestic-tourist',[
//     body('contactInformation.email').isEmail().withMessage('Invalid email format'),
//     body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
// ],authMiddleware,touristController.registerDomesticTouristController)

router.post("/alert", authMiddleware, policeController.createAlert);
router.get("/alert", authMiddleware, policeController.getAllAlerts);







export default router;