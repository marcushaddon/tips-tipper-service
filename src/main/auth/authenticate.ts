import express from 'express';
import { singleton as jwtAuthenticator } from '../auth/JWTAuthenticator';
import logger from '../logging/logger';

const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const header = req.header('Authentication');
    if (typeof header === 'undefined') {
        return res.status(401).send('Missing authentication header');
    }

    const tokenMatch = header.match(/(?<=Bearer ).+/);

    if (!tokenMatch) {
        return res.status(401).send('Malformed authentication header');
    }

    let user;
    try {
        user = await jwtAuthenticator.authenticate(tokenMatch[0]);
    } catch (e) {
        // TODO: Send helpful message
        logger.error('Encountered error authenticating user', e);
        return res.status(401).send({ message: e.message });
    }

    (req as any).user = user;
    next();
};

export default authenticate;