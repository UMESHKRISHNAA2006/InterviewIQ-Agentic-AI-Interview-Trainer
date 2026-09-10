/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Never expose IBM credentials to the browser bundle
  serverRuntimeConfig: {
    IBM_WATSONX_API_KEY: process.env.IBM_WATSONX_API_KEY,
    IBM_WATSONX_PROJECT_ID: process.env.IBM_WATSONX_PROJECT_ID,
    IBM_ORCHESTRATE_API_KEY: process.env.IBM_ORCHESTRATE_API_KEY,
    IBM_ORCHESTRATE_AGENT_ID: process.env.IBM_ORCHESTRATE_AGENT_ID,
    IBM_ORCHESTRATE_BASE_URL: process.env.IBM_ORCHESTRATE_BASE_URL,
  },

  // Only public, non-secret config exposed to the browser
  publicRuntimeConfig: {
    APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "development",
  },
};

module.exports = nextConfig;
