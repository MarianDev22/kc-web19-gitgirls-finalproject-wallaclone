import 'dotenv/config';

import mongoose from 'mongoose';
import { startHttpApi } from '../app';

const connectMongoDb = async () => {
  const url = process.env.MONGO_URI || 'mongodb://localhost:27017';

  // Mejor no imprimir la URI para evitar exponer credenciales en logs
  console.log('Conectando a MongoDB...');
  await mongoose.connect(url);
  console.log('MongoDB conectado');
};

const executeApp = async () => {
  try {
    await connectMongoDb();
    startHttpApi();
  } catch (error) {
    console.log('No se ha podido iniciar la aplicación:', error);
    process.exit(1);
  }
};

void executeApp();
