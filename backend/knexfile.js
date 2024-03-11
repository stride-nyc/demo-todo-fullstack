// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {

  // development: {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: './MY_COOL.db'
  //   }
  // },
  
    development: {
    client: 'pg',
    connection: {
      host : 'localhost',
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
      tableName: 'knex_migrations'
    }
  },

};
