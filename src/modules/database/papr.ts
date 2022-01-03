import config from 'config';
import Papr from 'papr';
import { MongoClient } from 'mongodb';

const ENV: string = process.env['NODE_ENV'] || 'development';

export const MONGO_URI: Record<string, string> = {
  development: process.env['DOCKER'] ? 'mongodb://bookmarks-backend-mongo:27017' : config.get<string>('mongo.uri'),
  production: config.get<string>('mongo.uri'),
  testing: config.get<string>('mongo.uri'),
};

export const DATABASE = `bookmarks-backend_${ENV}`;

export let client: MongoClient;
export const papr = new Papr();

export const connect = async () => {
  client = await MongoClient.connect(MONGO_URI[ENV]);
  papr.initialize(client.db(DATABASE));
  await papr.updateSchemas();
};

export const disconnect = async () => {
  await client.close();
};
