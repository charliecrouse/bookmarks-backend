import { connectToDatabase } from './database';
import { createApp } from './server';

async function main(): Promise<void> {
  await connectToDatabase();

  const app = createApp();
  const port: number = app.get('PORT');

  await app.listen(port);
  console.log(`Application is up at http://localhost:${port}`);
}

if (!module.parent) {
  main().catch(function(err) {
    console.error(err.toString());
    return process.exit();
  });
}
