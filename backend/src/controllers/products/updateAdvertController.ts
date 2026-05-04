import type { RequestHandler } from 'express';
import {
  EntityNotFoundError,
  ForbiddenOperationError,
  UnauthorizedError,
} from '../../errors/domainError';
import { Advert } from '../../models/Advert';
import { mongoIdValidator, updateAdValidator } from './AdvertInputValidator';
import { mapAdvertToResponse } from './advertResponseMapper';

export const updateAdvertController: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    const dataToUpdate = updateAdValidator.parse(req.body);
    const { id } = mongoIdValidator.parse(req.params);

    const advertToUpdate = await Advert.findById(id);

    if (!advertToUpdate) {
      throw new EntityNotFoundError('anuncio', id);
    }

    if (advertToUpdate.ownerId.toString() !== req.user.id) {
      throw new ForbiddenOperationError('No tienes permisos para editar este anuncio');
    }

    advertToUpdate.set(dataToUpdate);

    const updatedAdvert = await advertToUpdate.save();

    res.status(200).json({
      ...mapAdvertToResponse(updatedAdvert),
      message: 'Anuncio actualizado con éxito',
    });
  } catch (error) {
    next(error);
  }
};
