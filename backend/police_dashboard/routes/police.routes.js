import { Router }  from 'express';
import { body } from 'express-validator';
import * as policeController from '../controller/police.controller.js';


const router = Router();

router.post('/registerpolice', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], policeController.registerPoliceController);

export default router;