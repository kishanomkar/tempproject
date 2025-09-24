import {Router} from 'express';
import { body } from 'express-validator';
import * as touristController from '../controller/tourist.controller.js'
import { domesticUser, foreignUser } from '../models/user.model.js';
import touristMiddleware from '../middlewares/tourist.middleware.js';


const router = Router();

router.post('/registerforeigntourist',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
],touristController.registerForeignTouristController)

router.post('/registerdomestictourist',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
],touristController.registerDomesticTouristController)

router.post('/foreigntouristlogin',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('visaNumber').notEmpty().withMessage('Visa number is required'),
],touristController.loginForeignTouristController)

router.post('/domestictouristlogin',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('aadharNumber').notEmpty().withMessage('Aadhar number is required'),
],touristController.loginDomesticTouristController)

router.get('/foreigntouristlogout',touristMiddleware, touristController.logoutForeignTouristController)

router.get('/domestictouristlogout',touristMiddleware, touristController.logoutDomesticTouristController)

router.get('/foreigntouristprofile',touristMiddleware, touristController.getForeignTouristProfileController)
router.get('/domestictouristprofile',touristMiddleware, touristController.getDomesticTouristProfileController)


router.post('/update-location', touristMiddleware, touristController.updateLocationController);

router.post('/find-member', touristMiddleware, touristController.findMemberController);

router.get('/profile', touristMiddleware, touristController.getProfile);

export default router;