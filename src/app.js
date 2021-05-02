import express, { Router } from 'express';
import routerProduct from './routes/Product.js';
import winston from 'winston';
import { promisify } from 'util';
import fs from 'fs';

const writeFile = promisify(fs.writeFile);

global.fileProduct = './data/product.json';
global.fileUser = './data/user.json';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const app = express();

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'despensa_api.log' }),
  ],
  format: combine(label({ label: 'despensa_api' }), timestamp(), myFormat),
});
function exists(data) {
  data !== null && data !== undefined;
}

app.listen(3001, async () => {
  try {
    const fileExists = await exists(fileProduct);
    if (!fileExists) {
      const initialJson = {
        nextId: 1,
        products: [],
      };
      await writeFile(fileProduct, JSON.stringify(initialJson));
    }
  } catch (err) {
    logger.error(err);
  }
  console.log('app listening on port  3001');
});

app.use('/', routerProduct);
