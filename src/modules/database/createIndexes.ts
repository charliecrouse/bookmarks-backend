import { client, connect, disconnect, DATABASE } from '@modules/database/papr';

import { createBookmarkIndexes } from '@models/bookmark';
import { createTokenIndexes } from '@models/token';
import { createUserIndexes } from '@models/user';

async function main() {
  await connect();
  const db = client.db(DATABASE);

  await Promise.all([createBookmarkIndexes(db), createTokenIndexes(db), createUserIndexes(db)]);

  await disconnect();
}

main()
  .then(() => process.exit())
  .catch((err) => {
    throw err;
  });
