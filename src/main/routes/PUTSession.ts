import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import { singleton as jwtAuthenticator } from '../auth/JWTAuthenticator';
import TipsUser from '../model/TipsUser';

const PUTsession = async (req: Request, res: Response, next: NextFunction) => {
    const phoneNumber = req.body.phoneNumber;
    const nonce = req.body.nonce;

    if (!phoneNumber) {
        return res.status(400).send({ message: 'Missing required field phonenumber' });
    }
    if (!nonce) {
        return res.status(400).send({ message: 'Missing required field nonce' });
    }

    const existingUser = await tippersRepo.getUser(phoneNumber);

    if (!existingUser || !existingUser.nonce) {
        return res.status(401).send({ message: 'No pending session found for user' });
    }

    if (existingUser.nonce !== nonce) {
        return res.status(401).send({ message: 'Didn\t supply correct nonce' });
    }

    // TODO: Encode JWT
    const token = await jwtAuthenticator.sign(existingUser);

    return res.status(200).send({ token });
};

export default PUTsession;
