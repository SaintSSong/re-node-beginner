import express from 'express';
import { Product } from '../schemas/product.schema.js';

import { createProductValidator } from '../middlewares/vaildators/create-product.validator.middleware.js';

const productsRouter = express.Router();

// 상품 생성(C)
productsRouter.post(
  '/products',
  createProductValidator,
  async (req, res, next) => {
    try {
      // 상품 정보 파싱하기
      const { name, description, manager, password } = req.body;

      // DB에 조회하기(패스워드포함)
      const existedProduct = await Product.findOne({ name }).exec();

      if (existedProduct) {
        return res
          .status(400)
          .json({ status: 400, message: '이미 등록된 상품입니다.' });
      }

      // DB에 저장하기 // 저장할 때는 스키마(44번째 줄 이름)에서 임포트해온 것을 가져온다.
      const product = new Product({ name, description, manager, password });

      let data = await product.save(); // product에 save된 결과가 data로 들어간다.

      // 여기서 .toJSON()을 쓰는 이유는 .toJSON을 안쓰면
      // 몽고DB에서 가져오는 원하지 않는 DB를 다 가져오기 때문에 그렇다.
      // JSON으로 바꿔서 필요한 데이터만 가져와서 거기서 또 필요 없는 것을 뺀다.(password)
      data = { ...data.toJSON(), password: undefined };

      // 완료 메세지 반환하기
      return res.status(201).json({
        status: 201,
        message: '상품 생성에 성공했습니다.',
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 상품 목록 조회(R)
productsRouter.get('/products', async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
  // DB에서 조회하기(생성일시 기준 내림차순 정렬)
  const data = await Product.find().sort({ createdAt: 'desc' }).exec();
  //.exec()는 에러가 났을때 어디서 났는지 알려주는 좋은 것! find 쓸 때 같이 쓰자.

  // 완료 메세지 반환하기
  return res
    .status(200)
    .json({ status: 200, message: '상품 목록 조회에 성공했습니다.', data });
});

// 상품 상세 조회(R)
productsRouter.get('/products/:id', async (req, res, next) => {
  try {
    // 상품 ID 파싱하기
    // const id = req.params.id; <- 이걸
    const { id } = req.params; /** 구조분해 할당으로 이렇게 만든 거다. */

    // DB에 조회하기
    const data = await Product.findById(id).exec();

    if (!data) {
      return res
        .status(404)
        .json({ status: 404, message: '상품이 존재하지 않습니다.' });
    }

    // 완료 메세지 반환하기
    return res
      .status(200)
      .json({ status: 200, message: '상품 상세 조회에 성공했습니다.', data });
  } catch (error) {
    next(error);
  }
});

// 상품 수정(U)
productsRouter.put('/products/:id', async (req, res, next) => {
  try {
    // 상품 ID 파싱하기
    const { id } = req.params;

    // 상품 수정 정보 파싱하기
    const { name, description, status, manager, password } = req.body;

    // DB에 조회하기(패스워드포함)
    const existedProduct = await Product.findById(id, {
      password: true,
    }).exec();

    if (!existedProduct) {
      return res
        .status(404)
        .json({ status: 404, message: '상품이 존재하지 않습니다.' });
    }

    // 비밀번호 일치 여부 확인
    const isPasswordMatched = password === existedProduct.password;
    if (!isPasswordMatched) {
      res
        .status(401)
        .json({ status: 401, message: '비밀번호가 일치하지 않습니다.' });
    }

    // 여기 다시 공부 필요
    const productinfo = {
      /** nama에 값이 존재한다. 그러면 { name }가 실행된다. */
      // 그러면 존재 하지 않으면 어떻게 되는가?
      // 없는 샘 치게 된다.
      ...(name && {
        name,
      }),
      ...(description && {
        description,
      }),
      ...(status && {
        status,
      }),
      ...(manager && {
        manager,
      }),
    };

    // DB에 갱신하기
    const data = await Product.findByIdAndUpdate(id, productinfo, {
      new: true,
    });

    // 완료 메세지 반환하기
    return res
      .status(200)
      .json({ status: 200, message: '상품 수정에 성공했습니다.', data });
  } catch (error) {
    next(error);
  }
});

// 상품 삭제(D)
productsRouter.delete('/products/:id', async (req, res, next) => {
  try {
    // 상품 ID 파싱하기
    const { id } = req.params;

    // 패스워드 파싱하기
    const { password } = req.body;

    // DB에 조회하기(패스워드포함)
    const existedProduct = await Product.findById(id, {
      password: true,
    }).exec();

    if (!existedProduct) {
      return res
        .status(404)
        .json({ status: 404, message: '상품이 존재하지 않습니다.' });
    }

    // 비밀번호 일치 여부 확인
    const isPasswordMatched = password === existedProduct.password;
    if (!isPasswordMatched) {
      res
        .status(401)
        .json({ status: 401, message: '비밀번호가 일치하지 않습니다.' });
    }

    // DB에 삭제하기
    const data = await Product.findByIdAndDelete(id);

    // 완료 메세지 반환하기
    return res
      .status(200)
      .json({ status: 200, message: '상품 삭제에 성공했습니다.', data });
  } catch (error) {
    next(error);
  }
});

export { productsRouter }; // 4번째 줄 만든 것을 내보낸다.
