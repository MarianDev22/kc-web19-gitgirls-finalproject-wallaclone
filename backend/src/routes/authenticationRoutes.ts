import express from 'express'
import { signupController } from '../controllers/authentication/signupController';

export const authenticationRouter = express.Router();

//Authentication
authenticationRouter.post('/register', signupController);
//uthenticationRouter.post('/login', loginController);