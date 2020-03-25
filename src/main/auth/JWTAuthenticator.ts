import { SecretsManager } from 'aws-sdk';
import jsonwebtoken from 'jsonwebtoken';
import TipsUser from '../model/TipsUser';

export default class JWTAuthenticator {
    private _cachedSecret?: string;
    public constructor(private secretsManager = new SecretsManager(), private jwt = jsonwebtoken) {
        this.refreshSecret();
    }

    public async authenticate(token: string, refreshed = false): Promise<TipsUser> {
        console.log('AUTHENTICING', token);
        if (typeof this._cachedSecret === 'undefined') {
            await this.refreshSecret();
        }

        let user: TipsUser;
        let decoded: any;
        try {
            decoded = this.jwt.verify(token, this._cachedSecret as string);
            console.log('DECODRD', decoded);
            user = decoded.user;
        } catch (e) {
            console.log(e);
            if (e.name === 'TokenExpiredError' || refreshed) {
                throw e;
            }
            console.log('REFESHING TOKEN');
            await this.refreshSecret();
            user = await this.authenticate(token, true);
        }

        if (typeof user === 'undefined') {
            throw new Error('No user found in decoded token');
        }

        return user;
    }

    private async refreshSecret() {
        const res = await this.secretsManager.getSecretValue({
            SecretId: 'tips-jwt-secret'
        }).promise();

        if (typeof res.SecretString === 'undefined') {
            throw new Error('Unable to refresh shared JWT secret');
        }

        this._cachedSecret = res.SecretString;
    }

}