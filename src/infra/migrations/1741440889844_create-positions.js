/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("positions", {
    id_position: {
      type: "serial",
      primaryKey: true,
    },
    description: {
      type: "varchar(512)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

  pgm.sql(`
    INSERT INTO positions (description, created_at, updated_at)
    VALUES
      ('manager', now(), now()),
      ('Admin', now(), now()),
      ('seller', now(), now()),
      ('operator', now(), now());
  `);
};

exports.down = false;
