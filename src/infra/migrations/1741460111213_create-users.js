/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id_user: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: {
      type: "varchar(254)",
      notNull: true,
    },
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    password: {
      type: "varchar(72)",
      notNull: true,
    },
    id_position: {
      type: "serial",
      references: "positions(id_position)",
      onDelete: "SET NULL",
    },
    ddi: {
      type: "varchar(3)",
    },
    ddd: {
      type: "varchar(3)",
    },
    phone: {
      type: "varchar(10)",
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
};

exports.down = false;
