import Papr from 'papr';
import { MongoClient } from 'mongodb';

const ENV: string = process.env['NODE_ENV'] || 'development';
const MONGO_URI: string = process.env['MONGO_URI'] || '';

export const DATABASE = `bookmarks-backend_${ENV}`;

export let client: MongoClient;
export const papr = new Papr();

export const connect = async () => {
  client = await MongoClient.connect(MONGO_URI);
  papr.initialize(client.db(DATABASE));
  await papr.updateSchemas();
};

export const disconnect = async () => {
  await client.close();
};
