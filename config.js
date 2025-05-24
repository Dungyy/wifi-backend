import { configDotenv } from 'dotenv';
configDotenv();


export const SUDO_PASSWORD = process.env.SUDO_PASSWORD;
export const INTERFACE = process.env.INTERFACE || 'wlan0';
export const PORT = process.env.PORT || 3000;
// export const DB_PATH = process.env.DB_PATH || './wifi_scan.db';
// export const DB_TYPE = process.env.DB_TYPE || 'sqlite';
// export const DB_USER = process.env.DB_USER || 'user';
// export const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
// export const DB_HOST = process.env.DB_HOST || 'localhost';
// export const DB_PORT = process.env.DB_PORT || 5432;
// export const DB_NAME = process.env.DB_NAME || 'wifi_scan';