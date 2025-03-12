import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    // Προσωρινή απενεργοποίηση του ESLint κατά τη διάρκεια του build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Προσωρινή απενεργοποίηση του TypeScript checking κατά τη διάρκεια του build
    ignoreBuildErrors: true,
  },
}

export default nextConfig
