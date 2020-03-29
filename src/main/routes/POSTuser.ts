import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import TipsUser from '../model/TipsUser';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const reqUser: TipsUser = (req as any).user;
    const pendingUser: TipsUser = req.body;
    let allowed = false;
    let message: string = 'Unable to create user';

    switch (reqUser.role) {
        case 'recipient':
        case 'tipper':
            if (reqUser.phoneNumber !== pendingUser.phoneNumber) {
                message = 'Users may only update their own phone numbers';
            } else {
                allowed = true;
            }
            break;
        case 'appService':
            allowed = true;
            break;
        default:
            message = `Unknown role ${reqUser.role}`;
    }

    if (!allowed) {
        return res.status(401).send({ message });
    }

    let createdUser: TipsUser;
    try {
        createdUser = await tippersRepo.putUser(reqUser);
    } catch (e) {
        return res.status(400).send(e);
    }

    return res.status(201).send(createdUser);
};

export default createUser;