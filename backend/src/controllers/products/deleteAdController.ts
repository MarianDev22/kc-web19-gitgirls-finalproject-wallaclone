import { NextFunction, Request, Response } from 'express';
import { mongoIdValidator } from './AdvertInputValidator';
import { Advert } from '../../models/Advert';
import {
  EntityNotFoundError,
  ForbiddenOperationError,
  UnauthorizedError,
} from '../../errors/domainError';

export const deleteAdvertController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }
    const { id } = mongoIdValidator.parse(req.params);

    const advertToDelete = await Advert.findById(id);
    if (!advertToDelete) {
      throw new EntityNotFoundError('anuncio', id);
    }
    if (advertToDelete.ownerId.toString() !== req.user.id) {
      throw new ForbiddenOperationError('No tiene permisos para borrar este anuncio');
    }
    await advertToDelete.deleteOne();
    //tendría que volver a comprobar acá que deletedAdvert !== null?

    res.status(200).json({
      message: 'Anuncio borrado con éxito',
    });
  } catch (error) {
    next(error);
  }
};
