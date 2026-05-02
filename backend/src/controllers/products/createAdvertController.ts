import type { RequestHandler } from 'express';
import { UnauthorizedError } from '../../errors/domainError';
import { Advert } from '../../models/Advert';
import { createAdBodyValidator } from './AdvertInputValidator';
import { mapAdvertToResponse } from './advertResponseMapper';

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

    res.status(201).json({
      ...mapAdvertToResponse(createdAdvert),
      message: 'Anuncio creado con éxito',
    });
  } catch (error) {
    next(error);
  }
};
