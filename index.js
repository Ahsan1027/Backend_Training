import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import Agenda from './jobs/config';
import './config/database';
import ApplyMiddlewares from './middlewares';
import './middlewares/passport'
import routers from './routes';
import './jobs/definitions';

const app = express();

app.use(cors());
ApplyMiddlewares(app);

app.use('/api', routers);
app.use('/', express.static(__dirname + '/uploads'));
app.listen(process.env.PORT || 4000, async () => {
  console.log(`app is listening to port ${process.env.PORT}`);
  await Agenda._ready;
  console.log('Agenda Ready');
  Agenda.start();
  console.log('Agenda Started');
});