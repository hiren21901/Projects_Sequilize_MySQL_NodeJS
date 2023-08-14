import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Sequelize from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Create a Sequelize instance for Mykhoj database
const mykhojDB = new Sequelize(process.env.MYKHOJ_DB_URL, {
  dialect: 'mariadb',
  define: {
    underscored: false,
    freezeTableName: false,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
    },
    timestamps: false,
  },
  pool: {
    max: 10,
    idle: 10000,
    acquire: 30000,
  },
});

// Create a Sequelize instance for Mktem database
const mktemDB = new Sequelize(process.env.MKTEM_DB_URL, {
  dialect: 'mariadb',
  define: {
    underscored: false,
    freezeTableName: false,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
    },
    timestamps: false,
  },
  pool: {
    max: 10,
    idle: 10000,
    acquire: 30000,
  },
});

// Connect to the databases
(async () => {
  try {
    await mykhojDB.authenticate();
    console.log('Connected to Mykhoj database.');

    await mktemDB.authenticate();
    console.log('Connected to Mktem database.');
    
  } catch (error) {
    console.error('Error connecting to the databases:');
  }
})();

export { mykhojDB, mktemDB };