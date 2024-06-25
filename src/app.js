import express from 'express';
import { SERVER_PORT } from './constants/env.constant.js';
import { productsRouter } from '../src/routers/products.router.js';
import { connect } from './schemas/index.js';

connect();

const app = express();

// 내가 바디에 적어놓은 것을 밖에서 보여주기 위해서 필요.
app.use(express.json());

// Express.js 미들웨어 중 하나로, URL-encoded 형식의 데이터를 파싱하기 위해 사용.
// 이를 통해 HTML 폼에서 제출된 데이터를 서버에서 쉽게 사용할 수 있도록 합니다.
app.use(express.urlencoded({ extended: true }));

// 위의 두개는 그냥 외워라!!

app.use('/api', productsRouter);

app.get('/', (req, res) => {
  return res.json('서버가 연결되었습니다.');
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on ${SERVER_PORT}`);
});
