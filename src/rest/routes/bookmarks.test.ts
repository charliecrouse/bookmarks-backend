import request from 'supertest';

import { app } from '@rest/app'
import { bootstrapDatabase } from '@modules/database';

describe('rest.bookmarks', () => {

  beforeAll(async () => {
    await bootstrapDatabase();
  });

  beforeEach(async () => {
    // TODO: clear database
    console.log('clearing db');
  });

  describe('POST /bookmarks', () => {
    it('should create a new bookmark', async () => {
    });
  });
});
