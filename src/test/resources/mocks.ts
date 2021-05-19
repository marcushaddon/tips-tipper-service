const mockToken = {
    iat: 12412412323,
    expiresIn: 3242142,
    user: {

    }
};

const mockJsonwebtoken = {
    verify: jest.fn().mockReturnValue(mockToken)
};

const mockSecretsManager = {
    getSecretValue: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({ SecretString:  'test-secret' }) })
}

export {
    mockToken,
    mockJsonwebtoken,
    mockSecretsManager
}