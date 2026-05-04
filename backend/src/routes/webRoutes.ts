import express from 'express';
import { createAdvertController } from '../controllers/products/createAdvertController';
import { deleteAdvertController } from '../controllers/products/deleteAdController';
import { getAdsController } from '../controllers/products/getAdsController';
import { getAdvertByIdController } from '../controllers/products/getAdvertByIdController';
import { updateAdvertController } from '../controllers/products/updateAdvertController';
import { contactSellerController } from '../controllers/products/contactSellerController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const webRouter = express.Router();

// Product/Ad Routes
webRouter.post('/', authMiddleware, createAdvertController);
webRouter.get('/', getAdsController);
webRouter.get('/:id', getAdvertByIdController);
webRouter.patch('/:id', authMiddleware, updateAdvertController);
webRouter.delete('/:id', authMiddleware, deleteAdvertController);
webRouter.post('/:id/contact', authMiddleware, contactSellerController);
