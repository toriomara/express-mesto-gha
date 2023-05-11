const STATUS_CODES = {
  '200_OK': 200,
  '400_BAD_REQUEST': 400,
  '404_NOT_FOUND': 404,
  '500_INTERNAL_SERVER_ERROR': 500,
};

const MESSAGES = {
  '400_BAD_REQUEST': 'Переданы некорректные данные',
  '404_NOT_FOUND': 'Запрашиваемые данные не найдены',
  '500_INTERNAL_SERVER_ERROR': '«На сервере произошла ошибка',
};

module.exports = { STATUS_CODES, MESSAGES };
