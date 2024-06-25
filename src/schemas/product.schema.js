import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '../constants/product.constant.js';

const productSchema = new mongoose.Schema(
  {
    // id는 몽구DB에서 자동 생성이여서 안만듦
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      // required: true, 는 반드시 필요하다의 의미이다.
      // 즉 이 데이터(password)가 있어야 저장 할 수 있다는 의미
      required: true,
      // 이걸 해야 상품 조회를 할 때 비번이 안나온다.
      // 발제 문서를 봐라. 거기에 비번 없다. 따라서 select : false를 넣는다.
      select: false,
    },
    status: {
      type: String,
      required: true,
      // 튜텨님 추천 객체의 값들만 배열로 만드는 메서드
      enum: Object.values(PRODUCT_STATUS),
      // enum: [PRODUCT_STATUS.FOR_SALE, PRODUCT_STATUS.SOLD_OUT], 내가 만든것
      default: PRODUCT_STATUS.FOR_SALE,
    },
  },
  // (timestamps) = 생성일시, 수정일시 자동 생성 옵션.몽구스의 개별 기능임.
  // (toJSON: { virtuals: true }) = 내가 직접 정의한 속성 말고 가상으로 정의한 속성도 json으로 보여줌
  { timestamps: true, toJSON: { virtuals: true } },
);

//                                    ( 이름, 스키마 전체 변수명 )
export const Product = mongoose.model('Product', productSchema);
