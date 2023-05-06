import * as dotenv from 'dotenv';

/**
 * Configurate process.env according to NODE_ENV attribute(given via cross-env NODE_ENV=<type>)
 */
const configEnv = () => {
  dotenv.config({
    path: `.${process.env.NODE_ENV}.env`,
  });
};

export default configEnv;
