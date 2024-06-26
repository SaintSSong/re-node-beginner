import Joi from 'joi';

export const createProductValidator = async (req, res, next) => {
  try {
    // 유효성 검증(joi)은 파싱 하기 전에 해야한다!
    const joiSchema = Joi.object({
      name: Joi.string().required().messages({
        'string.base': '상품명은 문자열이여야 합니다.',
        'any.required': '상품명을 입력해주세요.',
      }),
      description: Joi.string().required().messages({
        'string.base': '상품 설명은 문자열이여야 합니다.',
        'any.required': '상품 설명을 입력해주세요.',
      }),
      manager: Joi.string().required().messages({
        'string.base': '담당자는 문자열이여야 합니다.',
        'any.required': '담당자를 입력해주세요.',
      }),
      password: Joi.string().required().messages({
        'string.base': '비밀번호는 문자열이여야 합니다.',
        'any.required': '비밀번호를 입력해주세요.',
      }),
    });

    // joi의 에러를 검증해주는 곳?
    await joiSchema.validateAsync(req.body);
    next(); // next()를 안써주면 다음으로 안넘어감 따라서 미들웨어에서 try()catch(){} 할 때 next를 꼭 써야함.
  } catch (error) {
    next(error);
  }
};
