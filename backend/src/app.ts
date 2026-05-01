import express from 'express';
import { authenticationRouter } from './routes/authenticationRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { webRouter } from './routes/webRoutes';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Healthcheck
app.use('/health', (_req, res) => {
  res.json({
    info: 'Git Girls API en funcionamiento',
  });
});

// Rutas
app.use('/auth', authenticationRouter);
app.use('/adverts', webRouter);

// Middleware de errores
app.use(errorMiddleware);

export const startHttpApi = () => {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log('API en funcionamiento en el puerto:', port);
  });
};

