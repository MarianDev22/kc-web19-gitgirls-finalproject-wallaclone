import type { RequestHandler } from 'express';
import type { QueryFilter } from 'mongoose';
import { Advert } from '../../models/Advert';
import { User } from '../../models/User';
import { escapeRegex } from '../../utils/stringUtils';
import { getAdvertsQueryValidator } from './AdvertInputValidator';
import { mapAdvertToResponse } from './advertResponseMapper';

export const getAdsController: RequestHandler = async (req, res, next) => {
  try {
    const { name, minPrice, maxPrice, tag, username, limit, page } =
      getAdvertsQueryValidator.parse(req.query);

    const skip = (page - 1) * limit;

    const searchQuery: QueryFilter<Advert> = {
      status: { $in: ['AVAILABLE', 'RESERVED', 'SOLD'] },
    };

    if (username) {
      const user = await User.findOne({ username });

      if (!user) {
        res.status(200).json({
          content: [],
          total: 0,
          page,
          limit,
        });
        return;
      }

      searchQuery.ownerId = user._id;
    }

    if (name) {
      searchQuery.name = { $regex: escapeRegex(name), $options: 'i' };
    }

    if (tag) {
      searchQuery.tags = tag;
    }

    const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;

    if (hasPriceFilter) {
      searchQuery.price = {};

      if (minPrice !== undefined) {
        searchQuery.price.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        searchQuery.price.$lte = maxPrice;
      }
    }

    const [advertList, totalAdverts] = await Promise.all([
      Advert.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('ownerId', 'username'),
      Advert.countDocuments(searchQuery),
    ]);

    res.status(200).json({
      content: advertList.map((advert) => mapAdvertToResponse(advert)),
      total: totalAdverts,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};
