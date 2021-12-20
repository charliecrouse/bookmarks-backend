import 'reflect-metadata';

import { bootstrapDatabase } from '@modules/database';
import { bootstrapApp } from '@rest'

async function bootstrap() {
  await bootstrapDatabase();
  await bootstrapApp();
}
bootstrap();
