import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import TipsUser from '../model/TipsUser';

const POSTsession = async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Unable to create session';
    const phoneNumber = req.body.phoneNumber;
    console.log(req.body);
    if (!phoneNumber) {
        return res.status(400).send({ message });
    }

    // TODO: Make sure nonce is always six digits
    const nonce = Math.floor(Math.random() * 1000000 + 999999).toString();
    
    const existingUser = await tippersRepo.getUser(phoneNumber);

    if (!existingUser) {
        console.log('CREATING NEW');
        await tippersRepo.putUser({ phoneNumber, role: 'tipper', nonce });
    } else {
        console.log('UPDATING EXISTING')
        await tippersRepo.putUser( { ...existingUser, nonce });
    }

    // TODO: Send text!!!!!

    res.status(201).send({ message: 'Session created' });
};

export default POSTsession;
