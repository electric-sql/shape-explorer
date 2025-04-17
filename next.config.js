/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Validate required environment variables on startup
    if (isServer) {
      const requiredEnvVars = [
        "ELECTRIC_URL",
        "ELECTRIC_SOURCE_ID",
        "ELECTRIC_SECRET",
      ];
      const missingEnvVars = requiredEnvVars.filter(
        (envVar) => !process.env[envVar] || process.env[envVar].trim() === "",
      );

      if (missingEnvVars.length > 0) {
        console.error(
          "\x1b[31m%s\x1b[0m",
          "🚨 Error: Missing or empty required environment variables:",
        );
        missingEnvVars.forEach((envVar) => {
          console.error("\x1b[31m%s\x1b[0m", `  - ${envVar}`);
        });
        console.error(
          "\x1b[31m%s\x1b[0m",
          "Please create a .env file with these variables set to non-empty values.",
        );
        console.error(
          "\x1b[31m%s\x1b[0m",
          "You can copy .env.sample as a starting point.",
        );
        process.exit(1);
      }
    }

    return config;
  },
};

module.exports = nextConfig;
