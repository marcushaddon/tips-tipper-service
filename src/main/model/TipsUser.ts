type Schedule = {
    cron: string,
    for: string,
    tipJarId: string
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
    nextScheduledTipJarId?: string;
    nextScheduledFor?: string;
    nonce?: string;
};

export default TipsUser;
