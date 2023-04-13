import { createExpressServer } from 'routing-controllers';
import { DataSource } from 'typeorm';
import configEnv from "./utils/dotenv.config";
import { TypeOrmConnection } from './database';
import { Express } from 'express';
import MeetUp from './meetups/meetups.entity';
import MeetUpTag from './meetups/meetups-tag.entity';
import { MeetUpFactory } from './meetups/meetups.factory';

const bootstrapApp = async () => {
    configEnv();
    await bootstrapDB();
    await bootstrapServer();
}



const bootstrapDB = async () => {
    const dataSource: DataSource = TypeOrmConnection.getConnection();
    await dataSource.initialize()
    await dataSource.synchronize(true)
        .then(() => {
            console.log('Connection established successfully.')
        });
}


const bootstrapServer = async () => {
    const app: Express = createExpressServer({
        controllers: [__dirname + '/**/*.controller.ts']
    });
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server succesfully started on ${PORT} port`);
    })
}

bootstrapApp();