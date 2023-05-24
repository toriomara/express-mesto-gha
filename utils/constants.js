const STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const MESSAGES = {
  BAD_REQUEST: 'Переданы некорректные данные',
  UNAUTHORIZED: 'Неправильная почта или пароль',
  FORBIDDEN: 'Действие запрещено',
  NOT_FOUND: 'Запрашиваемые данные не найдены',
  CONFLICT: 'Возник конфликт запроса с сервером', // Так себе описание
  INTERNAL_SERVER_ERROR: 'На сервере произошла ошибка',
};

module.exports = { STATUS_CODES, MESSAGES };
