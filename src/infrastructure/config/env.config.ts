import * as dotenv from 'dotenv';

dotenv.config();

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
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
    username: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'DBGestionPromociones',
    domain: process.env.DB_DOMAIN || undefined,
    instanceName: process.env.DB_INSTANCE_NAME || undefined,
    useWindowsAuth:
      process.env.DB_USE_WINDOWS_AUTH === 'true' ||
      process.env.DB_AUTH_TYPE === 'ntlm' ||
      Boolean(process.env.DB_DOMAIN),
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
  },
};
