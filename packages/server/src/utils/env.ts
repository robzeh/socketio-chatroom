require('dotenv').config();

const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;

const REDIS_PORT = process.env.NODE_ENV === 'test'
  ? process.env.TEST_REDIS_PORT
  : process.env.REDIS_PORT;



export { PORT, ORIGIN, REDIS_PORT };