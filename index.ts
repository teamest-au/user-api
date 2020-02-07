import Koa, { Context } from 'koa';
import cors from '@koa/cors';
import Logger from '@danielemeryau/logger';

import router from './src/router';

const logger = new Logger('user-api');
const app = new Koa();

const port = process.env.PORT || '5000';

app.on('error', err => {
  logger.error('Unexpected error occurred', err);
});

app.use(cors());
app.use(router.routes());

logger.info(`Application listening on ${port}`, { test: 'test' });
app.listen(port);
