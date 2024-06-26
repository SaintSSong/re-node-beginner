export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // 에러 이름이 'ValidationError'라는 이름으로 발생하면 아래로 코드가 넘어가게 된다.
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      message: err.message, //Joi에서 제공하는 에러 메세지를 제공한다.
    });
  }

  return res.status(500).json({
    status: 500,
    message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
};
