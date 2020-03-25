import express from 'express';

const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    throw Error('TODO: Auth');
};

export default authenticate;