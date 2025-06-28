import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const api = axios.create({
  baseURL,
  validateStatus: (status) => status < 500, // Não trata 4xx como erro
});
