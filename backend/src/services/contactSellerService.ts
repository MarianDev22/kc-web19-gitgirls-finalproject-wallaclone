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
  const forSaleAdvert = await Advert.findById(advertId)
    .populate<{ ownerId: PopulatedOwner }>('ownerId', 'email')
    .lean();
  if (!forSaleAdvert) {
    throw new EntityNotFoundError('anuncio', advertId);
  }
  const sellerEmail = forSaleAdvert.ownerId.email;
  const advertName = forSaleAdvert.name;

  const advertOwnerId = forSaleAdvert.ownerId._id.toString();
  if (advertOwnerId === buyerId) {
    throw new ForbiddenOperationError('No puedes contactar con tu propio anuncio');
  }

  const buyer = await User.findById(buyerId).select('email username -_id').lean();
  if (!buyer) {
    throw new EntityNotFoundError('usuario', buyerId);
  }
  const { email: buyerEmail, username: buyerUsername } = buyer;

  await emailService.sendContactEmail({
    sellerEmail,
    buyerEmail,
    buyerUsername,
    advertName,
    message,
  });
  return
};
