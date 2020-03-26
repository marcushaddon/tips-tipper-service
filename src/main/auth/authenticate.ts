import express from 'express';
import JWTAuthenticator from '../auth/JWTAuthenticator';


const jwtAuthenticator = new JWTAuthenticator();

const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req);
    const header = req.header('Authentication');
    if (typeof header === 'undefined') {
        return res.status(401).send('Missing authentication header');
    }

    const tokenMatch = header.match(/(?<=Bearer ).+/);
    console.log(tokenMatch);
    if (!tokenMatch) {
        return res.status(401).send('Malformed authentication header');
    }

    let user;
    try {
        user = await jwtAuthenticator.authenticate(tokenMatch[0]);
    } catch (e) {
        // TODO: Send helpful message
        return res.status(401).send('Authentication was expired or improperly encoded');
    }

    (req as any).user = user;
    next();
};

export default authenticate;