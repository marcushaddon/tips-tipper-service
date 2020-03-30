import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import TipsUser from '../model/TipsUser';
import logger from '../logging/logger';

const PATCHuser = async (req: Request, res: Response, next: NextFunction) => {
    const reqUser = (req as any).user;
    if (reqUser.role !== 'appService') {
        logger.error('Batch PATCH request denied', { reqUser });
        return res.status(403).send({ message: 'Unauthorized' });
    }

    const userPatches = req.body;
    if (!userPatches || !Array.isArray(userPatches)) {
        logger.error('Received invalid batch PATCH request', { userPatches });
        return res.status(400).send({ message: 'Bad request' });
    }

    const results = [];
    for (let userPatch of userPatches) {
        const { phoneNumber, role } = userPatch;
        if (!phoneNumber || !role) {
            results.push({ result: 'error', message: 'Missing required field' });
            continue;
        }
        try {
            const result = await tippersRepo.patchUser(userPatch);
            results.push({ result: 'success' });
        } catch (e) {
            results.push({ result: 'failure', message: e.message });
        }
    }

    res.status(200).send(results);
};

export default PATCHuser;
