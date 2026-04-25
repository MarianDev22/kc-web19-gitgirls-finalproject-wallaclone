import { Request, Response, NextFunction } from 'express';
import { createAdBodyValidator } from './AdvertInputValidator';
import { Advert } from '../../models/Advert';

export const createAdvertController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, isSale, image, tags } = createAdBodyValidator.parse(req.body);

    const newAdvert = new Advert({
      name,
      description,
      price,
      isSale,
      image,
      tags,
      ownerId: req.user?.id ?? '',
    });
    const createdAdvert = await newAdvert.save();

    // respuesta: datos anuncio + mensaje de éxito
    res.status(201).json({
      id: createdAdvert._id,
      name: createdAdvert.name,
      price: createdAdvert.price,
      isSale: createdAdvert.isSale,
      ownerId: createdAdvert.ownerId,
      message: 'Anuncio creado con éxito',
    });
  } catch (error) {
    next(error);
  }
};
