import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import { singleton as jwtAuthenticator } from '../auth/JWTAuthenticator';
import TipsUser from '../model/TipsUser';

const PUTsession = async (req: Request, res: Response, next: NextFunction) => {
    const {
        phoneNumber,
        role,
        nonce
    } = req.body;

    if (!phoneNumber) {
        return res.status(400).send({ message: 'Missing required field phonenumber' });
    }
    if (!nonce) {
        return res.status(400).send({ message: 'Missing required field nonce' });
    }
    if (['tipper', 'recipient'].indexOf(role) < 0) {
        return res.status(400).send({ message: 'Role must be one of tipper | recipient' });
    }

    const existingUser = await tippersRepo.getUser(phoneNumber, role);

    if (!existingUser || !existingUser.nonce) {
        return res.status(401).send({ message: 'No pending session found for user' });
    }

    if (existingUser.nonce !== nonce) {
        return res.status(401).send({ message: 'Didn\'t supply correct nonce' });
    }

    // TODO: Encode JWT
    const token = await jwtAuthenticator.sign(existingUser);

    return res.status(200).send({ token });
};

export default PUTsession;
