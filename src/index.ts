import express from 'express';
import bodyParser from 'body-parser';
import config from 'config';
import logger from './main/logging/logger';
import authenticate from './main/auth/authenticate';
import POSTsession from './main/routes/POSTsession';
import PUTsession from './main/routes/PUTsession';
import GETusers from './main/routes/GETusers';
import GETuser from './main/routes/GETuser';
import PUTuser from './main/routes/PUTuser';

const appConfig = config.get('app') as any;


const app = express();

// ============================
// SETUP
// ============================
app.use(bodyParser.json());

// ============================
// GLOBAL 
// ============================
app.use(/\/((?!session).)*/, authenticate);

// ===========================
// ROUTES
// ===========================
app.post('/sessions', POSTsession);
app.put('/sessions', PUTsession);

app.get('/users', GETusers);
app.get('/users/:phoneNumber', GETuser);
app.put('/users', PUTuser);

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
