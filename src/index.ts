import express from 'express';
import bodyParser from 'body-parser';
import config from 'config';
import logger from './main/logging/logger';
import authenticate from './main/auth/authenticate';
import POSTsession from './main/routes/POSTsession';
import PUTsession from './main/routes/PUTsession';
import PUTtipper from './main/routes/PUTtipper';

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
app.post('/session', POSTsession);
app.put('/session', PUTsession);

app.post('/users', PUTtipper);

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
