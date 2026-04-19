import express from 'express';

const app = express();

app.use('/api', (req, res) => {
  const message = '<h1> Este es el backend de las Git Girls ;) </h1>';
  res.send(message);
  //     res.json({
  //     info: 'first endpoint',
  //   });
});

app.listen(3000, () => {
  console.log('up & running on port:', 3000);
});
