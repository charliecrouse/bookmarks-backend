import config from 'config';

import { app } from './app';

export const bootstrapApp = async (): Promise<void> => {
  const port: number = config.get<number>('app.port');

  return new Promise((resolve) => {
    app.listen(port, (): void => {
      console.log(`Application is up at http://localhost:${port}`);
      return resolve();
    });
  });
};
