import express from 'express';
import config from 'config';
import logger from './main/logging/logger';
import authenticate from './main/auth/authenticate';

const appConfig = config.get('app') as any;


const app = express();

app.use(authenticate);

app.get('/', (req, res) => { res.send('hello') });

/**
 * TODO:
 * 1. GET tippers (count, offset, sort), admin only
 * 2. GET tipper/{id}, admin only
 * 3. POST tipper, tipper and admin
 * 4. PUT tipper, tipper and admin
 * 5. DELETE tipper, tipper and admin
 */



app.listen(appConfig.port, () => logger.info(`Tipper service up and listening on ${appConfig.port}`));
