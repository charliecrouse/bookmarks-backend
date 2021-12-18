import 'reflect-metadata';
import { bootstrapDatabase } from './modules/database';

async function bootstrap() {
  await bootstrapDatabase();
}
bootstrap();
