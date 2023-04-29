import { DataSource } from "typeorm";

import configEnv from "../utils/dotenv.config";

export class TypeOrmConnection {
    private static connection: DataSource;

    private constructor() { }

    public static getConnection = (): DataSource => {
        if (!this.connection) {
            this.connection = this.configureDataSource();
        }
        return this.connection;
    }

    private static configureDataSource = (): DataSource => {
        configEnv();
        const entitiesPath = __dirname + '/../**/*.entity.ts';
        return new DataSource(
            {
                type: 'postgres',
                host: process.env.PG_HOST,
                port: Number(process.env.PG_PORT),
                username: process.env.PG_USERNAME,
                password: process.env.PG_PASSWORD,
                database: process.env.PG_DATABASE,
                entities: [entitiesPath],
                logging: true,
                migrations: ['migrations/**/*.ts']
            }
        )
    }
}
