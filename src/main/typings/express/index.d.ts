declare namespace Express {
    interface Request {
        vars: { [key: string ]: any};
    }
}