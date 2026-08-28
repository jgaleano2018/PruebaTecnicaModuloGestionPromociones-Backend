function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Required environment variable "${name}" is not defined`,
    );
  }

  return value;
}

export const envConfig = {
  port: parseInt(process.env.PORT || '3000', 10),

  nodeEnv: process.env.NODE_ENV || 'development',

  apiPrefix: process.env.API_PREFIX || '/api/v1',

  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'http://127.0.0.1:4173',
      ],

  database: {
    host: requiredEnv('DB_HOST'),
    port: parseInt(requiredEnv('DB_PORT'), 10),
    username: requiredEnv('DB_USER'),
    password: requiredEnv('DB_PASSWORD'),
    database: requiredEnv('DB_NAME'),

    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',

    encrypt: process.env.DB_ENCRYPT === 'true',

    trustServerCertificate:
      process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
  },
};