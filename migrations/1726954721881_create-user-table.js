/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Ensure the pgcrypto extension is installed
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')

  pgm.createTable('users', {
    id: {
      type: 'serial',
      primaryKey: true,
      notNull: true,
    },
    uuid: {
      type: 'uuid',
      unique: true,
      notNull: true,
    },
    email: {
      type: 'varchar(255)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'varchar(255)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('users')
}
