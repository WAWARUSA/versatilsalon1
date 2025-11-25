import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Asegurar que las variables de entorno estén disponibles
  env: {
    // Las variables NEXT_PUBLIC_* se exponen automáticamente
  },
};

export default nextConfig;
