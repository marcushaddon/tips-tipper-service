import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import TipsUser from '../model/TipsUser';
import logger from '../logging/logger';

const GETuser = async (req: Request, res: Response, next: NextFunction) => {
    const reqUser = (req as any).user;
    const phoneNumber = req.params.phoneNumber;
    if (reqUser.role !== 'appService' && reqUser.phoneNumber !== phoneNumber) {
        logger.error('Denying GET user', { reqUser, phoneNumber });
        return res.status(403).send({ message: 'Users may only fetch their own records' });
    }

    let user: TipsUser | undefined;
    try {
        user = await tippersRepo.getUser(phoneNumber);
    } catch (e) {
        logger.error('Unable to GET user', e);
    }

    if (!user) {
        logger.error('User not found', { phoneNumber });
        return res.status(404).send({ message: 'User not found' });
    }

    logger.info('Found user', user);
    res.status(200).send(user);
};

export default GETuser;
