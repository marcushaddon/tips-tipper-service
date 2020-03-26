import { DynamoDB } from 'aws-sdk';
import config from 'config';
import TipsUser from '../model/TipsUser';

const appConfig = config.get('app') as any;


export default class TippersRepository {
    public constructor(private db = new DynamoDB({ region: appConfig.region })) {}

    public async getUser(phoneNumber: string): TipsUser {
        const params = {
            Key: {
                'phoneNumber': {
                    S: phoneNumber
                }
            },
            TableName: appConfig.dynamoTable
        };

        const res = await this.db.getItem(params).promise();

        return res.Item
    }
}