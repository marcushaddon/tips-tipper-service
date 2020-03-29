import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import TipsUser from '../model/TipsUser';
import logger from '../logging/logger';

const PUTtipper = async (req: Request, res: Response, next: NextFunction) => {
    const reqUser: TipsUser = (req as any).user;
    const pendingUser: TipsUser = req.body;
    let allowed = false;
    let message: string = 'Unable to create user';

    if (reqUser.role === 'appService') {
        allowed = true;
    } else if (reqUser.phoneNumber !== pendingUser.phoneNumber){
        message = 'Users may only update their own phone numbers';
    } else {
        allowed = true;
    }

    if (!allowed) {
        return res.status(401).send({ message });
    }

    let createdUser: TipsUser;
    let existingUser = await tippersRepo.getUser(pendingUser.phoneNumber);
    logger.info('existing?', existingUser);
    try {
        createdUser = await tippersRepo.putUser(pendingUser);
    } catch (e) {
        return res.status(400).send(e);
    }

    return res.status(201).send(createdUser);
};

export default PUTtipper;