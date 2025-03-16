import axios from "axios";

const baseURL = (() => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }

  return process.env.BASE_URL;
})();

export const api = axios.create({
  baseURL,
});
