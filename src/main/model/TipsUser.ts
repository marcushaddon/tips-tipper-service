type TipsUser = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    venmo?: string;
    paypal?: string;
    preferredMethod?: 'paypal' | 'venmo';
};

export default TipsUser;
