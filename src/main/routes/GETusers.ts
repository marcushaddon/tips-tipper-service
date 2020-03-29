import { Request, Response, NextFunction } from 'express';
import { singleton as tippersRepo } from '../repository/TippersRepository';
import TipsUser from '../model/TipsUser';
import PaginatedResponse from '../model/PaginatedResponse';
import logger from '../logging/logger';

const GETuser = async (req: Request, res: Response, next: NextFunction) => {
    const reqUser = (req as any).user;
    if (reqUser.role !== 'appService') {
        logger.error('Denying GET users', { reqUser });
        return res.status(403).send({ message: 'Unauthorized' });
    }

    let {
        page,
        page_size,
        next_scheduled_lte,
        continuation_token
    } = req.query;
    let parsed_page_size = page_size && page_size.length ? parseInt(page_size) : 50;
    let users: PaginatedResponse<TipsUser>;
    try {
        users = await tippersRepo.getUsers({
            pageSize: parsed_page_size,
            continuationToken: continuation_token
        });
    } catch (e) {
        logger.error('Error GETting users', e);
        return res.status(500).send({ message: 'Internal error' });
    }

    res.send(users);
};

export default GETuser;
