import { DataSource } from 'typeorm';
import configEnv from "./utils/dotenv.config";
import { TypeOrmConnection } from './database';
import { Express } from 'express';
import { ExpressServer } from './server/server';

const bootstrapApp = async () => {
    configEnv();
    await bootstrapDB();
    await bootstrapServer();
}



const bootstrapDB = async () => {
    const dataSource: DataSource = TypeOrmConnection.getConnection();
    await dataSource.initialize();
    await dataSource.runMigrations();
    console.log('Connection established successfully.');
}


const bootstrapServer = async () => {
    const app: Express = ExpressServer.getServer();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server succesfully started on ${PORT} port`);
    })
}

bootstrapApp();