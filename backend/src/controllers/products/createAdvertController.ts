import { Request, Response, NextFunction } from 'express';
import { createAdBodyValidator } from './AdvertInputValidator';
import { Advert } from '../../models/Advert';
import { UnauthorizedError } from '../../errors/domainError';

export const createAdvertController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }
    const { name, description, price, isSale, image, tags } = createAdBodyValidator.parse(req.body);
    
    const newAdvert = new Advert({
      name,
      description,
      price,
      isSale,
      image,
      tags,
      ownerId: req.user.id,
      status: 'AVAILABLE',
    });
    const createdAdvert = await newAdvert.save();

    // respuesta: datos anuncio + mensaje de éxito
    res.status(201).json({
      id: createdAdvert._id,
      name: createdAdvert.name,
      price: createdAdvert.price,
      isSale: createdAdvert.isSale,
      ownerId: createdAdvert.ownerId,
      status: createdAdvert.status,
      message: 'Anuncio creado con éxito',
    });
  } catch (error) {
    next(error);
  }
};
