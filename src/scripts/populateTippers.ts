import { singleton as tippersRepo } from '../main/repository/TippersRepository';
import TipsUser from '../main/model/TipsUser';

const tippers: TipsUser[] = [...Array(20).keys()].map((i) => ({
    firstName: `First-${i}`,
    lastName: `Last-${i}`,
    role: 'tipper',
    phoneNumber: `+1540718733${i}`,
    reminderSchedule: '0 0 0 0 0 0 0 ',
    nextScheduled: `2020-03-04T0${i}:00:00.000Z`,
    nextScheduledTime: i * 1000,
    nextScheduledFor: 'coffee'
}));

console.log('Hello');

(async () => {
    const proms = tippers.map(t => tippersRepo.putUser(t));
    await Promise.all(proms);
    console.log('donzo');
})();
