import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import TipsUser from '../model/TipsUser';
import logger from '../logging/logger';

const GETuser = async (req: Request, res: Response, next: NextFunction) => {
    const reqUser = (req as any).user;
    const { phoneNumber }  = req.params;
    const { role } = req.query;
    if (reqUser.role !== 'appService') {
        let allowed = false;
        let message: string = 'Unable to GET user';
        if (reqUser.phoneNumber !== phoneNumber) {
            message = 'Users may only view their own accounts';
        } else if (reqUser.role !== role) {
            message = 'Roles do not match';
        } else if (['receipient', 'tipper'].indexOf(role) < 0) {
            message = 'Role must be one of (tipper, recipient)';
        } else {
            allowed = true;
        }

        if (!allowed) {
            logger.error('Denying GET user', { message, reqUser, phoneNumber });
            return res.status(403).send({ message });
        }
    }

    let user: TipsUser | undefined;
    try {
        user = await tippersRepo.getUser(phoneNumber, role);
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
