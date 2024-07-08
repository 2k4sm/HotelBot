import { Sequelize } from 'sequelize';

const db = new Sequelize('sqlite::memory:');

(async () => {
    await db.sync({ alter: true });
})();


export default db;
