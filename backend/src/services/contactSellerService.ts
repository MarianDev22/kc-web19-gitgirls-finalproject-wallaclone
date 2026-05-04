import { Types } from 'mongoose';
import { EntityNotFoundError, ForbiddenOperationError } from '../errors/domainError';
import { Advert } from '../models/Advert';
import { User } from '../models/User';
import { emailService } from './emailService';

interface PopulatedOwner {
  _id: Types.ObjectId;
  email: string;
}

export const contactSeller = async (advertId: string, buyerId: string, message: string) => {
  const advert = await Advert.findById(advertId)
    .populate<{ ownerId: PopulatedOwner }>('ownerId', 'email')
    .lean();

  if (!advert || advert.status === 'SOLD') {
    throw new EntityNotFoundError('anuncio', advertId);
  }

  if (!advert.ownerId) {
    throw new EntityNotFoundError('vendedor', 'id_no_disponible');
  }

  const advertOwnerId = advert.ownerId._id.toString();

  if (advertOwnerId === buyerId) {
    throw new ForbiddenOperationError('No puedes contactar con tu propio anuncio');
  }

  const buyer = await User.findById(buyerId).select('email username -_id').lean();

  if (!buyer) {
    throw new EntityNotFoundError('usuario', buyerId);
  }

  const advertLink = `${process.env.CORS_ORIGIN}/adverts/${advertId}`;

  await emailService.sendContactEmail({
    sellerEmail: advert.ownerId.email,
    buyerEmail: buyer.email,
    buyerUsername: buyer.username,
    advertName: advert.name,
    message,
    advertLink,
  });
};
