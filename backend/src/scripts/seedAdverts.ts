import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';

import { Advert, AdvertStatus } from '../models/Advert';
import { User } from '../models/User';
import { securityService } from '../controllers/authentication/securityService';

type SeedAdvert = {
    name: string;
    description: string;
    price: number;
    isSale: boolean;
    tags: string[];
    image: string;
    status: AdvertStatus;
};

const forbiddenFields = [
    'id',
    '_id',
    'ownerId',
    'owner',
    'createdAt',
    'updatedAt',
    'user',
    'category',
];

const allowedFields = [
    'name',
    'description',
    'price',
    'isSale',
    'tags',
    'image',
    'status',
];

const allowedStatuses = [
    AdvertStatus.Available,
    AdvertStatus.Reserved,
    AdvertStatus.Sold,
];

// Usuarios ficticios usados
const demoPassword = process.env.SEED_DEMO_PASSWORD ?? 'WallacloneDemo2026!';

const demoUsersData = [
    {
        username: 'laura_martin',
        email: 'laura.martin.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'david_rodriguez',
        email: 'david.rodriguez.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'nuria_vazquez',
        email: 'nuria.vazquez.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'alvaro_santos',
        email: 'alvaro.santos.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'marta_iglesias',
        email: 'marta.iglesias.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'sergio_blanco',
        email: 'sergio.blanco.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'paula_navarro',
        email: 'paula.navarro.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'ivan_romero',
        email: 'ivan.romero.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'clara_mendez',
        email: 'clara.mendez.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'marcos_ferrer',
        email: 'marcos.ferrer.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'elena_castro',
        email: 'elena.castro.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'ruben_molina',
        email: 'ruben.molina.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'carmen_lopez',
        email: 'carmen.lopez.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'diego_herrera',
        email: 'diego.herrera.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'ines_ortega',
        email: 'ines.ortega.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'hugo_ramirez',
        email: 'hugo.ramirez.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'sofia_cabrera',
        email: 'sofia.cabrera.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'adrian_moreno',
        email: 'adrian.moreno.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'lucia_vega',
        email: 'lucia.vega.demo@wallaclone.local',
        password: demoPassword,
    },
    {
        username: 'mateo_soler',
        email: 'mateo.soler.demo@wallaclone.local',
        password: demoPassword,
    },
];

const connectMongoDb = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('Falta la variable de entorno MONGO_URI.');
    }

    if (process.env.NODE_ENV === 'production') {
        throw new Error('No ejecutes este seed con NODE_ENV=production.');
    }

    console.log('Conectando a MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB conectado.');
};

const validateAdvert = (advert: unknown, index: number): SeedAdvert => {
    const recordNumber = index + 1;

    if (!advert || typeof advert !== 'object') {
        throw new Error(`Registro ${recordNumber}: debe ser un objeto.`);
    }

    const advertRecord = advert as Record<string, unknown>;
    const advertFields = Object.keys(advertRecord);

    for (const field of forbiddenFields) {
        if (field in advertRecord) {
            throw new Error(
                `Registro ${recordNumber}: no debe incluir el campo "${field}".`,
            );
        }
    }

    for (const field of advertFields) {
        if (!allowedFields.includes(field)) {
            throw new Error(
                `Registro ${recordNumber}: campo no permitido "${field}".`,
            );
        }
    }

    if (typeof advertRecord.name !== 'string' || advertRecord.name.length < 3) {
        throw new Error(`Registro ${recordNumber}: name debe ser un texto válido.`);
    }

    if (
        typeof advertRecord.description !== 'string' ||
        advertRecord.description.length < 10
    ) {
        throw new Error(
            `Registro ${recordNumber}: description debe ser un texto válido.`,
        );
    }

    if (
        typeof advertRecord.price !== 'number' ||
        !Number.isInteger(advertRecord.price) ||
        advertRecord.price < 1
    ) {
        throw new Error(
            `Registro ${recordNumber}: price debe ser un número entero positivo.`,
        );
    }

    if (typeof advertRecord.isSale !== 'boolean') {
        throw new Error(`Registro ${recordNumber}: isSale debe ser boolean.`);
    }

    if (
        !Array.isArray(advertRecord.tags) ||
        advertRecord.tags.length === 0 ||
        !advertRecord.tags.every((tag) => typeof tag === 'string')
    ) {
        throw new Error(
            `Registro ${recordNumber}: tags debe ser un array de textos.`,
        );
    }

    if (
        typeof advertRecord.image !== 'string' ||
        !advertRecord.image.startsWith('https://')
    ) {
        throw new Error(
            `Registro ${recordNumber}: image debe ser una URL https válida.`,
        );
    }

    if (
        typeof advertRecord.status !== 'string' ||
        !allowedStatuses.includes(advertRecord.status as AdvertStatus)
    ) {
        throw new Error(
            `Registro ${recordNumber}: status debe ser AVAILABLE, RESERVED o SOLD.`,
        );
    }

    return {
        name: advertRecord.name,
        description: advertRecord.description,
        price: advertRecord.price,
        isSale: advertRecord.isSale,
        tags: advertRecord.tags,
        image: advertRecord.image,
        status: advertRecord.status as AdvertStatus,
    };
};

const normalizeText = (text: string) => {
    return text.trim().toLowerCase();
};

const validateUniqueSeedData = (seedAdverts: SeedAdvert[]) => {
    const names = new Set<string>();
    const descriptions = new Set<string>();
    const images = new Set<string>();

    for (const advert of seedAdverts) {
        const normalizedName = normalizeText(advert.name);
        const normalizedDescription = normalizeText(advert.description);
        const normalizedImage = normalizeText(advert.image);

        if (names.has(normalizedName)) {
            throw new Error(`Hay un name repetido: "${advert.name}".`);
        }

        if (descriptions.has(normalizedDescription)) {
            throw new Error(
                `Hay una description repetida en el anuncio: "${advert.name}".`,
            );
        }

        if (images.has(normalizedImage)) {
            throw new Error(`Hay una image repetida en el anuncio: "${advert.name}".`);
        }

        names.add(normalizedName);
        descriptions.add(normalizedDescription);
        images.add(normalizedImage);
    }
};

const loadSeedAdverts = async (): Promise<SeedAdvert[]> => {
    const seedPath = path.resolve(process.cwd(), 'data', 'adverts.seed.json');

    console.log(`Leyendo archivo de seed: ${seedPath}`);

    const seedFile = await fs.readFile(seedPath, 'utf-8');
    const seedData = JSON.parse(seedFile) as unknown;

    if (!Array.isArray(seedData)) {
        throw new Error('El archivo adverts.seed.json debe contener un array.');
    }

    const seedAdverts = seedData.map((advert, index) =>
        validateAdvert(advert, index),
    );

    validateUniqueSeedData(seedAdverts);

    return seedAdverts;
};

const findOrCreateDemoUsers = async () => {
    const demoUsers = [];

    for (const demoUserData of demoUsersData) {
        const existingUser = await User.findOne({ email: demoUserData.email });

        if (existingUser) {
            demoUsers.push(existingUser);
            continue;
        }

        const hashedPassword = await securityService.hashPassword(
            demoUserData.password,
        );

        const createdUser = await User.create({
            username: demoUserData.username,
            email: demoUserData.email,
            password: hashedPassword,
        });

        demoUsers.push(createdUser);
    }

    return demoUsers;
};

const seedAdverts = async () => {
    await connectMongoDb();

    try {
        const seedAdverts = await loadSeedAdverts();

        console.log(`Anuncios encontrados en el JSON: ${seedAdverts.length}`);

        const demoUsers = await findOrCreateDemoUsers();

        console.log(`Usuarios demo preparados: ${demoUsers.length}`);

        const demoUserIds = demoUsers.map((user) => user._id);

        console.log('Borrando anuncios demo anteriores...');
        await Advert.deleteMany({ ownerId: { $in: demoUserIds } });

        const advertsToCreate = seedAdverts.map((advert, index) => {
            const owner = demoUsers[index % demoUsers.length];

            return {
                ...advert,
                ownerId: owner._id,
            };
        });

        console.log(`Insertando ${advertsToCreate.length} anuncios demo...`);
        await Advert.insertMany(advertsToCreate);

        console.log('Seed de anuncios completado correctamente.');
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB desconectado.');
    }
};

seedAdverts().catch((error) => {
    console.error('Error ejecutando el seed de anuncios:');
    console.error(error);
    process.exit(1);
});
