import { Sequelize } from 'sequelize';

const db = new Sequelize('sqlite::memory:');

(async () => {
    await db.sync({ force: true });
})();


export default db;
