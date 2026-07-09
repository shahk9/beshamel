// config.js — глобална конфигурация за клиентското приложение за поръчки.
// apiBase се избира автоматично според хоста, за да работи и на dev, и на прод.
(function () {
  var host = window.location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '';

  // DEV: Laravel API върви на порт 8200.
  // ПРОД: приложението ще живее на orders.beshamel.bg и очаква API на същия домейн
  //       или на beshamel.bg. Смени реда по-долу при качване на прод, ако API-то
  //       е на отделен домейн (напр. 'https://beshamel.bg/api/v1').
  // ДЕМО (временно): публичен тунел към API-то, за да работи от телефон.
  // При качване на прод — върни на '/api/v1' или 'https://beshamel.bg/api/v1'.
  var DEMO_API = 'https://switches-art-oct-gzip.trycloudflare.com/api/v1';

  var apiBase = isLocal
    ? 'http://127.0.0.1:8200/api/v1'
    : DEMO_API;

  window.ORDERS_CONFIG = {
    apiBase: apiBase
  };
})();
