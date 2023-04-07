import { DataSource, createConnection } from "typeorm";

import configEnv from "../utils/dotenv.config";

export const getDataSource = async () => {
    configEnv();
    const entitiesPath = __dirname + '/../**/*.entity.ts';
    const TypeOrmConnection = await new DataSource(
        {
            type: 'postgres',
            host: process.env.PG_HOST,
            port: Number(process.env.PG_PORT),
            username: process.env.PG_USERNAME,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE,
            entities: [entitiesPath],
            logging: true,
            synchronize: true
        }
    ).initialize();
    await TypeOrmConnection.synchronize()
        .then(() => console.log('Connection established'));
    return TypeOrmConnection;
}