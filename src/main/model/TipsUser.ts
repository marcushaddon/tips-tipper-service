type TipsUser = {
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    venmo?: string;
    paypal?: string;
    preferredMethod?: 'paypal' | 'venmo';
    reminderSchedule?: string;
    nextScheduled?: string;
    nextScheduledTime?: number;
    nextScheduledFor?: string;
    role: 'tipper' | 'recipient' | 'appService';
    nonce?: string;
};

export default TipsUser;
