import { DataSource } from 'typeorm';
import { dataBaseConfig } from '../config';

export class TypeOrmConnection {
    private static connection: DataSource;

    private constructor() { }

    public static getConnection = (): DataSource => {
        if (!this.connection) {
            this.connection = this.configureDataSource();
        }
        return this.connection;
    };

    private static readonly configureDataSource = (): DataSource => {
        return new DataSource(dataBaseConfig);
    };
}
