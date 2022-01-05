import { bootstrapDatabase } from '@modules/database';

describe('rest.bookmarks', () => {
  beforeAll(async () => {
    await bootstrapDatabase();
  });

  beforeEach(async () => {
    // TODO: clear database
    console.log('clearing db');
  });
});
