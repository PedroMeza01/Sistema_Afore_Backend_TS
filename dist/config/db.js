"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbLocal = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
exports.dbLocal = new sequelize_typescript_1.Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    timezone: '+00:00',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    models: [
        path_1.default.resolve(__dirname, '..', 'models', '**', '*.{ts,js}'),
        path_1.default.resolve(__dirname, '..', 'modules', '**', 'model', '*.{ts,js}')
    ],
    logging: false
});
/*

import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const dbLocal = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  timezone: '+00:00',
  dialectOptions: {
    ssl: false,
    useUTC: true
  },
  models: [
    path.resolve(__dirname, '..', 'models', '**', '*.{ts,js}'),
    path.resolve(__dirname, '..', 'modules', '**', 'model', '*.{ts,js}')
  ],
  logging: false
});
*/
//# sourceMappingURL=db.js.map