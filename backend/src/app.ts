import express from 'express';
import { authenticationRouter } from './routes/authenticationRoutes';

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
app.use('/authentication', authenticationRouter);

//should this go in a serparte file? refactor?
export const startHttpApi = () => {
  const url = process.env.API_PORT;
  app.listen(url, () => {
    console.log('API up & running on port: ', url);
  });
};
