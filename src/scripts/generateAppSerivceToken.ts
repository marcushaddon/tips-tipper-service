import jwt from 'jsonwebtoken';

if (process.env.NODE_ENV !== 'local') {
    console.log('TODO: implement cloud version');
    process.exit(1);
}

const token = jwt.sign({ user: { role: 'appService' }}, process.env.TIPS_JWT_SECRET as string);

console.log();
console.log(token);
console.log();