import * as dotenv from 'dotenv';

const configEnv = () => {
    dotenv.config({
        path: `.${process.env.NODE_ENV}.env`,
    });
};

export default configEnv;
