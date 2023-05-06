import { type DataSource } from 'typeorm';
import configEnv from './utils/dotenv.config';
import { TypeOrmConnection } from './database';
import { type Express } from 'express';
import { ExpressServer } from './server/server';

const bootstrapApp = async () => {
  configEnv();
  await bootstrapDB();
  await bootstrapServer();
};

const bootstrapDB = async () => {
  const dataSource: DataSource = TypeOrmConnection.getConnection();
  await dataSource.initialize();
  await dataSource.runMigrations();
  console.log('Connection established successfully.');
};

const bootstrapServer = async () => {
  const app: Express = ExpressServer.getServer();
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server succesfully started on ${PORT} port`);
  });
  process.on('unhandledRejection', (err: Error) => {
    // TODO add logger error
    server.close(() => {
      process.exit(1);
    });
  });
  process.on('SIGTERM', () => {
    // TODO reclace consoles with logger info
    console.log('SIGTERM received. Shutting down...');
    server.close(() => {
      console.log('Process terminated.');
    });
  });
};

bootstrapApp();
