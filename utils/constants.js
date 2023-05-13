const STATUS_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const MESSAGES = {
  BAD_REQUEST: 'Переданы некорректные данные',
  NOT_FOUND: 'Запрашиваемые данные не найдены',
  INTERNAL_SERVER_ERROR: 'На сервере произошла ошибка',
};

module.exports = { STATUS_CODES, MESSAGES };
