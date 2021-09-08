module.exports = {
  images: {
    domains: ["gateway.pinata.cloud"],
    env: {
      BASE_URL: process.env.BASE_URL,
      NEXT_PUBLIC_PINIATA_API_KEY: process.env.NEXT_PUBLIC_PINIATA_API_KEY,
      NEXT_PUBLIC_PINIATA_API_SECRET_KEY:
        process.env.NEXT_PUBLIC_PINIATA_API_SECRET_KEY,
    },
    distDir: "out",
  },
};
