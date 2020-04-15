import * as fs from 'fs';
import * as https from 'https';
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
import PATCHuser from './main/routes/PATCHuser';

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
app.patch('/users', PATCHuser);

app.get('/', (req, res) => { res.send('hello') });

let final;
if (process.env.NODE_ENV === 'develop') {
    console.log('Develop env detected, serving over http');
    final = app;
} else {
    console.log('Test/Prod env detected serving over https');
    const creds = {
        ca: fs.readFileSync('/etc/letsencrypt/letsencrypt/live/tipsbot.us/chain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/letsencrypt/live/tipsbot.us/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/letsencrypt/live/tipsbot.us/cert.pem')
    };
    final = https.createServer(creds, app);
}

final.listen(appConfig.port, () => logger.info(`Tipper service up and listening on ${appConfig.port}`));
