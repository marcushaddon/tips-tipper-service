import { mockToken, mockJsonwebtoken, mockSecretsManager } from '../resources/mocks';
import JWTAuthenticator from '../../main/auth/JWTAuthenticator';

import { SecretsManager } from 'aws-sdk';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

describe('JWTAuthenticator', () => {
    let uut: JWTAuthenticator;
    beforeEach(() => {
        uut = new JWTAuthenticator(mockSecretsManager as any, mockJsonwebtoken as any);
    });
    afterEach(jest.clearAllMocks);

    it('#authenticate authenticates valid token', async () => {
        const user = await uut.authenticate('this.should.pass');
        expect(user).toBeDefined();
    });

    it('#authenticate refeshes token on first failure', async () => {
        mockJsonwebtoken.verify
            .mockImplementationOnce(() => { throw new JsonWebTokenError('invalid signature') })
            .mockReturnValueOnce(mockToken);
        const res = await uut.authenticate('fail.then.succeed');
        expect(res).toBeDefined();
        expect(mockSecretsManager.getSecretValue).toHaveBeenCalledTimes(2);
    });

    it('#authenticate rejects on expired token', async () => {
        mockJsonwebtoken.verify.mockImplementationOnce(() => { throw new TokenExpiredError('expired token', new Date()) });
        expect(uut.authenticate('this.should.fail')).rejects.toThrow()
    });
});
