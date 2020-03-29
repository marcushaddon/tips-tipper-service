type ReminderSchedule = {
    cron: string;
    for: string;
};

type TipsUser = {
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    venmo?: string;
    paypal?: string;
    preferredMethod?: 'paypal' | 'venmo';
    reminderSchedule?: ReminderSchedule;
    nextScheduled?: string;
    nextScheduledTime?: number;
    nextScheduledFor?: string;
    role: 'tipper' | 'recipient' | 'appService';
    nonce?: string;
};

export default TipsUser;
