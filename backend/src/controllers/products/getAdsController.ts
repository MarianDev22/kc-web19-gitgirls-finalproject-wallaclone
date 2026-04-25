import { Request, Response, NextFunction } from 'express';
import { getAdvertsQueryValidator } from './AdvertInputValidator';
import { QueryFilter } from 'mongoose';
import { Advert } from '../../models/Advert';

export const getAdsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, minPrice, maxPrice, tag, limit, page } = getAdvertsQueryValidator.parse(
      req.query
    );

    const skip = (page - 1) * limit;

    //uso tipo any para no tener que crear
    const searchQuery: QueryFilter<Advert> = {};

    if (name) {
      searchQuery.name = { $regex: name as string, $options: 'i' };
    }

    if (tag) {
      searchQuery.tags = tag;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      searchQuery.price = {};
      if (minPrice !== undefined) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) searchQuery.price.$lte = Number(maxPrice);
    }

    const advertList = await Advert.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('ownerId', 'username');

    const totalAdverts = await Advert.countDocuments(searchQuery);

    res.status(200).json({
      content: advertList,
      total: totalAdverts,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};
