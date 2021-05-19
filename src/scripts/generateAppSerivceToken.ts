import JWTAuthenticator from '../main/auth/JWTAuthenticator';
import jwt from 'jsonwebtoken';


if (process.env.NODE_ENV !== 'develop') {
    const jwtAuthenticator = new JWTAuthenticator();
    (async () => {
        const token = await jwtAuthenticator.sign({ role: 'appService' });
        console.log();
        console.log(token);
        console.log();
    })();
} else {
    const token = jwt.sign({ user: { role: 'appService' }}, process.env.TIPS_JWT_SECRET as string);
    console.log();
    console.log(token);
    console.log();
}



