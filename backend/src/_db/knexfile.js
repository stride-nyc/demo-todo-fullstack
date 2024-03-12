import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  sqlite3: {
    client: 'sqlite3',
    connection: {
      filename: resolve(__dirname, './MY_COOL.db')
    },
    migrations: {
      directory: resolve(__dirname, './migrations')
    }
  },

  postgresql: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'password',
      database: 'demo_todo_fullstack',
      port: 54320
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: resolve(__dirname, 'migrations')
    }
  },
};

export default config[process.env.DEMO_BACKEND];