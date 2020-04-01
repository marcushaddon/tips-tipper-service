import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import TipsUser from '../model/TipsUser';
import logger from '../logging/logger';

const PUTuser = async (req: Request, res: Response, next: NextFunction) => {
    const reqUser: TipsUser = (req as any).user;
    const pendingUser: TipsUser = req.body;
    logger.verbose('PUT user request', { reqUser, pendingUser });
    let allowed = false;
    let message: string = 'Unable to create user';

    // TODO: HOLY SHIT USERS CAN SIGN UP AS APPSERVER
    if (reqUser.role === 'appService') {
        allowed = true;
    } else if (reqUser.phoneNumber !== pendingUser.phoneNumber) {
        message = 'Users may only update their own phone numbers';
    } else if (["tipper", "recipient"].indexOf(pendingUser.role) < 0) {
        message = `Not authorized to create role ${pendingUser.role}`;
    } else if (reqUser.role !== pendingUser.role) {
        message = `Not authorized to update role`;
    } else {
        allowed = true;
    }

    if (!allowed) {
        logger.error('Denying user PUT operation', { message });
        return res.status(401).send({ message });
    }

    let createdUser: TipsUser;
    try {
        createdUser = await tippersRepo.putUser(pendingUser);
    } catch (e) {
        logger.error('Unable to PUT user', e);
        return res.status(400).send({ message: e.message });
    }

    logger.info('PUT user', createdUser);
    return res.status(201).send(createdUser);
};

export default PUTuser;
