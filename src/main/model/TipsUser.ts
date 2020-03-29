type ReminderSchedule = {
    cron: string;
    for: string;
    nextScheduled: string;
    nextScheduledTime: number;
};

type TipsUser = {
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    venmo?: string;
    paypal?: string;
    preferredMethod?: 'paypal' | 'venmo';
    // reminderSchedule?: ReminderSchedule;
    role: 'tipper' | 'recipient' | 'appService';
    nonce?: string;
};

export default TipsUser;
