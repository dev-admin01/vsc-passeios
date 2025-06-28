// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     serverActions: true,
//   },
//   images: {
//     domains: ["localhost"],
//   },
//   // Configuração para evitar o uso do Edge Runtime em rotas que usam Axios
//   runtime: "nodejs",
//   webpack: (config: any, { isServer }: { isServer: boolean }) => {
//     if (isServer) {
//       config.externals.push({
//         "node-gyp": "commonjs node-gyp",
//         npm: "commonjs npm",
//       });
//     }

//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       fs: false,
//     };

//     // Suprimir warnings específicos do bcrypt
//     config.ignoreWarnings = [
//       /Critical dependency: the request of a dependency is an expression/,
//       /Module not found: Can't resolve 'node-gyp'/,
//       /Module not found: Can't resolve 'npm'/,
//     ];

//     return config;
//   },
// };

// export default nextConfig;

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
