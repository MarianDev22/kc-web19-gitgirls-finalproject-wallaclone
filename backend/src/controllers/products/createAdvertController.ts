import type { RequestHandler } from 'express';
import { UnauthorizedError } from '../../errors/domainError';
import { Advert } from '../../models/Advert';
import { createAdBodyValidator } from './AdvertInputValidator';

export const createAdvertController: RequestHandler = async (req, res, next) => {
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
      description: createdAdvert.description,
      price: createdAdvert.price,
      isSale: createdAdvert.isSale,
      image: createdAdvert.image,
      tags: createdAdvert.tags,
      ownerId: createdAdvert.ownerId,
      status: createdAdvert.status,
      message: 'Anuncio creado con éxito',
    });
  } catch (error) {
    next(error);
  }
};
