import config from 'config';

const port: number = config.get<number>('app.port');
console.log(`The application is listening at http://localhost:${port}`);
