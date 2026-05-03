import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../errors/domainError';
import { contactMessageValidator, mongoIdValidator } from './AdvertInputValidator';
import { contactSeller } from '../../services/contactSellerService';

export const contactSellerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    const { id } = mongoIdValidator.parse(req.params);
    const { contactMessage: message } = contactMessageValidator.parse(req.body);
    const buyerId = req.user.id;

    contactSeller(id, buyerId, message);

    res.status(200).json({
      message: 'El mensaje ha sido enviado con éxito',
    });
  } catch (error) {
    next(error);
  }
};
