import type { RequestHandler } from 'express';
import { EntityNotFoundError } from '../../errors/domainError';
import { Advert } from '../../models/Advert';
import { mongoIdValidator } from './AdvertInputValidator';
import { mapAdvertToResponse } from './advertResponseMapper';

export const getAdvertByIdController: RequestHandler = async (req, res, next) => {
    try {
        const { id } = mongoIdValidator.parse(req.params);

        const advert = await Advert.findById(id).populate('ownerId', 'username');

        if (!advert) {
            throw new EntityNotFoundError('anuncio', id);
        }

        res.status(200).json(mapAdvertToResponse(advert));
    } catch (error) {
        next(error);
    }
};
