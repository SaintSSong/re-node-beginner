import Joi from 'joi';

export const createProductValidator = async (req, res, next) => {
  try {
    // 유효성 검증(joi)은 파싱 하기 전에 해야한다!
    const joiSchema = Joi.object({
      password: Joi.string().required().messages({
        'string.base': '비밀번호는 문자열이여야 합니다.',
        'any.required': '비밀번호를 입력해주세요.',
      }),
    });

    // joi의 에러를 검증해주는 곳?
    await joiSchema.validateAsync(req.body);
  } catch (error) {
    next(error);
  }
};
