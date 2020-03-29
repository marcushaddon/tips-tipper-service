import { DynamoDB } from 'aws-sdk';
const { AttributeValue: attr } = require('dynamodb-data-types');
import config from 'config';
import TipsUser from '../model/TipsUser';
import validate from '../model/validate';

const appConfig = config.get('app') as any;

export default class TippersRepository {
    private _tableName: string;
    public constructor(private db = new DynamoDB({ region: appConfig.get('region') })) {
        this._tableName = appConfig.get('dynamoTable');
    }

    public async getUser(phoneNumber: string): Promise<TipsUser | undefined> {
        const params = {
            Key: {
                'phoneNumber': {
                    S: phoneNumber
                }
            },
            TableName: this._tableName
        };

        const res = await this.db.getItem(params).promise();

        return res.Item ? attr.unwrap(res.Item) as TipsUser : undefined;
    }

    public async putUser(user: TipsUser): Promise<TipsUser> {
        const valres = validate(user, 'TipsUser');
        if (!valres.valid) {
            throw new Error('Tips user is invalid.' + valres.errors.join('\n'));
        }

        // TODO: Check text input!
        const params = {
            Item: attr.wrap(user),
            TableName: this._tableName
        };

        await this.db.putItem(params).promise();

        return user;
    }

    public async deleteUser(phoneNumber: string): Promise<void> {
        const params = {
            Key: attr.wrap({ phoneNumber }),
            TableName: this._tableName
        };

        await this.db.deleteItem(params).promise();
    }
}

export const singleton = new TippersRepository();