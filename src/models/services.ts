import database from "@/infra/database";
// import { ValidationError } from "@/infra/errors";
import { Services } from "@/types/service.types";

async function create(serviceInput: Services) {
  const newService = await runInsertQuery(serviceInput);
  return newService;

  async function runInsertQuery(serviceInputValue: Services) {
    const results = await database.query({
      text: `
                INSERT INTO
                 services (description, type, price, observation) 
                VALUES
                 ($1, $2, $3, $4)
                RETURNING
                  id_service, description, type, price, observation
                ;`,
      values: [
        serviceInputValue.description,
        serviceInputValue.type,
        serviceInputValue.price,
        serviceInputValue.observation,
      ],
    });
    return results.rows[0];
  }
}

interface List {
  page: number;
  limit: number;
  search: string;
}

async function list({ page, limit, search }: List) {
  console.log("chegou no model");
  const offset = (page - 1) * limit;

  const serviceList = await runListtQuery();
  console.log("controller service:", serviceList);

  return serviceList;

  async function runListtQuery() {
    const results = await database.query({
      text: `
          SELECT * 
          FROM services
          WHERE description ILIKE $1
          ORDER BY id_service
          LIMIT $2
          OFFSET $3
        `,
      values: [`%${search}%`, limit, offset],
    });

    // Consulta para contar o total de registros que satisfaçam o filtro:
    const countResult = await database.query({
      text: `
          SELECT COUNT(*) as total
          FROM services
          WHERE description ILIKE $1
        `,
      values: [`%${search}%`],
    });

    const total = parseInt(countResult.rows[0].total, 10);

    return {
      data: results.rows,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

const services = {
  create,
  list,
};

export default services;
