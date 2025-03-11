/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("services", {
    id_service: {
      type: "serial",
      primaryKey: true,
    },
    description: {
      type: "varchar(512)",
      notNull: true,
    },
    //define se é locação de veículo ou não
    type: {
      type: "varchar(1)",
      notNull: true,
    },
    price: {
      type: "numeric(10,2)",
      notNull: true,
    },
    observation: {
      type: "text",
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
};

exports.down = false;
