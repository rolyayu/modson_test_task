import { type DataSource } from 'typeorm';
import configEnv from './utils/dotenv.config';
import { TypeOrmConnection } from './database';
import { type Express } from 'express';
import { ExpressServer } from './server/server';
import { LoggerFactory } from './utils';

const logger = LoggerFactory.getLogger('Application');

const bootstrapApp = async () => {
    configEnv();
    await bootstrapDB();
    await bootstrapServer();
};

const bootstrapDB = async () => {
    const dataSource: DataSource = TypeOrmConnection.getConnection();
    await dataSource.initialize();
    logger.info('Database connection established.');
    await dataSource.runMigrations();
};

const bootstrapServer = async () => {
    const app: Express = ExpressServer.getServer();
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        logger.info(`Server succesfully started on ${PORT} port`);
    });
    process.on('unhandledRejection', (err: Error) => {
        logger.crit('unhandledRejection. Exiting...');
        server.close(() => {
            process.exit(1);
        });
    });
    process.on('SIGTERM', () => {
        logger.crit('SIGTERM received. Shutting down...');
        server.close(() => {
            logger.info('Process terminated.');
        });
    });
};

bootstrapApp();
