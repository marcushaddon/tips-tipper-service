import { DynamoDB } from 'aws-sdk';
const { AttributeValue: attr } = require('dynamodb-data-types');
import cronparser from 'cron-parser';
import config from 'config';
import TipsUser from '../model/TipsUser';
import PaginatedResponse from '../model/PaginatedResponse';
import validate from '../model/validate';
import logger from '../logging/logger';

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

    public async getTippers({
        pageSize = 50,
        nextScheduledLTE,
        continuationToken
    }: { pageSize: number, nextScheduledLTE: string, continuationToken?: string }): Promise<PaginatedResponse<TipsUser>> {
        const params: DynamoDB.QueryInput = {
            TableName: appConfig.dynamoTable,
            Limit: pageSize,
            KeyConditionExpression: '#role = :role AND #nextScheduledTime <= :nst',
            ExpressionAttributeValues: {
                ':role': { S: 'tipper' },
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
            throw new Error('Tips user is invalid. ' + breakdown);
        }

        // TODO: Check text input!
        const params = {
            Item: attr.wrap(user),
            TableName: this._tableName
        };

        await this.db.putItem(params).promise();

        return user;
    }

    public async patchUser(userPatch: { [key: string]: any }): Promise<TipsUser> {
        const valres = validate(userPatch, 'TipsUser');
        if (!valres.valid) {
            const breakdown = valres
                .errors
                .map(error => `${error.property} -> ${error.message}`).join('\n');
            throw new Error('Tips user is invalid. ' + breakdown);
        }

        if (userPatch.dirty) {
            logger.info('Updating user schedule', { userPatch });
            userPatch = this.updateSchedule(userPatch as TipsUser);
            logger.info('Updated user schedule', { userPatch });
        }

        const fields = Object.keys(userPatch)
            .filter(key => ["phoneNumber", "role"]
            .indexOf(key) === -1);
        
        const Key = attr.wrap({ phoneNumber: userPatch.phoneNumber, role: userPatch.role });
        const ExpressionAttributeNames: { [key: string]: string } = {};
        const preExpressionAttributeValues: { [key: string]: string } = {};
        const updateExpressionParts: string[] = [];

        fields.forEach(field => {
            const name = `#${field}`;
            const attribute = `:${field}`;
            ExpressionAttributeNames[name] = field;
            preExpressionAttributeValues[attribute] = userPatch[field];
            updateExpressionParts.push(`${name} = ${attribute}`);
        });

        const ExpressionAttributeValues = attr.wrap(preExpressionAttributeValues);
        const UpdateExpression = `SET ${updateExpressionParts.join(', ')}`;

        const params: DynamoDB.UpdateItemInput = {
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            UpdateExpression,
            Key,
            TableName: appConfig.dynamoTable
        };

        const res = await this.db.updateItem(params).promise();

        return { role: 'tipper' };
    }

    public async deleteUser(phoneNumber: string): Promise<void> {
        const params = {
            Key: attr.wrap({ phoneNumber }),
            TableName: this._tableName
        };

        await this.db.deleteItem(params).promise();
    }

    private updateSchedule(user: TipsUser): TipsUser {
        if (!user.schedules) return user;
        let nextTime = Infinity;
        for (let schedule of user.schedules) {
            const interval = cronparser.parseExpression(schedule.cron, {
                tz: schedule.timezone
            });
            const time = interval.next().getTime();
            schedule.nextScheduledTime = time;

            if (time < nextTime) {
                nextTime = time;
            }
        }
        
        const nextScheduled = new Date(nextTime).toLocaleString('en-us', { timeZone: 'America/Los_Angeles' });
        const output = { ...user, nextScheduledTime: nextTime, nextScheduled, dirty: false };

        return output;
    }
}

export const singleton = new TippersRepository();
