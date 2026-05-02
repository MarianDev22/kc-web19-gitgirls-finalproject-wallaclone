type ObjectIdLike = {
    toString: () => string;
};

type PopulatedOwner = {
    _id: ObjectIdLike | string;
    username?: string;
};

type AdvertResponseSource = {
    _id: ObjectIdLike | string;
    name: string;
    description: string;
    price: number;
    isSale: boolean;
    image: string;
    tags: string[];
    ownerId: ObjectIdLike | string | PopulatedOwner;
    status: string;
};

const hasId = (value: unknown): value is PopulatedOwner => {
    return typeof value === 'object' && value !== null && '_id' in value;
};

const getIdAsString = (value: ObjectIdLike | string | PopulatedOwner) => {
    return hasId(value) ? value._id.toString() : value.toString();
};

export const mapAdvertToResponse = (advert: AdvertResponseSource) => {
    const ownerId = advert.ownerId;

    return {
        id: advert._id.toString(),
        name: advert.name,
        description: advert.description,
        price: advert.price,
        isSale: advert.isSale,
        image: advert.image,
        tags: advert.tags,
        ownerId: getIdAsString(ownerId),
        owner:
            hasId(ownerId) && ownerId.username
                ? {
                    id: getIdAsString(ownerId),
                    username: ownerId.username,
                }
                : undefined,
        status: advert.status,
    };
};
