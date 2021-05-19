import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import TipsUser from '../model/TipsUser';
import logger from '../logging/logger';

const POSTsession = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Creating a session');
    let message = 'Unable to create session';
    const { phoneNumber, role } = req.body;

    if (!phoneNumber) {
        return res.status(400).send({ message: 'Missing required field: phoneNumber' });
    }

    if (['tipper', 'recipient'].indexOf(role) < 0) {
        return res.status(400).send({ message: 'Must supply valid role: tipper | recipient' });
    }

    // TODO: Make sure nonce is always six digits
    const nonce = Math.floor(Math.random() * 1000000 + 999999).toString();
    
    console.log('Maybe getting user');
    const existingUser = await tippersRepo.getUser(phoneNumber, role);
    console.log('Maybe got user');

    let userToPut: TipsUser;
    if (!existingUser) {
        logger.info('New user initiated signup', { phoneNumber, role, reminderSchedule: {} });
        userToPut = { phoneNumber, role, nonce };
    } else {
        logger.info('Existing user initiated login', existingUser);
        userToPut = { ...existingUser, nonce };
    }

    try {
        await tippersRepo.putUser(userToPut);
    } catch (e) {
        logger.error('Unable to PUT user', e);
        return res.status(500).send({ message: 'An internal error occurred' });
    }

    // TODO: Send text!!!!!
    res.status(201).send({ message: 'Session created' });
};

export default POSTsession;
