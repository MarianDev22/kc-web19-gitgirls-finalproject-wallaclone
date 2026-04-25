import express from 'express';
import { createAdvertController } from '../controllers/products/createAdvertController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const webRouter = express.Router();

//Product/Ad Routes
webRouter.post('/', [authMiddleware], createAdvertController);
//webRouter.get('/login', getAdsController);
