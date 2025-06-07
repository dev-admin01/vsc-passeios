/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["localhost"],
  },
  // Configuração para evitar o uso do Edge Runtime em rotas que usam Axios
  runtime: "nodejs",
};

export default nextConfig;
