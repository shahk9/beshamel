// config.js — глобална конфигурация за клиентското приложение за поръчки.
// apiBase се избира автоматично според хоста, за да работи и на dev, и на прод.
(function () {
  var host = window.location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '';

  // DEV: Laravel API върви на порт 8200.
  // ПРОД: приложението ще живее на orders.beshamel.bg и очаква API на същия домейн
  //       или на beshamel.bg. Смени реда по-долу при качване на прод, ако API-то
  //       е на отделен домейн (напр. 'https://beshamel.bg/api/v1').
  // Навсякъде другаде (GitHub Pages и т.н.) — продукционното API.
  var DEMO_API = 'https://api.beshamel.work/api/v1';

  var apiBase = isLocal
    ? 'http://127.0.0.1:8200/api/v1'
    : host.endsWith('beshamel.work')
    ? 'https://api.beshamel.work/api/v1'
    : DEMO_API;

  window.ORDERS_CONFIG = {
    apiBase: apiBase
  };
})();
