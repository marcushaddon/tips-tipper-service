import { DynamoDB } from 'aws-sdk';
const { AttributeValue: attr } = require('dynamodb-data-types');
import config from 'config';
import TipsUser from '../model/TipsUser';
import PaginatedResponse from '../model/PaginatedResponse';
import validate from '../model/validate';

const appConfig = config.get('app') as any;

export default class TippersRepository {
    private _tableName: string;
    public constructor(private db = new DynamoDB({ region: appConfig.get('region') })) {
        this._tableName = appConfig.get('dynamoTable');
    }

    public async getUser(phoneNumber: string, role: string): Promise<TipsUser | undefined> {
        const params = {
            Key: {
                'phoneNumber': {
                    S: phoneNumber
                },
                'role': {
                    S: role
                }
            },
            TableName: this._tableName
        };

        const res = await this.db.getItem(params).promise();

        return res.Item ? attr.unwrap(res.Item) as TipsUser : undefined;
    }

    public async getUsers({
        pageSize = 50,
        role,
        nextScheduledLTE,
        continuationToken
    }: { pageSize: number, role: string, nextScheduledLTE: string, continuationToken?: string }): Promise<PaginatedResponse<TipsUser>> {
        const params: DynamoDB.QueryInput = {
            TableName: appConfig.dynamoTable,
            Limit: pageSize,
            KeyConditionExpression: '#role = :role AND #nextScheduledTime <= :nst',
            ExpressionAttributeValues: {
                ':role': { S: role },
                ':nst': { N: nextScheduledLTE},
            },
            ExpressionAttributeNames: {
                '#nextScheduledTime': 'nextScheduledTime',
                '#role': 'role',
            },
            IndexName: 'next-scheduled-time-index'
        };
        if (continuationToken) {
            const esk = { phoneNumber: continuationToken };
            params.ExclusiveStartKey = attr.wrap(esk)
        }

        let res = await this.db.query(params).promise();
        
        return {
            items: res.Items?.map(item => attr.unwrap(item)),
            continuationToken: attr.unwrap(res.LastEvaluatedKey).phoneNumber
        };
    }

    public async putUser(user: TipsUser): Promise<TipsUser> {
        const valres = validate(user, 'TipsUser');
        if (!valres.valid) {
            const breakdown = valres
                .errors
                .map(error => `${error.property} -> ${error.message}`).join('\n');
            throw new Error('Tips user is invalid.' + breakdown);
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
