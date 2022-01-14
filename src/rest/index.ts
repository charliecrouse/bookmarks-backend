import { app } from './app';

export const bootstrapApp = async (): Promise<void> => {
  const port = +(process.env['PORT'] || 9001);

  return new Promise((resolve) => {
    app.listen(port, (): void => {
      console.log(`Application is up at http://localhost:${port}`);
      return resolve();
    });
  });
};
