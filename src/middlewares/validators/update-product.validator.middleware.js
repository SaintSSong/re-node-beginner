import Joi from 'joi';
import { PRODUCT_STATUS } from '../../constants/product.constant.js';

export const updateProductValidator = async (req, res, next) => {
  try {
    // 유효성 검증(joi)은 파싱 하기 전에 해야한다!
    const joiSchema = Joi.object({
      name: Joi.string().required().messages({
        'string.base': '상품명은 문자열이여야 합니다.',
      }),
      description: Joi.string().required().messages({
        'string.base': '상품 설명은 문자열이여야 합니다.',
      }),
      manager: Joi.string().required().messages({
        'string.base': '담당자는 문자열이여야 합니다.',
      }),
      status: Joi.string()
        .valid(...Object.values(PRODUCT_STATUS))
        .messages({
          'string.base': '상품상태는 문자열이여야 합니다.',
          'any.only': '상품 상태는 [FOR_SALE, SOLD_OUT] 중 하나여야 합니다.',
        }),
      password: Joi.string().required().messages({
        'string.base': '비밀번호는 문자열이여야 합니다.',
        'any.required': '비밀번호를 입력해주세요.',
      }),
    });

    // joi의 에러를 검증해주는 곳?
    await joiSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
