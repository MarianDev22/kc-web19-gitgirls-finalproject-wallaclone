import express from 'express';
import { createAdvertController } from '../controllers/products/createAdvertController';
import { deleteAdvertController } from '../controllers/products/deleteAdController';
import { getAdsController } from '../controllers/products/getAdsController';
import { updateAdvertController } from '../controllers/products/updateAdvertController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const webRouter = express.Router();

// Product/Ad Routes
webRouter.post('/', authMiddleware, createAdvertController);
webRouter.get('/', getAdsController);
webRouter.patch('/:id', authMiddleware, updateAdvertController);
webRouter.delete('/:id', authMiddleware, deleteAdvertController);
