// const whitelist = [
//   'http://localhost:3000',
//   'https://toriomara.nomoredomains.rocks',
//   'http://toriomara.nomoredomains.rocks',
// ];

// const corsOptions = {
//   origin(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// module.exports = { corsOptions };

const whitelist = [
  'http://localhost:3000',
  'https://toriomara.nomoredomains.rocks',
  'http://toriomara.nomoredomains.rocks',
  'https://api.toriomara.nomoredomains.rocks',
  'http://api.toriomara.nomoredomains.rocks',
];

module.exports = (req, res, next) => {
  // Сохраняем источник запроса в переменную origin
  const { origin } = req.headers;
  // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  // проверяем, что источник запроса есть среди разрешённых
  if (whitelist.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  return next();
};
