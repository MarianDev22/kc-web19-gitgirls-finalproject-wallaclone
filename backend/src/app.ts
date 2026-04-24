import express from 'express';
import { authenticationRouter } from './routes/authenticationRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//health
app.use('/health', (req, res) => {
  res.json({
    info: 'Git Girls API up & running',
  });
});

//Routes
app.use('/auth', authenticationRouter);

//error MW
app.use(errorMiddleware);

//should this go in a serparte file? refactor?
export const startHttpApi = () => {
  const url = process.env.PORT || 3000;
  app.listen(url, () => {
    console.log('API up & running on port: ', url);
  });
};
