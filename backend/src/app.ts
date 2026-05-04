import cors from 'cors';
import express, { Request, Response } from 'express';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware';
import { authenticationRouter } from './routes/authenticationRoutes';
import { webRouter } from './routes/webRoutes';

export const app = express();

const port = process.env.PORT || 3000;

// Middleware de CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Comprobación de estado de la API
app.use('/health', (_req: Request, res: Response) => {
  res.json({
    info: 'Git Girls API en funcionamiento',
  });
});

// Rutas principales
app.use('/auth', authenticationRouter);
app.use('/adverts', webRouter);

// Ruta no encontrada
app.use(notFoundMiddleware);

// Middleware centralizado de errores
app.use(errorMiddleware);

export const startHttpApi = () => {
  app.listen(port, () => {
    console.log('API en funcionamiento en el puerto:', port);
  });
};
