import { SecretsManager } from 'aws-sdk';
import jsonwebtoken from 'jsonwebtoken';
import config from 'config';
import logger from '../logging/logger';
import TipsUser from '../model/TipsUser';

const appConfig = config.get('app') as any;

export default class JWTAuthenticator {
    private _local: boolean;
    private _cachedSecret?: string;
    public constructor(
        private secretsManager = new SecretsManager({ region: appConfig.region }),
        private jwt = jsonwebtoken
    ) {
        this._local = process.env.NODE_ENV === 'develop';
        this.refreshSecret();
    }

    public async authenticate(token: string, refreshed = false): Promise<TipsUser> {
        if (typeof this._cachedSecret === 'undefined') {
            await this.refreshSecret();
        }

        let user: TipsUser;
        let decoded: any;
        try {
            decoded = this.jwt.verify(token, this._cachedSecret as string);
            user = decoded.user;
        } catch (e) {
            if (this._local || e.name === 'TokenExpiredError' || refreshed) {
                throw e;
            }

            await this.refreshSecret();
            user = await this.authenticate(token, true);
        }

        if (typeof user === 'undefined') {
            throw new Error('No user found in decoded token');
        }

        return user;
    }

    public async sign(user: TipsUser): Promise<string> {
        await this.refreshSecret();
        const ttl = parseInt(appConfig.jwtTTTL);
        
        const token = this.jwt.sign(
            { user },
            this._cachedSecret as string,
            { expiresIn: appConfig.jwtTTL }
        );

        return token;
    }

    private async refreshSecret() {
        if (this._local) {
            this._cachedSecret = process.env.TIPS_JWT_SECRET;
            logger.info('Running locally, using JWT secret from env');

            return ;
        }

        const res = await this.secretsManager.getSecretValue({
            SecretId: appConfig.jwtSecretKey
        }).promise();

        if (typeof res.SecretString === 'undefined') {
            throw new Error('Unable to refresh shared JWT secret');
        }
        console.log(res.SecretString);

        // TODO: I guess we need to parse?
        this._cachedSecret = res.SecretString;
    }

}

export const singleton = new JWTAuthenticator();
