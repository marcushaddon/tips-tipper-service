import { BatchAssociateApprovalRuleTemplateWithRepositoriesInput } from "aws-sdk/clients/codecommit";

type Schedule = {
    cron: string;
    for: string;
    tipJarId: string;
    timezone: string;
};

type TipsUser = {
    // Common fields
    firstName?: string;
    lastName?: string;
    role: 'tipper' | 'recipient' | 'appService';

    // Tipper fields
    phoneNumber?: string;
    schedules?: Schedule[];
    nextScheduled?: string;
    nextScheduledTime?: number;
    nonce?: string;
    dirty?: boolean;
};

export default TipsUser;
