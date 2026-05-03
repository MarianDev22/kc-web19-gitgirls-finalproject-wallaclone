import express from 'express';
import { createAdvertController } from '../controllers/products/createAdvertController';
import { getAdsController } from '../controllers/products/getAdsController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { deleteAdvertController } from '../controllers/products/deleteAdController';

export const webRouter = express.Router();

// Product/Ad Routes
webRouter.post('/', authMiddleware, createAdvertController);
webRouter.get('/', getAdsController);
webRouter.delete('/:id', authMiddleware, deleteAdvertController);
webRouter.post('/:id/contact', authMiddleware, deleteAdvertController);
