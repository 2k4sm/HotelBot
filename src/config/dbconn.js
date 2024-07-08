import { Sequelize } from 'sequelize';

const db = new Sequelize('sqlite::memory:');

export default db;
