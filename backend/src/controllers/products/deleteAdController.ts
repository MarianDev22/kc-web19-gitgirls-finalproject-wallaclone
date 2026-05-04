import type { RequestHandler } from 'express';
import {
  EntityNotFoundError,
  ForbiddenOperationError,
  UnauthorizedError,
} from '../../errors/domainError';
import { Advert } from '../../models/Advert';
import { mongoIdValidator } from './AdvertInputValidator';

export const deleteAdvertController: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    const { id } = mongoIdValidator.parse(req.params);
    const advert = await Advert.findById(id);

    if (!advert) {
      throw new EntityNotFoundError('anuncio', id);
    }

    // Solo el usuario propietario puede borrar su propio anuncio
    const isOwner = advert.ownerId.toString() === req.user.id;

    if (!isOwner) {
      throw new ForbiddenOperationError('No tienes permisos para borrar este anuncio');
    }

    await advert.deleteOne();

    res.status(200).json({
      message: 'Anuncio borrado con éxito',
    });
  } catch (error) {
    next(error);
  }
};
