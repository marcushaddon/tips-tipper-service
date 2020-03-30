type TipsUser = {
    // Common fields
    firstName?: string;
    lastName?: string;
    role: 'tipper' | 'recipient' | 'appService';

    // Tipper fields
    phoneNumber?: string;
    reminderSchedule?: string;
    nextScheduled?: string;
    nextScheduledTime?: number;
    nextScheduledFor?: string;
    nonce?: string;

    // Recipient fields
    venmo?: string;
    paypal?: string;
    preferredMethod?: 'paypal' | 'venmo';
    tipJarId?: string;
    lastTipped?: string;
    lastTippedTime?: number;
};

export default TipsUser;
