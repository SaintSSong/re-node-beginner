import express from 'express';
import { SERVER_PORT } from './constants/env.constant.js';

const app = express();

app.get('/', (req, res) => {
  return res.json('서버가 연결되었습니다.');
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on ${SERVER_PORT}`);
});
