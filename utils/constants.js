const STATUS_CODES = {
  CREATED: 201,
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

const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';

module.exports = {
  STATUS_CODES, MESSAGES, REGEX_URL, DB_URL,
};
