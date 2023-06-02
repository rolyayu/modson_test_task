import { DataSource, DataSourceOptions } from "typeorm";
import configEnv from "../utils/dotenv.config";

configEnv();
const entitiesPath = __dirname + '/../**/*.entity.ts';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    entities: [entitiesPath],
    logging: process.env.NODE_ENV == 'development',
    synchronize: process.env.NODE_ENV != 'production',
    migrations: ['migrations/**/*.ts'],
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;