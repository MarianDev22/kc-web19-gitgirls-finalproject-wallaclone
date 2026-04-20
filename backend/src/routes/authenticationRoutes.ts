import express from 'express'
import { signupController } from '../controllers/authentication/signupController';

export const authenticationRouter = express.Router();

//Authentication
authenticationRouter.post('/signup', signupController);
//uthenticationRouter.post('/signin', signinController);