/* app.js — Бешамел · Поръчки
   Чист vanilla JS, без зависимости. Раздели:
     1) i18n           — речник + t()
     2) STATE          — състояние + localStorage
     3) api()          — обвивка на fetch над apiBase
     4) cart helpers   — добавяне/промяна/сбор
     5) render функции — по един екран
     6) рутер + init   — hash навигация
*/
(function () {
  'use strict';

  var API = (window.ORDERS_CONFIG && window.ORDERS_CONFIG.apiBase) || '/api/v1';

  /* ============================================================
     1) I18N — UI надписи (съдържанието идва триезично от API)
     ============================================================ */
  var I18N = {
    bg: {
      chooseLoc: 'Откъде ще вземеш?',
      chooseLocSub: 'Избери обект, от който да вземеш поръчката си.',
      changeLoc: 'смени обект',
      goOrder: 'Поръчай',
      menuTitle: 'Меню за днес',
      menuNotPublished: 'Дневното меню още не е публикувано — ето постоянните ястия.',
      add: 'Добави',
      added: 'Добавено в количката',
      outToday: 'Изчерпано днес',
      sizeNormal: 'Нормална',
      sizeLarge: 'Голяма',
      cal: 'ккал',
      viewCart: 'Количка',
      continue: 'Продължи',
      cartTitle: 'Количка',
      cartEmpty: 'Количката е празна.',
      cartEmptyCta: 'Разгледай менюто',
      remove: 'Премахни',
      total: 'Общо',
      toCheckout: 'Към данните',
      backToMenu: 'Назад към менюто',
      backToCart: 'Назад към количката',
      checkoutTitle: 'Данни за поръчката',
      name: 'Име',
      phone: 'Телефон',
      email: 'Имейл (по желание)',
      pickup: 'Час за взимане',
      pickupASAP: 'Възможно най-скоро',
      note: 'Бележка (по желание)',
      required: 'задължително',
      placeOrder: 'Изпрати поръчката',
      sending: 'Изпращане…',
      errName: 'Моля, въведи име.',
      errPhone: 'Моля, въведи валиден телефон.',
      orderSummary: 'Обобщение',
      pickupFrom: 'Взимане от',
      doneTitle: 'Готово!',
      doneStatus: 'Приета',
      doneMsg: 'Ще я приготвим — очаквай обаждане или я вземи от',
      newOrder: 'Нова поръчка',
      loading: 'Зареждане…',
      errLoad: 'Нещо се обърка при зареждането.',
      retry: 'Опитай пак',
      errNetwork: 'Няма връзка със сървъра. Провери интернета и опитай пак.',
      errOrder: 'Поръчката не мина. Провери данните по-долу.',
      dishGone: 'Това ястие вече не е налично и е премахнато от количката.',
      changeLocConfirm: 'Смяна на обект',
      changeLocMsg: 'Имаш артикули в количката. Да я изчистя ли при смяна на обекта?',
      keepCart: 'Запази количката',
      clearCart: 'Изчисти',
      emptyMenu: 'В момента няма налични ястия.',
      viewMore: 'Виж още',
      allergens: 'Алергени',
      noAllergens: 'Без обявени алергени',
      addonsTitle: 'Добавки по избор',
      close: 'Затвори',
      without: 'без',
      account: 'Акаунт',
      loginTitle: 'Вход',
      loginIntro: 'Влез, за да пазиш поръчките си и да получаваш оферти.',
      continueWith: 'Продължи с',
      authFailed: 'Входът не сполучи.',
      authNotReady: 'Входът с {p} още не е активиран.',
      helloUser: 'Здравей, {n}!',
      loginOk: 'Влезе успешно.',
      profileTitle: 'Профил',
      profileSave: 'Запази промените',
      profileSaved: 'Записано.',
      profileSaveErr: 'Промените не се записаха. Опитай пак.',
      marketing: 'Искам да получавам оферти и промоции',
      myOrders: 'Моите поръчки',
      noOrders: 'Още нямаш поръчки.',
      logout: 'Изход',
      loggedOut: 'Излезе от акаунта.',
      loginHintQ: 'Имаш акаунт?',
      loginHintA: 'Влез за по-бързо',
      stNew: 'Нова', stAccepted: 'Приета', stReady: 'Готова',
      stCompleted: 'Завършена', stCancelled: 'Отказана',
      paidBadge: 'Платена ✓',
      payHow: 'Плащане',
      payOnSite: 'Плати на място',
      payNow: 'Плати сега',
      payNowSub: 'карта · Google Pay · Apple Pay',
      payTitle: 'Плащане',
      payConfirm: 'Плати',
      payProcessing: 'Обработване…',
      payFailed: 'Плащането не мина.',
      payOnSiteInstead: 'Ще платя на място',
      payPrepErr: 'Плащането не може да стартира. Поръчката е приета — можеш да платиш на място.',
      modeCity: 'София',
      modeTitle: 'Как ще поръчаш?',
      modeSub: 'Избери начина — менюто те чака.',
      modePickup: 'Ще взема от обекта',
      modePickupSub: 'Поръчваш сега, вземаш от касата — без чакане на опашка.',
      modeDelivery: 'Доставка до адрес',
      modeDeliverySub: 'Очаквайте скоро.',
      modeSoon: 'Скоро',
      modeSoonToast: 'Доставката тръгва скоро! Дотогава — вземи от обекта или ToGo от eBag.',
      modeTogo: 'ToGo за вкъщи',
      modeTogoSub: 'Готвени ястия за хладилника — от обектите или онлайн през eBag.',
      togoEbag: 'Купи онлайн от eBag',
      togoView: 'Виж ToGo продуктите',
      startHome: 'начало',
      trayLabel: 'Подреди си таблата',
      traySalad: 'Салата',
      traySoup: 'Супа',
      trayMain: 'Основно',
      trayDessert: 'Десерт',
      trayFull: 'Пълна табла!'
    },
    en: {
      chooseLoc: 'Where will you pick up?',
      chooseLocSub: 'Choose a location to collect your order from.',
      changeLoc: 'change location',
      goOrder: 'Order',
      menuTitle: "Today's menu",
      menuNotPublished: "Today's menu isn't published yet — here are the regular dishes.",
      add: 'Add',
      added: 'Added to cart',
      outToday: 'Out today',
      sizeNormal: 'Regular',
      sizeLarge: 'Large',
      cal: 'kcal',
      viewCart: 'Cart',
      continue: 'Continue',
      cartTitle: 'Cart',
      cartEmpty: 'Your cart is empty.',
      cartEmptyCta: 'Browse the menu',
      remove: 'Remove',
      total: 'Total',
      toCheckout: 'To details',
      backToMenu: 'Back to menu',
      backToCart: 'Back to cart',
      checkoutTitle: 'Order details',
      name: 'Name',
      phone: 'Phone',
      email: 'Email (optional)',
      pickup: 'Pickup time',
      pickupASAP: 'As soon as possible',
      note: 'Note (optional)',
      required: 'required',
      placeOrder: 'Place order',
      sending: 'Sending…',
      errName: 'Please enter your name.',
      errPhone: 'Please enter a valid phone.',
      orderSummary: 'Summary',
      pickupFrom: 'Pick up from',
      doneTitle: 'Done!',
      doneStatus: 'Accepted',
      doneMsg: "We'll prepare it — expect a call or pick it up from",
      newOrder: 'New order',
      loading: 'Loading…',
      errLoad: 'Something went wrong while loading.',
      retry: 'Try again',
      errNetwork: 'No connection to the server. Check your internet and retry.',
      errOrder: 'The order failed. Check the details below.',
      dishGone: 'This dish is no longer available and was removed from your cart.',
      changeLocConfirm: 'Change location',
      changeLocMsg: 'You have items in your cart. Clear it when changing location?',
      keepCart: 'Keep cart',
      clearCart: 'Clear',
      emptyMenu: 'No dishes are available right now.',
      viewMore: 'View more',
      allergens: 'Allergens',
      noAllergens: 'No declared allergens',
      addonsTitle: 'Optional add-ons',
      close: 'Close',
      without: 'without',
      account: 'Account',
      loginTitle: 'Sign in',
      loginIntro: 'Sign in to keep your orders and receive offers.',
      continueWith: 'Continue with',
      authFailed: 'Sign-in failed.',
      authNotReady: 'Sign-in with {p} is not enabled yet.',
      helloUser: 'Hi, {n}!',
      loginOk: 'Signed in.',
      profileTitle: 'Profile',
      profileSave: 'Save changes',
      profileSaved: 'Saved.',
      profileSaveErr: 'Changes were not saved. Try again.',
      marketing: 'I want to receive offers and promotions',
      myOrders: 'My orders',
      noOrders: 'No orders yet.',
      logout: 'Sign out',
      loggedOut: 'Signed out.',
      loginHintQ: 'Have an account?',
      loginHintA: 'Sign in for faster checkout',
      stNew: 'New', stAccepted: 'Accepted', stReady: 'Ready',
      stCompleted: 'Completed', stCancelled: 'Cancelled',
      paidBadge: 'Paid ✓',
      payHow: 'Payment',
      payOnSite: 'Pay at pickup',
      payNow: 'Pay now',
      payNowSub: 'card · Google Pay · Apple Pay',
      payTitle: 'Payment',
      payConfirm: 'Pay',
      payProcessing: 'Processing…',
      payFailed: 'The payment did not go through.',
      payOnSiteInstead: "I'll pay at pickup",
      payPrepErr: 'Payment could not start. Your order is placed — you can pay at pickup.',
      modeCity: 'Sofia',
      modeTitle: 'How will you order?',
      modeSub: 'Pick your way — the menu is waiting.',
      modePickup: 'Pick up from a location',
      modePickupSub: 'Order now, collect at the counter — no waiting in line.',
      modeDelivery: 'Delivery to your address',
      modeDeliverySub: 'Coming soon.',
      modeSoon: 'Soon',
      modeSoonToast: 'Delivery is coming soon! Until then — pick up from a location or get ToGo via eBag.',
      modeTogo: 'ToGo for home',
      modeTogoSub: 'Ready-cooked dishes for your fridge — at our locations or online via eBag.',
      togoEbag: 'Buy online at eBag',
      togoView: 'See the ToGo products',
      startHome: 'Start',
      trayLabel: 'Build your tray',
      traySalad: 'Salad',
      traySoup: 'Soup',
      trayMain: 'Main',
      trayDessert: 'Dessert',
      trayFull: 'Full tray!'
    },
    ru: {
      chooseLoc: 'Где заберёте заказ?',
      chooseLocSub: 'Выберите заведение, где заберёте заказ.',
      changeLoc: 'сменить',
      goOrder: 'Заказать',
      menuTitle: 'Меню на сегодня',
      menuNotPublished: 'Меню на сегодня ещё не опубликовано — вот постоянные блюда.',
      add: 'Добавить',
      added: 'Добавлено в корзину',
      outToday: 'Нет сегодня',
      sizeNormal: 'Обычная',
      sizeLarge: 'Большая',
      cal: 'ккал',
      viewCart: 'Корзина',
      continue: 'Продолжить',
      cartTitle: 'Корзина',
      cartEmpty: 'Корзина пуста.',
      cartEmptyCta: 'Посмотреть меню',
      remove: 'Удалить',
      total: 'Итого',
      toCheckout: 'К данным',
      backToMenu: 'Назад в меню',
      backToCart: 'Назад в корзину',
      checkoutTitle: 'Данные заказа',
      name: 'Имя',
      phone: 'Телефон',
      email: 'Эл. почта (необязательно)',
      pickup: 'Время получения',
      pickupASAP: 'Как можно скорее',
      note: 'Примечание (необязательно)',
      required: 'обязательно',
      placeOrder: 'Оформить заказ',
      sending: 'Отправка…',
      errName: 'Пожалуйста, введите имя.',
      errPhone: 'Пожалуйста, введите корректный телефон.',
      orderSummary: 'Сводка',
      pickupFrom: 'Получение в',
      doneTitle: 'Готово!',
      doneStatus: 'Принят',
      doneMsg: 'Мы приготовим — ждите звонка или заберите в',
      newOrder: 'Новый заказ',
      loading: 'Загрузка…',
      errLoad: 'Что-то пошло не так при загрузке.',
      retry: 'Повторить',
      errNetwork: 'Нет связи с сервером. Проверьте интернет и повторите.',
      errOrder: 'Заказ не прошёл. Проверьте данные ниже.',
      dishGone: 'Это блюдо больше недоступно и удалено из корзины.',
      changeLocConfirm: 'Смена заведения',
      changeLocMsg: 'В корзине есть товары. Очистить её при смене заведения?',
      keepCart: 'Оставить',
      clearCart: 'Очистить',
      emptyMenu: 'Сейчас нет доступных блюд.',
      viewMore: 'Подробнее',
      allergens: 'Аллергены',
      noAllergens: 'Аллергены не заявлены',
      addonsTitle: 'Добавки по выбору',
      close: 'Закрыть',
      without: 'без',
      account: 'Аккаунт',
      loginTitle: 'Вход',
      loginIntro: 'Войдите, чтобы сохранять заказы и получать предложения.',
      continueWith: 'Продолжить с',
      authFailed: 'Вход не удался.',
      authNotReady: 'Вход через {p} ещё не активирован.',
      helloUser: 'Здравствуйте, {n}!',
      loginOk: 'Вы вошли.',
      profileTitle: 'Профиль',
      profileSave: 'Сохранить изменения',
      profileSaved: 'Сохранено.',
      profileSaveErr: 'Изменения не сохранились. Попробуйте ещё раз.',
      marketing: 'Хочу получать предложения и акции',
      myOrders: 'Мои заказы',
      noOrders: 'Заказов пока нет.',
      logout: 'Выйти',
      loggedOut: 'Вы вышли из аккаунта.',
      loginHintQ: 'Есть аккаунт?',
      loginHintA: 'Войдите — будет быстрее',
      stNew: 'Новый', stAccepted: 'Принят', stReady: 'Готов',
      stCompleted: 'Завершён', stCancelled: 'Отменён',
      paidBadge: 'Оплачен ✓',
      payHow: 'Оплата',
      payOnSite: 'Оплата на месте',
      payNow: 'Оплатить сейчас',
      payNowSub: 'карта · Google Pay · Apple Pay',
      payTitle: 'Оплата',
      payConfirm: 'Оплатить',
      payProcessing: 'Обработка…',
      payFailed: 'Платёж не прошёл.',
      payOnSiteInstead: 'Оплачу на месте',
      payPrepErr: 'Платёж не запустился. Заказ принят — можно оплатить на месте.',
      modeCity: 'София',
      modeTitle: 'Как будешь заказывать?',
      modeSub: 'Выбери способ — меню уже ждёт.',
      modePickup: 'Заберу из заведения',
      modePickupSub: 'Заказываешь сейчас, забираешь на кассе — без очереди.',
      modeDelivery: 'Доставка на адрес',
      modeDeliverySub: 'Совсем скоро.',
      modeSoon: 'Скоро',
      modeSoonToast: 'Доставка скоро запустится! А пока — забери из заведения или ToGo через eBag.',
      modeTogo: 'ToGo домой',
      modeTogoSub: 'Готовые блюда для холодильника — в заведениях или онлайн через eBag.',
      togoEbag: 'Купить онлайн на eBag',
      togoView: 'Смотреть продукты ToGo',
      startHome: 'Начало',
      trayLabel: 'Собери поднос',
      traySalad: 'Салат',
      traySoup: 'Суп',
      trayMain: 'Основное',
      trayDessert: 'Десерт',
      trayFull: 'Полный поднос!'
    }
  };

  var LANGS = ['bg', 'en', 'ru'];

  // UI надпис по ключ на текущия език
  function ui(key) {
    var lang = state.lang;
    return (I18N[lang] && I18N[lang][key]) || I18N.bg[key] || key;
  }
  // t() за триезични обекти от API: връща стойността на езика или bg fallback
  function t(langObj) {
    if (!langObj || typeof langObj !== 'object') return langObj || '';
    return langObj[state.lang] || langObj.bg || langObj.en || '';
  }

  /* ============================================================
     2) STATE + localStorage
     ============================================================ */
  var LS = {
    lang: 'besh-ord-lang',
    loc: 'besh-ord-loc',
    cart: 'besh-ord-cart',
    token: 'besh-ord-token',
    mode: 'besh-ord-mode'
  };

  var state = {
    lang: localStorage.getItem(LS.lang) || 'bg',
    locationId: parseInt(localStorage.getItem(LS.loc), 10) || null,
    locationName: '',          // име (bg) на избрания обект за хедъра
    locations: null,           // кеш от /locations
    categories: null,          // кеш от /categories
    cart: loadCart(),          // масив { dish_id, name_bg, size, unit_eur, unit_bgn, qty }
    // избор на размер по dish_id в екрана меню (преди добавяне)
    sizeChoice: {},
    lastOrder: null,           // данните от последната успешна поръчка (за екран „Готово")
    token: localStorage.getItem(LS.token) || null, // Sanctum Bearer токен (OAuth вход)
    me: null,                  // профилът от GET /me (когато има валиден токен)
    payments: { enabled: false, publishable_key: null } // от GET /payments/config
  };

  function loadCart() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS.cart));
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function saveCart() { localStorage.setItem(LS.cart, JSON.stringify(state.cart)); }

  /* ============================================================
     3) api() — обвивка над fetch
     ============================================================ */
  function api(path, opts) {
    opts = opts || {};
    var headers = opts.body
      ? { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      : { 'Accept': 'application/json' };
    // Ако клиентът е логнат — пращаме Bearer токена (гост работи и без него)
    if (state.token) headers['Authorization'] = 'Bearer ' + state.token;
    return fetch(API + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) {
        return { ok: res.ok, status: res.status, json: json };
      });
    });
  }

  /* ============================================================
     4) CART helpers — локален сбор (цените се преизчисляват от сървъра)
     ============================================================ */
  function fmtEur(n) { return n.toFixed(2).replace('.', ',') + ' €'; }
  function fmtBgn(n) { return n.toFixed(2).replace('.', ',') + ' лв'; }
  function fmtDual(eur, bgn) { return fmtEur(eur) + ' · ' + fmtBgn(bgn); }

  function cartCount() {
    return state.cart.reduce(function (s, it) { return s + it.qty; }, 0);
  }
  function cartTotals() {
    return state.cart.reduce(function (acc, it) {
      acc.eur += it.unit_eur * it.qty;
      acc.bgn += it.unit_bgn * it.qty;
      return acc;
    }, { eur: 0, bgn: 0 });
  }

  // Подпис на избраните опции — за да разграничим редове с различни добавки
  function optionsSig(options) {
    if (!options || !options.length) return '';
    return options.map(function (o) { return o.key + ':' + (o.on ? '1' : '0'); }).sort().join(',');
  }

  // Уникален ключ на артикул = dish_id + size + подпис на опциите
  function findCartItem(dishId, size, sig) {
    for (var i = 0; i < state.cart.length; i++) {
      var it = state.cart[i];
      if (it.dish_id === dishId && it.size === size && optionsSig(it.options) === sig) return i;
    }
    return -1;
  }

  // Нормализира избора на добавки за ястие → пълен масив [{key,on,label_bg,price_eur}]
  // за ВСИЧКИ addons (и включени, и изключени). selected = { key: bool } (по избор).
  function resolveOptions(dish, selected) {
    var addons = dish.addons || [];
    return addons.map(function (a) {
      var on = selected && Object.prototype.hasOwnProperty.call(selected, a.key)
        ? !!selected[a.key]
        : !!a.default_on;
      return {
        key: a.key,
        on: on,
        label_bg: (a.label && a.label.bg) || a.key,
        label: a.label || null, // пълен обект за триезично показване в количката
        price_eur: a.price_eur || 0
      };
    });
  }

  // dish + size + избрани опции → добавя в количката
  function addToCart(dish, size, selected) {
    var isLarge = size === 'large';
    var baseEur = isLarge ? dish.price.eur_large : dish.price.eur;
    var baseBgn = isLarge ? dish.price.bgn_large : dish.price.bgn;

    var options = resolveOptions(dish, selected);
    // локален сбор: базова цена + цените на включените добавки (тук са 0, но смятаме коректно)
    var addEur = options.reduce(function (s, o) { return s + (o.on ? o.price_eur : 0); }, 0);
    var unitEur = Math.round((baseEur + addEur) * 100) / 100;
    // за лв ползваме курса €→лв (1.95583); добавките тук са 0 така или иначе
    var unitBgn = Math.round((baseBgn + addEur * 1.95583) * 100) / 100;

    var sig = optionsSig(options);
    var idx = findCartItem(dish.id, size, sig);
    if (idx >= 0) {
      state.cart[idx].qty = Math.min(20, state.cart[idx].qty + 1);
    } else {
      state.cart.push({
        dish_id: dish.id,
        name_bg: dish.name.bg,
        name: dish.name, // пазим целия обект за триезично показване
        category_slug: dish.category_slug || null, // за tray индикатора „Подреди си таблата"
        size: size,
        unit_eur: unitEur,
        unit_bgn: unitBgn,
        options: options, // [{key,on,label_bg,price_eur}]
        qty: 1
      });
    }
    saveCart();
    updateCartBar();
  }

  // Текстов резюме на опциите за реда в количката:
  //   изключени default → „без Х"; включени НЕ-default (или платени) → „+ Х"
  function optionsSummary(options) {
    if (!options || !options.length) return '';
    var parts = [];
    options.forEach(function (o) {
      var lbl = (o.label ? t(o.label) : o.label_bg) || o.key;
      if (!o.on) {
        parts.push(ui('without') + ' ' + lbl.toLowerCase());
      } else if (o.price_eur > 0) {
        // платена добавка → показваме „+ Х" (тук цените са 0, но схемата го поддържа)
        parts.push('+ ' + lbl);
      }
    });
    return parts.join(', ');
  }

  function setQty(idx, delta) {
    var it = state.cart[idx];
    if (!it) return;
    it.qty += delta;
    if (it.qty < 1) { state.cart.splice(idx, 1); }
    else if (it.qty > 20) { it.qty = 20; }
    saveCart();
    updateCartBar();
  }
  function removeItem(idx) {
    state.cart.splice(idx, 1);
    saveCart();
    updateCartBar();
  }
  function clearCart() { state.cart = []; saveCart(); updateCartBar(); }

  /* ============================================================
     Помощни: DOM изграждане
     ============================================================ */
  var view = document.getElementById('view');

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ------------------------------------------------------------
     Начертани inline SVG иконки (тънък stroke, currentColor).
     Различни от Apple emoji — собствен стил.
     ------------------------------------------------------------ */
  // калории: стилизирано огънче/пламъче (капковиден пламък с вътрешна дъга)
  var SVG_CAL =
    '<svg class="ic ic--cal" viewBox="0 0 24 24" width="15" height="15" ' +
    'fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M12 3c.6 2.4-.9 3.6-2 4.9C8.6 9.6 7.5 11 7.5 13.2A4.5 4.5 0 0 0 16.5 13.2c0-2-1-3.3-1.8-4.6-.5.7-1 .9-1.6 1 .7-2.1.3-4.4-1.1-6.6Z"/>' +
    '<path d="M12 19.5c1.4 0 2.4-1 2.4-2.3 0-1.2-.8-1.9-1.3-2.6-.3.4-.6.5-1 .6.3-1 .1-2-.6-2.9-.2 1-.6 1.4-1 1.9-.5.6-1 1.2-1 2.1 0 1.3 1.1 2.2 2.5 2.2Z"/>' +
    '</svg>';
  // грамаж: везна/тежест (дискретна)
  var SVG_WEIGHT =
    '<svg class="ic ic--w" viewBox="0 0 24 24" width="15" height="15" ' +
    'fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M7 8h10l2.5 11h-15L7 8Z"/><path d="M9.5 8a2.5 2.5 0 1 1 5 0"/>' +
    '</svg>';
  // алергени: щит с възклицателна вътре (внимание)
  var SVG_ALLERGEN =
    '<svg class="ic ic--al" viewBox="0 0 24 24" width="15" height="15" ' +
    'fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M12 3 5 6v5.5c0 4 2.9 7.4 7 8.5 4.1-1.1 7-4.5 7-8.5V6l-7-3Z"/>' +
    '<path d="M12 9v3.5"/><path d="M12 15.6h.01"/>' +
    '</svg>';

  // Има ли обявени алергени? ("няма"/null → не)
  function hasAllergens(str) {
    if (str == null) return false;
    var s = String(str).trim().toLowerCase();
    return s !== '' && s !== 'няма' && s !== 'нет' && s !== 'none';
  }
  // Ред „Алергени: …" или „Без обявени алергени"
  function allergenNode() {
    var d = arguments[0];
    var row = el('div', 'allergens');
    if (hasAllergens(d.allergens)) {
      row.classList.add('allergens--has');
      row.innerHTML = SVG_ALLERGEN +
        '<span><strong>' + esc(ui('allergens')) + ':</strong> ' + esc(d.allergens) + '</span>';
    } else {
      row.classList.add('allergens--none');
      row.innerHTML = SVG_ALLERGEN + '<span>' + esc(ui('noAllergens')) + '</span>';
    }
    return row;
  }

  // t() върху label обект на добавка
  function addonLabel(addon) {
    return t(addon.label) || (addon.label && addon.label.bg) || addon.key;
  }

  // Общи състояния
  function renderLoading(msg) {
    view.innerHTML = '<div class="state"><div class="spinner" role="status" aria-live="polite"></div><div class="state__msg">' + esc(msg || ui('loading')) + '</div></div>';
  }
  function renderSkeletons() {
    var html = '<div class="sk-grid">';
    for (var i = 0; i < 4; i++) {
      html += '<div class="sk"><div class="sk__media"></div><div class="sk__line"></div><div class="sk__line short"></div></div>';
    }
    html += '</div>';
    view.innerHTML = html;
  }
  function renderError(msg, onRetry) {
    view.innerHTML = '';
    var box = el('div', 'state');
    box.appendChild(el('div', 'state__icon', '⚠️'));
    box.appendChild(el('div', 'state__msg', esc(msg || ui('errLoad'))));
    if (onRetry) {
      var btn = el('button', 'btn btn--solid', esc(ui('retry')));
      btn.type = 'button';
      btn.addEventListener('click', onRetry);
      box.appendChild(btn);
    }
    view.appendChild(box);
  }

  function toast(msg) {
    var t0 = document.getElementById('toast');
    if (t0) t0.remove();
    var t1 = el('div', 'toast', esc(msg));
    t1.id = 'toast';
    document.body.appendChild(t1);
    requestAnimationFrame(function () { t1.classList.add('is-show'); });
    setTimeout(function () {
      t1.classList.remove('is-show');
      setTimeout(function () { t1.remove(); }, 300);
    }, 1800);
  }

  // Модал за потвърждение → връща promise-подобно чрез callback
  function confirmModal(title, msg, okLabel, cancelLabel, onOk, onCancel) {
    var backdrop = el('div', 'modal-backdrop');
    var m = el('div', 'modal');
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.appendChild(el('div', 'modal__title', esc(title)));
    m.appendChild(el('div', 'modal__msg', esc(msg)));
    var row = el('div', 'modal__row');
    var cancel = el('button', 'btn btn--ghost', esc(cancelLabel));
    var ok = el('button', 'btn btn--solid', esc(okLabel));
    cancel.type = 'button'; ok.type = 'button';
    function close() { backdrop.remove(); }
    cancel.addEventListener('click', function () { close(); if (onCancel) onCancel(); });
    ok.addEventListener('click', function () { close(); if (onOk) onOk(); });
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) { close(); if (onCancel) onCancel(); } });
    row.appendChild(cancel); row.appendChild(ok);
    m.appendChild(row);
    backdrop.appendChild(m);
    document.body.appendChild(backdrop);
    ok.focus();
  }

  /* ------------------------------------------------------------
     ДЕТАЙЛЕН ИЗГЛЕД на ястие (модал) — голяма снимка, пълно
     описание, грамаж/калории, алергени, цена, добавки по избор.
     ------------------------------------------------------------ */
  function openDishDetail(d, initialSize) {
    var isOut = (state._unavailable || []).indexOf(d.id) >= 0;
    var hasLarge = d.price.eur_large != null;
    var size = (hasLarge ? (initialSize || state.sizeChoice[d.id] || 'normal') : 'normal');
    // локален избор на добавки за детайла (стартово = default_on)
    var selected = {};
    (d.addons || []).forEach(function (a) { selected[a.key] = !!a.default_on; });

    var backdrop = el('div', 'modal-backdrop');
    var m = el('div', 'sheet');
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-label', t(d.name));

    // затваряне (× + Escape + клик на backdrop)
    var closeBtn = el('button', 'sheet__close', '&times;');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', ui('close'));
    function onKey(e) { if (e.key === 'Escape') close(); }
    function close() {
      backdrop.remove();
      document.removeEventListener('keydown', onKey);
    }
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', onKey);
    m.appendChild(closeBtn);

    // голяма снимка
    var media = el('div', 'sheet__media');
    if (d.image_url) {
      var img = el('img');
      img.src = d.image_url; img.alt = t(d.name);
      img.addEventListener('error', function () {
        media.innerHTML = ''; media.appendChild(el('div', 'dish__ph', 'Бешамел'));
      });
      media.appendChild(img);
    } else {
      media.appendChild(el('div', 'dish__ph', 'Бешамел'));
    }
    m.appendChild(media);

    var body = el('div', 'sheet__body');
    body.appendChild(el('h2', 'sheet__name', esc(t(d.name))));

    // мета
    var meta = el('div', 'dish__meta sheet__meta');
    var wn = t(d.weight_note);
    if (wn) meta.appendChild(el('span', null, SVG_WEIGHT + esc(wn)));
    else if (d.weight_grams) meta.appendChild(el('span', null, SVG_WEIGHT + esc(d.weight_grams) + ' г'));
    if (d.calories) meta.appendChild(el('span', null, SVG_CAL + esc(d.calories) + ' ' + esc(ui('cal'))));
    if (meta.children.length) body.appendChild(meta);

    // пълно описание (без line-clamp)
    var desc = t(d.description);
    if (desc) body.appendChild(el('p', 'sheet__desc', esc(desc)));

    // алергени
    body.appendChild(allergenNode(d));

    // размер (ако има голяма порция)
    if (hasLarge && !isOut) {
      var seg = el('div', 'size-seg sheet__seg');
      seg.setAttribute('role', 'group');
      seg.setAttribute('aria-label', 'размер');
      [['normal', ui('sizeNormal')], ['large', ui('sizeLarge')]].forEach(function (pair) {
        var b = el('button', size === pair[0] ? 'is-active' : '', esc(pair[1]));
        b.type = 'button';
        b.addEventListener('click', function () {
          size = pair[0];
          Array.prototype.forEach.call(seg.children, function (c) { c.classList.remove('is-active'); });
          b.classList.add('is-active');
          updateSheetPrice();
        });
        seg.appendChild(b);
      });
      body.appendChild(seg);
    }

    // добавки по избор
    if (d.addons && d.addons.length) {
      var addSec = el('div', 'addons');
      addSec.appendChild(el('div', 'addons__title', esc(ui('addonsTitle'))));
      d.addons.forEach(function (a) {
        var id = 'addon_' + d.id + '_' + a.key;
        var rowL = el('label', 'addon'); rowL.setAttribute('for', id);
        var cb = el('input'); cb.type = 'checkbox'; cb.id = id;
        cb.checked = !!selected[a.key];
        cb.addEventListener('change', function () {
          selected[a.key] = cb.checked;
          updateSheetPrice();
        });
        var txt = el('span', 'addon__label', esc(addonLabel(a)));
        rowL.appendChild(cb);
        rowL.appendChild(txt);
        if (a.price_eur > 0) {
          rowL.appendChild(el('span', 'addon__price', '+' + esc(fmtEur(a.price_eur))));
        }
        addSec.appendChild(rowL);
      });
      body.appendChild(addSec);
    }

    // цена (реагира на размер + платени добавки)
    var priceEl = el('div', 'sheet__price');
    function updateSheetPrice() {
      var base = (size === 'large' && hasLarge) ? d.price.eur_large : d.price.eur;
      var baseBgn = (size === 'large' && hasLarge) ? d.price.bgn_large : d.price.bgn;
      var addEur = (d.addons || []).reduce(function (s, a) {
        return s + (selected[a.key] ? (a.price_eur || 0) : 0);
      }, 0);
      var eur = Math.round((base + addEur) * 100) / 100;
      var bgn = Math.round((baseBgn + addEur * 1.95583) * 100) / 100;
      priceEl.innerHTML = esc(fmtEur(eur)) + ' <span class="bgn">· ' + esc(fmtBgn(bgn)) + '</span>';
    }
    updateSheetPrice();
    body.appendChild(priceEl);

    // бутон „Добави в количката" от детайла
    if (!isOut) {
      var addBtn = el('button', 'btn btn--solid btn--block btn--lg sheet__add', esc(ui('add')));
      addBtn.type = 'button';
      addBtn.addEventListener('click', function () {
        // rect-ът на снимката се взима СЕГА (преди close да я махне)
        flyToCart(media, function () { addToCart(d, size, selected); });
        close();
        toast(ui('added'));
      });
      body.appendChild(addBtn);
    }

    m.appendChild(body);
    backdrop.appendChild(m);
    document.body.appendChild(backdrop);
    closeBtn.focus();
  }

  /* ============================================================
     АКАУНТ: OAuth вход, профил, изход
     ============================================================ */
  var PROVIDERS = ['google', 'microsoft', 'apple'];
  var PROVIDER_LABELS = { google: 'Google', microsoft: 'Microsoft', apple: 'Apple' };

  // иконка „човече" за хедъра (същият тънък stroke стил като останалите)
  var SVG_USER =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.2 3.6-5 7-5s6.2 1.8 7 5"/></svg>';

  // разпознаваеми монохромни лога на провайдърите
  var PROVIDER_SVG = {
    google:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">' +
      '<path d="M21.35 11.1H12v2.9h5.35c-.5 2.5-2.6 4.3-5.35 4.3a5.8 5.8 0 1 1 0-11.6c1.5 0 2.8.55 3.8 1.45l2.15-2.15A8.66 8.66 0 0 0 12 3.3a8.7 8.7 0 1 0 0 17.4c5 0 8.7-3.5 8.7-8.7 0-.3-.02-.6-.05-.9Z"/></svg>',
    microsoft:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">' +
      '<path d="M3 3h8.5v8.5H3V3Zm9.5 0H21v8.5h-8.5V3ZM3 12.5h8.5V21H3v-8.5Zm9.5 0H21V21h-8.5v-8.5Z"/></svg>',
    apple:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">' +
      '<path d="M17.05 12.54c-.03-2.62 2.14-3.88 2.24-3.94-1.22-1.79-3.12-2.03-3.8-2.06-1.6-.17-3.14.95-3.96.95-.82 0-2.08-.93-3.42-.9-1.76.03-3.38 1.02-4.29 2.6-1.83 3.17-.47 7.87 1.32 10.44.87 1.26 1.9 2.68 3.27 2.63 1.31-.05 1.8-.85 3.39-.85s2.03.85 3.42.82c1.41-.02 2.3-1.28 3.16-2.55 1-1.46 1.4-2.87 1.43-2.94-.03-.02-2.74-1.05-2.76-4.2Z"/>' +
      '<path d="M14.44 4.67c.72-.88 1.21-2.1 1.08-3.32-1.04.04-2.3.7-3.05 1.57-.67.77-1.26 2.02-1.1 3.2 1.16.1 2.35-.58 3.07-1.45Z"/></svg>'
  };

  function setToken(tok) {
    state.token = tok || null;
    if (tok) localStorage.setItem(LS.token, tok);
    else localStorage.removeItem(LS.token);
  }
  function clearAuth() {
    setToken(null);
    state.me = null;
    updateAccountBtn();
  }

  // Зарежда профила; при 401 (изтекъл/изтрит токен) — тихо чисти токена
  function loadMe(showHello) {
    if (!state.token) return Promise.resolve(null);
    return api('/me').then(function (r) {
      if (r.ok && r.json && r.json.data) {
        state.me = r.json.data;
        updateAccountBtn();
        if (showHello) {
          toast(state.me.name
            ? ui('helloUser').replace('{n}', state.me.name)
            : ui('loginOk'));
        }
        return state.me;
      }
      if (r.status === 401) clearAuth();
      return null;
    }).catch(function () { return null; });
  }

  // При зареждане: чете #token=… / #auth_error=1 от OAuth редиректа.
  // Връща true, ако hash-ът е бил auth резултат (и е бил обработен).
  function consumeAuthHash() {
    var h = location.hash || '';
    var home = state.locationId ? '#menu' : '#location';
    var m = h.match(/^#token=(.+)$/);
    if (m) {
      var tok = m[1];
      try { tok = decodeURIComponent(tok); } catch (e) { /* оставяме суров */ }
      setToken(tok);
      history.replaceState(null, '', location.pathname + location.search + home);
      loadMe(true);
      return true;
    }
    if (/^#auth_error=/.test(h)) {
      history.replaceState(null, '', location.pathname + location.search + home);
      toast(ui('authFailed'));
      return true;
    }
    return false;
  }

  // Стартира OAuth: първо проверяваме дали провайдърът е конфигуриран
  // (в dev бекендът връща 503 JSON) — с redirect:'manual' 3xx става
  // opaqueredirect (status 0) → тогава смело пращаме браузъра натам.
  function startOAuth(provider) {
    var url = API + '/auth/' + provider + '/redirect?return=' +
      encodeURIComponent(location.origin + location.pathname);
    fetch(url, { redirect: 'manual', headers: { 'Accept': 'application/json' } })
      .then(function (res) {
        if (res.status === 503 || res.status === 404) {
          toast(ui('authNotReady').replace('{p}', PROVIDER_LABELS[provider]));
          return;
        }
        window.location.href = url; // opaqueredirect/3xx/2xx → реален redirect
      })
      .catch(function () {
        // мрежова/CORS засечка при проверката → пробваме директно
        window.location.href = url;
      });
  }

  // Хедър: иконка човече / аватар / инициал
  function updateAccountBtn() {
    var btn = document.getElementById('hdrAccBtn');
    if (!btn) return;
    if (state.me) {
      btn.classList.add('is-logged');
      btn.setAttribute('aria-label', state.me.name || ui('profileTitle'));
      var initial = String(state.me.name || state.me.email || '·').trim().charAt(0).toUpperCase();
      if (state.me.avatar) {
        btn.innerHTML = '';
        var img = el('img', 'hdr__acc-img');
        img.src = state.me.avatar; img.alt = '';
        img.referrerPolicy = 'no-referrer';
        img.addEventListener('error', function () {
          btn.innerHTML = '<span class="hdr__acc-init">' + esc(initial) + '</span>';
        });
        btn.appendChild(img);
      } else {
        btn.innerHTML = '<span class="hdr__acc-init">' + esc(initial) + '</span>';
      }
    } else {
      btn.classList.remove('is-logged');
      btn.setAttribute('aria-label', ui('account'));
      btn.innerHTML = SVG_USER;
    }
  }

  // Sheet „Вход" — 3 големи бутона Google / Microsoft / Apple
  function openLoginSheet() {
    var backdrop = el('div', 'modal-backdrop');
    var m = el('div', 'sheet auth-sheet');
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-label', ui('loginTitle'));

    var closeBtn = el('button', 'sheet__close', '&times;');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', ui('close'));
    function onKey(e) { if (e.key === 'Escape') close(); }
    function close() { backdrop.remove(); document.removeEventListener('keydown', onKey); }
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', onKey);
    m.appendChild(closeBtn);

    var body = el('div', 'sheet__body');
    body.appendChild(el('h2', 'sheet__name', esc(ui('loginTitle'))));
    body.appendChild(el('p', 'sheet__desc', esc(ui('loginIntro'))));

    var btns = el('div', 'auth-btns');
    PROVIDERS.forEach(function (p) {
      var b = el('button', 'auth-btn',
        PROVIDER_SVG[p] + '<span>' + esc(ui('continueWith')) + ' ' + esc(PROVIDER_LABELS[p]) + '</span>');
      b.type = 'button';
      b.addEventListener('click', function () { startOAuth(p); });
      btns.appendChild(b);
    });
    body.appendChild(btns);

    m.appendChild(body);
    backdrop.appendChild(m);
    document.body.appendChild(backdrop);
    closeBtn.focus();
  }

  // Статус на поръчка → надпис на текущия език
  function orderStatusLabel(s) {
    var key = 'st' + String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);
    var lbl = ui(key);
    return lbl === key ? String(s || '') : lbl;
  }

  // --- ЕКРАН: ПРОФИЛ (#profile) ---
  function screenProfile() {
    if (!state.token) {
      location.hash = state.locationId ? '#menu' : '#location';
      openLoginSheet();
      return;
    }
    renderLoading();
    (state.me ? Promise.resolve(state.me) : loadMe(false)).then(function (me) {
      if (!me) {
        // токенът е невалиден → чистим и към входа
        clearAuth();
        location.hash = state.locationId ? '#menu' : '#location';
        openLoginSheet();
        return;
      }
      renderProfile(me);
    });
  }

  function renderProfile(me) {
    view.innerHTML = '';
    view.appendChild(backLink(ui('backToMenu'), '#menu'));
    view.appendChild(el('h1', 'screen-title', esc(ui('profileTitle'))));

    var form = el('form', 'form profile-form');
    form.noValidate = true;

    // име
    form.appendChild(fieldText('pname', ui('name'), false, 'text', 'name'));
    // имейл — само за четене (идва от провайдъра)
    var ef = el('div', 'field');
    ef.appendChild(labelFor('pemail', ui('email').replace(/\s*\(.*\)$/, ''), false));
    var einp = el('input');
    einp.id = 'f_pemail'; einp.type = 'email'; einp.readOnly = true;
    einp.className = 'is-readonly';
    ef.appendChild(einp);
    form.appendChild(ef);
    // телефон
    form.appendChild(fieldText('pphone', ui('phone'), false, 'tel', 'tel'));

    // маркетинг съгласие (записва се веднага при промяна)
    var mkRow = el('label', 'addon profile-consent');
    var mkCb = el('input'); mkCb.type = 'checkbox';
    mkRow.appendChild(mkCb);
    mkRow.appendChild(el('span', 'addon__label', esc(ui('marketing'))));
    form.appendChild(mkRow);

    var srvMsg = el('div', 'profile-msg'); form.appendChild(srvMsg);

    var save = el('button', 'btn btn--solid btn--block', esc(ui('profileSave')));
    save.type = 'submit';
    form.appendChild(save);

    // стойности
    form.querySelector('#f_pname').value = me.name || '';
    // скриваме служебния резервен имейл (Apple hidden и т.н.)
    einp.value = /@social\.beshamel\.local$/.test(me.email || '') ? '' : (me.email || '');
    form.querySelector('#f_pphone').value = me.phone || '';
    mkCb.checked = !!me.marketing_consent;

    function patchMe(body, btn) {
      if (btn) btn.disabled = true;
      srvMsg.textContent = '';
      srvMsg.classList.remove('is-err');
      return api('/me', { method: 'PATCH', body: body }).then(function (r) {
        if (btn) btn.disabled = false;
        if (r.ok && r.json && r.json.data) {
          state.me = r.json.data;
          updateAccountBtn();
          srvMsg.textContent = ui('profileSaved');
          return true;
        }
        srvMsg.textContent = ui('profileSaveErr');
        srvMsg.classList.add('is-err');
        return false;
      }).catch(function () {
        if (btn) btn.disabled = false;
        srvMsg.textContent = ui('errNetwork');
        srvMsg.classList.add('is-err');
        return false;
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      patchMe({
        name: form.querySelector('#f_pname').value.trim() || me.name || 'Клиент',
        phone: form.querySelector('#f_pphone').value.trim() || null
      }, save);
    });
    mkCb.addEventListener('change', function () {
      patchMe({ marketing_consent: mkCb.checked }, null).then(function (ok) {
        if (!ok) mkCb.checked = !mkCb.checked; // върни при неуспех
      });
    });

    view.appendChild(form);

    // --- Моите поръчки ---
    view.appendChild(el('h2', 'section-title', esc(ui('myOrders'))));
    var ordBox = el('div', 'profile-orders');
    ordBox.innerHTML = '<div class="spinner" role="status"></div>';
    view.appendChild(ordBox);

    api('/me/orders').then(function (r) {
      ordBox.innerHTML = '';
      var list = (r.ok && r.json && Array.isArray(r.json.data)) ? r.json.data : null;
      if (!list) { ordBox.appendChild(el('div', 'state__msg', esc(ui('errLoad')))); return; }
      if (!list.length) { ordBox.appendChild(el('div', 'state__msg', esc(ui('noOrders')))); return; }
      list.forEach(function (o) {
        var row = el('div', 'ord-row');
        var top = el('div', 'ord-row__top');
        top.appendChild(el('span', 'ord-row__num', esc(o.number || '')));
        var st = el('span', 'ord-status', esc(orderStatusLabel(o.status)));
        top.appendChild(st);
        row.appendChild(top);
        var dt = o.created_at ? new Date(o.created_at) : null;
        var locale = state.lang === 'bg' ? 'bg-BG' : (state.lang === 'ru' ? 'ru-RU' : 'en-GB');
        var meta = el('div', 'ord-row__meta');
        if (dt && !isNaN(dt.getTime())) {
          meta.appendChild(el('span', null,
            esc(dt.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) +
              ', ' + dt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }))));
        }
        var tot = el('span', 'ord-row__total', esc(fmtEur(Number(o.total_eur) || 0)));
        if (o.payment_status === 'paid') {
          tot.innerHTML += ' <span class="paid-pill">' + esc(ui('paidBadge')) + '</span>';
        }
        meta.appendChild(tot);
        row.appendChild(meta);
        if (o.items && o.items.length) {
          var names = o.items.map(function (it) {
            return it.name_bg + (it.qty > 1 ? ' ×' + it.qty : '');
          }).join(', ');
          row.appendChild(el('div', 'ord-row__items', esc(names)));
        }
        ordBox.appendChild(row);
      });
    }).catch(function () {
      ordBox.innerHTML = '';
      ordBox.appendChild(el('div', 'state__msg', esc(ui('errNetwork'))));
    });

    // --- Изход ---
    var out = el('button', 'btn btn--ghost btn--block profile-logout', esc(ui('logout')));
    out.type = 'button';
    out.addEventListener('click', function () {
      out.disabled = true;
      api('/logout', { method: 'POST', body: {} }).catch(function () {}).then(function () {
        clearAuth();
        toast(ui('loggedOut'));
        location.hash = state.locationId ? '#menu' : '#location';
      });
    });
    view.appendChild(out);

    updateCartBar();
  }

  /* ============================================================
     ПЛАЩАНЕ (Stripe) — зарежда се САМО когато enabled=true
     ============================================================ */
  function loadPaymentsConfig() {
    api('/payments/config').then(function (r) {
      if (r.ok && r.json && r.json.data) state.payments = r.json.data;
    }).catch(function () { /* остава disabled */ });
  }

  var stripeJsPromise = null;
  function loadStripeJs() {
    if (window.Stripe) return Promise.resolve();
    if (stripeJsPromise) return stripeJsPromise;
    stripeJsPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://js.stripe.com/v3';
      s.onload = function () { resolve(); };
      s.onerror = function () { stripeJsPromise = null; reject(new Error('stripe.js failed')); };
      document.head.appendChild(s);
    });
    return stripeJsPromise;
  }

  // Поръчката е СЪЗДАДЕНА; тук само събираме плащането.
  // Всеки неуспех/затваряне → екран „Готово" като неплатена (плащане на място).
  function startPayment(order) {
    var backdrop = el('div', 'modal-backdrop');
    var m = el('div', 'sheet pay-sheet');
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-label', ui('payTitle'));

    var closeBtn = el('button', 'sheet__close', '&times;');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', ui('close'));
    function onKey(e) { if (e.key === 'Escape') giveUp(); }
    function closeSheet() { backdrop.remove(); document.removeEventListener('keydown', onKey); }
    // отказ от плащане → поръчката остава неплатена → екран „Готово"
    function giveUp() { closeSheet(); renderDone(order); }
    closeBtn.addEventListener('click', giveUp);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) giveUp(); });
    document.addEventListener('keydown', onKey);
    m.appendChild(closeBtn);

    var body = el('div', 'sheet__body');
    body.appendChild(el('h2', 'sheet__name', esc(ui('payTitle'))));
    body.appendChild(el('div', 'sheet__price', esc(fmtDual(order.total_eur, order.total_bgn))));
    var slot = el('div', 'pay-slot');
    slot.innerHTML = '<div class="spinner" role="status"></div>';
    body.appendChild(slot);
    m.appendChild(body);
    backdrop.appendChild(m);
    document.body.appendChild(backdrop);

    function showFail(msg) {
      slot.innerHTML = '';
      slot.appendChild(el('div', 'pay-err', esc(msg)));
      var alt = el('button', 'btn btn--ghost btn--block', esc(ui('payOnSiteInstead')));
      alt.type = 'button';
      alt.addEventListener('click', giveUp);
      slot.appendChild(alt);
    }

    api('/orders/' + order.id + '/pay', { method: 'POST', body: {} }).then(function (r) {
      if (!(r.ok && r.json && r.json.data && r.json.data.client_secret)) {
        showFail(ui('payPrepErr'));
        return;
      }
      var cs = r.json.data.client_secret;
      var pk = r.json.data.publishable_key || state.payments.publishable_key;
      loadStripeJs().then(function () {
        var stripe = window.Stripe(pk);
        var elements = stripe.elements({
          clientSecret: cs,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#f9ae4e',
              colorText: '#2a2724',
              fontFamily: 'Inter, system-ui, sans-serif',
              borderRadius: '10px'
            }
          }
        });
        var pe = elements.create('payment');

        slot.innerHTML = '';
        var mount = el('div', 'pay-mount');
        slot.appendChild(mount);
        var errEl = el('div', 'pay-err'); slot.appendChild(errEl);
        var payBtn = el('button', 'btn btn--solid btn--block btn--lg', esc(ui('payConfirm')));
        payBtn.type = 'button';
        slot.appendChild(payBtn);
        var alt = el('button', 'pay-alt', esc(ui('payOnSiteInstead')));
        alt.type = 'button';
        alt.addEventListener('click', giveUp);
        slot.appendChild(alt);

        pe.mount(mount);

        payBtn.addEventListener('click', function () {
          payBtn.disabled = true;
          payBtn.textContent = ui('payProcessing');
          errEl.textContent = '';
          stripe.confirmPayment({
            elements: elements,
            confirmParams: { return_url: location.origin + location.pathname },
            redirect: 'if_required'
          }).then(function (res) {
            if (res.error) {
              // неуспех: поръчката остава неплатена; ясна грешка + опция „на място"
              payBtn.disabled = false;
              payBtn.textContent = ui('payConfirm');
              errEl.textContent = (res.error.message || '') + ' ' + ui('payFailed');
              return;
            }
            order._paid = true;
            closeSheet();
            renderDone(order);
          }).catch(function () {
            payBtn.disabled = false;
            payBtn.textContent = ui('payConfirm');
            errEl.textContent = ui('payFailed');
          });
        });
      }).catch(function () { showFail(ui('payPrepErr')); });
    }).catch(function () { showFail(ui('payPrepErr')); });
  }

  /* ============================================================
     5) RENDER функции по екран
     ============================================================ */

  // --- ЕКРАН 0: „КАК ЩЕ ПОРЪЧАШ?" (#mode) ---
  // Иконки в стила на останалите: тънък stroke, currentColor, 24 viewBox.
  var SVG_PIN =
    '<svg class="ic" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M12 21s-6.5-5.4-6.5-10A6.5 6.5 0 0 1 18.5 11c0 4.6-6.5 10-6.5 10Z"/>' +
    '<circle cx="12" cy="10.8" r="2.2"/></svg>';
  // витрина/storefront
  var SVG_STORE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M4 9.3 5.4 4h13.2L20 9.3"/>' +
    '<path d="M4 9.3a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/>' +
    '<path d="M5.2 12.4V20h13.6v-7.6"/>' +
    '<path d="M9.6 20v-4.6h4.8V20"/></svg>';
  // камионче за доставка
  var SVG_TRUCK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M2.5 6.5h12v10h-12z"/>' +
    '<path d="M14.5 10h3.4l3.1 3.2v3.3h-2.2"/>' +
    '<circle cx="7" cy="17.6" r="1.9"/><circle cx="16.7" cy="17.6" r="1.9"/>' +
    '<path d="M8.9 16.5h5.6"/></svg>';
  // торбичка ToGo
  var SVG_BAG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M6.2 7.5 4.5 20h15L17.8 7.5H6.2Z"/>' +
    '<path d="M9 10V6.8A3 3 0 0 1 12 4a3 3 0 0 1 3 2.8V10"/></svg>';

  function modeCard(svg, title, sub, badge, onClick, soon) {
    var card = el('button', 'mode-card' + (soon ? ' mode-card--soon' : ''));
    card.type = 'button';
    card.appendChild(el('span', 'mode-card__ic', svg));
    var txt = el('span', 'mode-card__txt');
    var tt = el('span', 'mode-card__title', esc(title) +
      (badge ? ' <span class="mode-badge">' + esc(badge) + '</span>' : ''));
    txt.appendChild(tt);
    txt.appendChild(el('span', 'mode-card__sub', esc(sub)));
    card.appendChild(txt);
    card.addEventListener('click', onClick);
    return card;
  }

  function screenMode() {
    view.innerHTML = '';
    var wrap = el('div', 'mode');

    // статичен чип „София" — всичките 6 обекта са в София
    wrap.appendChild(el('div', 'mode-city', SVG_PIN + '<span>' + esc(ui('modeCity')) + '</span>'));
    wrap.appendChild(el('h1', 'screen-title', esc(ui('modeTitle'))));
    wrap.appendChild(el('p', 'screen-sub', esc(ui('modeSub'))));

    var grid = el('div', 'mode-grid');

    // 1) АКТИВНА: взимане от обект → същинският pickup поток
    grid.appendChild(modeCard(SVG_STORE, ui('modePickup'), ui('modePickupSub'), null, function () {
      localStorage.setItem(LS.mode, 'pickup');
      location.hash = '#location';
    }));

    // 2) СКОРО: доставка — обикновен бутон (достъпен), само toast
    grid.appendChild(modeCard(SVG_TRUCK, ui('modeDelivery'), ui('modeDeliverySub'), ui('modeSoon'), function () {
      toast(ui('modeSoonToast'));
    }, true));

    // 3) АКТИВНА (външна): ToGo → sheet с eBag / продължи към менюто
    grid.appendChild(modeCard(SVG_BAG, ui('modeTogo'), ui('modeTogoSub'), null, openTogoSheet));

    wrap.appendChild(grid);
    view.appendChild(wrap);
    updateCartBar();
  }

  // Малък sheet за ToGo: „Купи от eBag" или „Виж ToGo продуктите" (pickup потока)
  function openTogoSheet() {
    var backdrop = el('div', 'modal-backdrop');
    var m = el('div', 'sheet togo-sheet');
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-label', ui('modeTogo'));

    var closeBtn = el('button', 'sheet__close', '&times;');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', ui('close'));
    function onKey(e) { if (e.key === 'Escape') close(); }
    function close() { backdrop.remove(); document.removeEventListener('keydown', onKey); }
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', onKey);
    m.appendChild(closeBtn);

    var body = el('div', 'sheet__body');
    body.appendChild(el('h2', 'sheet__name', esc(ui('modeTogo'))));
    body.appendChild(el('p', 'sheet__desc', esc(ui('modeTogoSub'))));

    var btns = el('div', 'togo-actions');

    var ebag = el('button', 'auth-btn',
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 5h5v5"/><path d="M19 5 10.5 13.5"/>' +
      '<path d="M19 13.5V19H5V5h5.5"/></svg><span>' + esc(ui('togoEbag')) + '</span>');
    ebag.type = 'button';
    ebag.addEventListener('click', function () {
      window.open('https://www.ebag.bg/search/?products%5Bquery%5D=%D0%B1%D0%B5%D1%88%D0%B0%D0%BC%D0%B5%D0%BB', '_blank', 'noopener');
    });
    btns.appendChild(ebag);

    var see = el('button', 'auth-btn',
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
      '<span>' + esc(ui('togoView')) + '</span>');
    see.type = 'button';
    see.addEventListener('click', function () {
      close();
      // ToGo категорията живее в менюто → продължаваме pickup потока
      localStorage.setItem(LS.mode, 'pickup');
      if (location.hash === '#location') router(); // hash не се сменя → прерисувай ръчно
      else location.hash = '#location';
    });
    btns.appendChild(see);

    body.appendChild(btns);
    m.appendChild(body);
    backdrop.appendChild(m);
    document.body.appendChild(backdrop);
    closeBtn.focus();
  }

  // --- ЕКРАН 1: ИЗБОР НА ОБЕКТ ---
  function screenLocation() {
    renderSkeletons();
    ensureLocations().then(function (locs) {
      view.innerHTML = '';
      view.appendChild(el('h1', 'screen-title', esc(ui('chooseLoc'))));
      view.appendChild(el('p', 'screen-sub', esc(ui('chooseLocSub'))));
      var grid = el('div', 'loc-grid');
      locs.forEach(function (loc) {
        var card = el('button', 'loc-card');
        card.type = 'button';
        card.appendChild(el('div', 'loc-card__name', esc(t(loc.name))));
        card.appendChild(el('div', 'loc-card__addr', esc(loc.address_bg)));
        if (loc.phone) card.appendChild(el('div', 'loc-card__phone', '☎ ' + esc(loc.phone)));
        card.appendChild(el('div', 'loc-card__go', esc(ui('goOrder')) + ' →'));
        card.addEventListener('click', function () { selectLocation(loc); });
        grid.appendChild(card);
      });
      view.appendChild(grid);
      updateCartBar();
    }).catch(function () {
      renderError(ui('errNetwork'), screenLocation);
    });
  }

  function selectLocation(loc) {
    state.locationId = loc.id;
    state.locationName = t(loc.name);
    localStorage.setItem(LS.loc, String(loc.id));
    updateHeaderLoc();
    location.hash = '#menu';
  }

  // Смяна на обект от хедъра (пита за количката, ако не е празна)
  function changeLocationFlow() {
    if (state.cart.length > 0) {
      confirmModal(
        ui('changeLocConfirm'), ui('changeLocMsg'),
        ui('clearCart'), ui('keepCart'),
        function () { clearCart(); location.hash = '#location'; },
        function () { location.hash = '#location'; }
      );
    } else {
      location.hash = '#location';
    }
  }

  // --- ЕКРАН 2: МЕНЮ ---
  function screenMenu() {
    if (!state.locationId) { location.hash = '#location'; return; }
    renderSkeletons();

    Promise.all([
      ensureCategories(),
      loadMenuDishes(),
      loadAvailability()
    ]).then(function (res) {
      var cats = res[0];
      var menu = res[1];      // { dishes, published }
      var unavailable = res[2]; // масив id
      state._unavailable = unavailable; // за детайлния изглед

      // Валидираме количката спрямо наличността: махаме изчерпани артикули
      pruneUnavailableFromCart(unavailable);

      view.innerHTML = '';

      if (!menu.published) {
        view.appendChild(el('p', 'screen-sub', esc(ui('menuNotPublished'))));
      } else {
        view.appendChild(el('h1', 'screen-title', esc(ui('menuTitle'))));
      }

      var dishes = menu.dishes || [];
      if (dishes.length === 0) {
        view.appendChild(el('div', 'state', '<div class="state__icon">🍽️</div><div class="state__msg">' + esc(ui('emptyMenu')) + '</div>'));
        updateCartBar();
        return;
      }

      // карта dish_id → category_slug (за tray индикатора; покрива и стари
      // артикули в количката, записани без category_slug)
      state._dishCat = state._dishCat || {};
      dishes.forEach(function (d) { state._dishCat[d.id] = d.category_slug; });

      // Групиране по категория, в реда на /categories
      var byCat = {};
      dishes.forEach(function (d) {
        (byCat[d.category_slug] = byCat[d.category_slug] || []).push(d);
      });

      // категории, реално налични в менюто (за чиповете и секциите)
      var present = cats.filter(function (c) { return byCat[c.slug] && byCat[c.slug].length; });

      // sticky лента с категорийни чипове (scrollspy) — при 2+ категории
      var chips = {};
      if (present.length > 1) {
        var catbar = el('nav', 'catbar');
        catbar.id = 'catbar';
        catbar.setAttribute('aria-label', ui('menuTitle'));
        present.forEach(function (cat) {
          var chip = el('button', 'catbar__chip', esc(t(cat.name)));
          chip.type = 'button';
          chip.addEventListener('click', function () { scrollToCategory(cat.slug); });
          chips[cat.slug] = chip;
          catbar.appendChild(chip);
        });
        view.appendChild(catbar);
        positionCatbar();
      }
      state._chips = chips;

      // секциите по категории (с id за скрол от чип/tray слот)
      var sections = [];
      present.forEach(function (cat) {
        var list = byCat[cat.slug];
        var sec = el('section', 'menu-sec');
        sec.id = 'cat-' + cat.slug;
        sec.appendChild(el('h2', 'section-title', esc(t(cat.name))));
        var grid = el('div', 'dish-grid');
        list.forEach(function (d) {
          grid.appendChild(dishCard(d, unavailable.indexOf(d.id) >= 0));
        });
        sec.appendChild(grid);
        view.appendChild(sec);
        sections.push({ slug: cat.slug, el: sec });
      });
      state._menuSections = sections;
      state._activeCat = null;

      // Ястия с непозната категория (fallback) — накрая
      var known = {};
      cats.forEach(function (c) { known[c.slug] = true; });
      var orphans = dishes.filter(function (d) { return !known[d.category_slug]; });
      if (orphans.length) {
        var grid2 = el('div', 'dish-grid');
        orphans.forEach(function (d) { grid2.appendChild(dishCard(d, unavailable.indexOf(d.id) >= 0)); });
        view.appendChild(grid2);
      }

      updateCartBar();
      updateScrollSpy(); // начален активен чип
    }).catch(function (err) {
      renderError(ui('errNetwork'), screenMenu);
    });
  }

  function dishCard(d, isOut) {
    var card = el('div', 'dish' + (isOut ? ' is-out' : ''));

    // media
    var media = el('div', 'dish__media');
    if (d.image_url) {
      var img = el('img');
      img.src = d.image_url;
      img.alt = t(d.name);
      img.loading = 'lazy';
      // ако снимката се счупи → плейсхолдър
      img.addEventListener('error', function () {
        media.innerHTML = '';
        media.appendChild(el('div', 'dish__ph', 'Бешамел'));
      });
      media.appendChild(img);
    } else {
      media.appendChild(el('div', 'dish__ph', 'Бешамел'));
    }
    if (isOut) media.appendChild(el('div', 'dish__out-badge', esc(ui('outToday'))));
    card.appendChild(media);

    var body = el('div', 'dish__body');
    body.appendChild(el('div', 'dish__name', esc(t(d.name))));
    var desc = t(d.description);
    if (desc) body.appendChild(el('div', 'dish__desc', esc(desc)));

    // мета: грамаж, калории (със собствени inline SVG иконки)
    var meta = el('div', 'dish__meta');
    var wn = t(d.weight_note);
    if (wn) meta.appendChild(el('span', null, SVG_WEIGHT + esc(wn)));
    else if (d.weight_grams) meta.appendChild(el('span', null, SVG_WEIGHT + esc(d.weight_grams) + ' г'));
    if (d.calories) meta.appendChild(el('span', null, SVG_CAL + esc(d.calories) + ' ' + esc(ui('cal'))));
    if (meta.children.length) body.appendChild(meta);

    // алергени — винаги видими на картата
    body.appendChild(allergenNode(d));

    var hasLarge = d.price.eur_large != null;

    // избор на размер (само ако има голяма порция)
    var currentSize = state.sizeChoice[d.id] || 'normal';
    if (hasLarge && !isOut) {
      var seg = el('div', 'size-seg');
      seg.setAttribute('role', 'group');
      seg.setAttribute('aria-label', 'размер');
      [['normal', ui('sizeNormal')], ['large', ui('sizeLarge')]].forEach(function (pair) {
        var b = el('button', currentSize === pair[0] ? 'is-active' : '', esc(pair[1]));
        b.type = 'button';
        b.addEventListener('click', function () {
          state.sizeChoice[d.id] = pair[0];
          // обнови сегмента + цената локално
          Array.prototype.forEach.call(seg.children, function (c) { c.classList.remove('is-active'); });
          b.classList.add('is-active');
          updatePrice();
        });
        seg.appendChild(b);
      });
      body.appendChild(seg);
    }

    // цена (двойно €·лв), реагира на размера
    var priceEl = el('div', 'dish__price');
    function updatePrice() {
      var sz = state.sizeChoice[d.id] || 'normal';
      var eur = (sz === 'large' && hasLarge) ? d.price.eur_large : d.price.eur;
      var bgn = (sz === 'large' && hasLarge) ? d.price.bgn_large : d.price.bgn;
      priceEl.innerHTML = esc(fmtEur(eur)) + ' <span class="bgn">· ' + esc(fmtBgn(bgn)) + '</span>';
    }
    updatePrice();
    body.appendChild(priceEl);

    // действия: „Виж още" + „Добави"
    var actions = el('div', 'dish__actions');
    var more = el('button', 'btn btn--ghost dish__more', esc(ui('viewMore')));
    more.type = 'button';
    more.setAttribute('aria-label', ui('viewMore') + ': ' + t(d.name));
    more.addEventListener('click', function () {
      var sz = (hasLarge ? (state.sizeChoice[d.id] || 'normal') : 'normal');
      openDishDetail(d, sz);
    });
    actions.appendChild(more);

    // бутон „Добави" (няма при изчерпано)
    if (!isOut) {
      var add = el('button', 'btn btn--solid dish__add', esc(ui('add')));
      add.type = 'button';
      add.setAttribute('aria-label', ui('add') + ': ' + t(d.name));
      add.addEventListener('click', function () {
        var sz = (hasLarge ? (state.sizeChoice[d.id] || 'normal') : 'normal');
        // бърз add от картата → default_on (resolveOptions без selected);
        // снимката „излита" към количката (уважава reduced-motion)
        flyToCart(media, function () { addToCart(d, sz); });
        toast(ui('added'));
      });
      actions.appendChild(add);
    }
    body.appendChild(actions);

    card.appendChild(body);
    return card;
  }

  // --- ЕКРАН 3: КОЛИЧКА ---
  function screenCart() {
    view.innerHTML = '';
    view.appendChild(backLink(ui('backToMenu'), '#menu'));
    view.appendChild(el('h1', 'screen-title', esc(ui('cartTitle'))));

    if (state.cart.length === 0) {
      var empty = el('div', 'state');
      empty.appendChild(el('div', 'state__icon', '🛒'));
      empty.appendChild(el('div', 'state__msg', esc(ui('cartEmpty'))));
      var cta = el('button', 'btn btn--solid', esc(ui('cartEmptyCta')));
      cta.type = 'button';
      cta.addEventListener('click', function () { location.hash = '#menu'; });
      empty.appendChild(cta);
      view.appendChild(empty);
      updateCartBar();
      return;
    }

    var list = el('div', 'cart-list');
    state.cart.forEach(function (it, idx) {
      var row = el('div', 'cart-item');
      var info = el('div');
      var nm = it.name ? t(it.name) : it.name_bg;
      info.appendChild(el('div', 'cart-item__name', esc(nm)));
      if (it.size === 'large') info.appendChild(el('div', 'cart-item__size', esc(ui('sizeLarge'))));
      var optSum = optionsSummary(it.options);
      if (optSum) info.appendChild(el('div', 'cart-item__opts', esc(optSum)));
      info.appendChild(el('div', 'cart-item__price', esc(fmtDual(it.unit_eur, it.unit_bgn))));
      row.appendChild(info);

      var ctrls = el('div', 'cart-item__ctrls');
      var qty = el('div', 'qty');
      var minus = el('button', null, '−'); minus.type = 'button';
      minus.setAttribute('aria-label', 'минус');
      var val = el('span', 'qty__val', String(it.qty));
      var plus = el('button', null, '+'); plus.type = 'button';
      plus.setAttribute('aria-label', 'плюс');
      minus.addEventListener('click', function () { setQty(idx, -1); screenCart(); });
      plus.addEventListener('click', function () { setQty(idx, +1); screenCart(); });
      qty.appendChild(minus); qty.appendChild(val); qty.appendChild(plus);
      ctrls.appendChild(qty);
      var rm = el('button', 'cart-item__remove', esc(ui('remove')));
      rm.type = 'button';
      rm.addEventListener('click', function () { removeItem(idx); screenCart(); });
      ctrls.appendChild(rm);
      row.appendChild(ctrls);
      list.appendChild(row);
    });
    view.appendChild(list);

    var totals = cartTotals();
    var totalRow = el('div', 'cart-total');
    totalRow.appendChild(el('span', 'cart-total__label', esc(ui('total'))));
    totalRow.appendChild(el('span', 'cart-total__val',
      esc(fmtEur(totals.eur)) + ' <span class="bgn">· ' + esc(fmtBgn(totals.bgn)) + '</span>'));
    view.appendChild(totalRow);

    var go = el('button', 'btn btn--solid btn--block btn--lg', esc(ui('toCheckout')));
    go.type = 'button';
    go.addEventListener('click', function () { location.hash = '#checkout'; });
    view.appendChild(go);

    updateCartBar();
  }

  // --- ЕКРАН 4: ДАННИ ЗА ПОРЪЧКА ---
  function screenCheckout() {
    if (state.cart.length === 0) { location.hash = '#cart'; return; }
    view.innerHTML = '';
    view.appendChild(backLink(ui('backToCart'), '#cart'));
    view.appendChild(el('h1', 'screen-title', esc(ui('checkoutTitle'))));

    var form = el('form', 'form');
    form.noValidate = true;

    // име (задължително)
    form.appendChild(fieldText('name', ui('name'), true, 'text', 'name'));
    // телефон (задължително)
    form.appendChild(fieldText('phone', ui('phone'), true, 'tel', 'tel'));
    // имейл (по желание)
    form.appendChild(fieldText('email', ui('email'), false, 'email', 'email'));

    // час за взимане (по желание)
    var pf = el('div', 'field');
    pf.appendChild(labelFor('pickup', ui('pickup'), false));
    var sel = el('select'); sel.id = 'f_pickup';
    var opt0 = el('option', null, esc(ui('pickupASAP'))); opt0.value = '';
    sel.appendChild(opt0);
    pickupSlots().forEach(function (slot) {
      var o = el('option', null, slot.label);
      o.value = slot.iso;
      sel.appendChild(o);
    });
    pf.appendChild(sel);
    form.appendChild(pf);

    // бележка (по желание)
    var nf = el('div', 'field');
    nf.appendChild(labelFor('note', ui('note'), false));
    var ta = el('textarea'); ta.id = 'f_note'; ta.rows = 3;
    nf.appendChild(ta);
    form.appendChild(nf);

    // логнат клиент → префил на име/телефон/имейл от профила
    if (state.me) {
      if (state.me.name) form.querySelector('#f_name').value = state.me.name;
      if (state.me.phone) form.querySelector('#f_phone').value = state.me.phone;
      if (state.me.email && !/@social\.beshamel\.local$/.test(state.me.email)) {
        form.querySelector('#f_email').value = state.me.email;
      }
    } else {
      // мек ред „Имаш акаунт? Влез за по-бързо" (по желание, не блокира госта)
      var hint = el('div', 'login-hint');
      var hb = el('button', 'login-hint__btn',
        esc(ui('loginHintQ')) + ' <span>' + esc(ui('loginHintA')) + '</span>');
      hb.type = 'button';
      hb.addEventListener('click', openLoginSheet);
      hint.appendChild(hb);
      form.appendChild(hint);
    }

    // избор на начин на плащане — САМО когато онлайн плащането е включено;
    // при enabled=false не показваме нищо ново (както досега)
    if (state.payments.enabled) {
      var payBox = el('div', 'paychoice');
      payBox.appendChild(el('div', 'paychoice__title', esc(ui('payHow'))));
      [
        ['on_site', ui('payOnSite'), ''],
        ['online', ui('payNow'), ui('payNowSub')]
      ].forEach(function (opt, i) {
        var lab = el('label', 'payopt');
        var rb = el('input');
        rb.type = 'radio'; rb.name = 'paymethod'; rb.value = opt[0];
        if (i === 0) rb.checked = true;
        lab.appendChild(rb);
        var txt = el('span', 'payopt__txt');
        txt.appendChild(el('span', 'payopt__title', esc(opt[1])));
        if (opt[2]) txt.appendChild(el('span', 'payopt__sub', esc(opt[2])));
        lab.appendChild(txt);
        payBox.appendChild(lab);
      });
      form.appendChild(payBox);
    }

    // обобщение + тотал
    form.appendChild(orderSummary());

    // грешка от сървъра (пълни се при 422/мрежа)
    var srvErr = el('div', 'field__err'); srvErr.id = 'srvErr'; srvErr.style.textAlign = 'center';
    form.appendChild(srvErr);

    var submit = el('button', 'btn btn--solid btn--block btn--lg', esc(ui('placeOrder')));
    submit.type = 'submit';
    form.appendChild(submit);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitOrder(form, submit);
    });

    view.appendChild(form);
    updateCartBar();
  }

  function fieldText(key, label, required, type, autocomplete) {
    var f = el('div', 'field');
    f.id = 'field_' + key;
    f.appendChild(labelFor(key, label, required));
    var inp = el('input');
    inp.id = 'f_' + key; inp.type = type || 'text';
    if (autocomplete) inp.autocomplete = autocomplete;
    if (required) inp.setAttribute('aria-required', 'true');
    f.appendChild(inp);
    f.appendChild(el('div', 'field__err'));
    return f;
  }
  function labelFor(key, text, required) {
    var l = el('label');
    l.setAttribute('for', 'f_' + key);
    l.innerHTML = esc(text) + (required ? ' <span class="req" aria-hidden="true">*</span>' : '');
    return l;
  }

  // Слотове за взимане на 15 мин до края на деня
  function pickupSlots() {
    var slots = [];
    var now = new Date();
    var d = new Date(now);
    // закръгляме нагоре до следваща четвърт + буфер 15 мин
    d.setSeconds(0, 0);
    d.setMinutes(Math.ceil((d.getMinutes() + 15) / 15) * 15);
    while (d.getDate() === now.getDate()) {
      var hh = String(d.getHours()).padStart(2, '0');
      var mm = String(d.getMinutes()).padStart(2, '0');
      slots.push({ iso: toLocalISO(d), label: hh + ':' + mm });
      d = new Date(d.getTime() + 15 * 60000);
    }
    return slots;
  }
  // ISO с локална часова зона (без да губим часа заради UTC)
  function toLocalISO(d) {
    var tz = -d.getTimezoneOffset();
    var sign = tz >= 0 ? '+' : '-';
    var pad = function (n) { return String(Math.abs(n)).padStart(2, '0'); };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':00' +
      sign + pad(tz / 60) + ':' + pad(tz % 60);
  }

  function orderSummary() {
    var box = el('div', 'summary');
    state.cart.forEach(function (it) {
      var nm = (it.name ? t(it.name) : it.name_bg) + (it.size === 'large' ? ' (' + ui('sizeLarge') + ')' : '');
      var optSum = optionsSummary(it.options);
      if (optSum) nm += ' · ' + optSum;
      var row = el('div', 'summary__row');
      row.appendChild(el('span', null, esc(nm) + ' × ' + it.qty));
      row.appendChild(el('span', null, esc(fmtEur(it.unit_eur * it.qty))));
      box.appendChild(row);
    });
    var totals = cartTotals();
    var tot = el('div', 'summary__row total');
    tot.appendChild(el('span', null, esc(ui('total'))));
    tot.appendChild(el('span', null, esc(fmtDual(totals.eur, totals.bgn))));
    box.appendChild(tot);
    return box;
  }

  // Прост валидатор на телефон: 6+ цифри след премахване на нецифри
  function validPhone(v) {
    var digits = (v || '').replace(/[^\d]/g, '');
    return digits.length >= 6 && digits.length <= 15;
  }

  function setFieldError(key, msg) {
    var f = document.getElementById('field_' + key);
    if (!f) return;
    f.classList.toggle('field--error', !!msg);
    var errEl = f.querySelector('.field__err');
    if (errEl) errEl.textContent = msg || '';
  }

  function submitOrder(form, submitBtn) {
    var name = form.querySelector('#f_name').value.trim();
    var phone = form.querySelector('#f_phone').value.trim();
    var email = form.querySelector('#f_email').value.trim();
    var pickup = form.querySelector('#f_pickup').value || null;
    var note = form.querySelector('#f_note').value.trim();
    document.getElementById('srvErr').textContent = '';

    // клиентска валидация
    var ok = true;
    if (!name) { setFieldError('name', ui('errName')); ok = false; } else setFieldError('name', '');
    if (!validPhone(phone)) { setFieldError('phone', ui('errPhone')); ok = false; } else setFieldError('phone', '');
    if (!ok) return;

    var body = {
      location_id: state.locationId,
      customer_name: name,
      customer_phone: phone,
      items: state.cart.map(function (it) {
        var item = { dish_id: it.dish_id, qty: it.qty, size: it.size };
        // прати options само за налични addon ключове (само {key,on})
        if (it.options && it.options.length) {
          item.options = it.options.map(function (o) { return { key: o.key, on: !!o.on }; });
        }
        return item;
      })
    };
    if (email) body.customer_email = email;
    if (pickup) body.pickup_at = pickup;
    if (note) body.note = note;

    // блокираме бутона + спинер
    submitBtn.disabled = true;
    var oldLabel = submitBtn.textContent;
    submitBtn.textContent = ui('sending');

    // избран начин на плащане (radio се показва само при enabled=true)
    var payRadio = form.querySelector('input[name="paymethod"]:checked');
    var payOnline = !!(state.payments.enabled && payRadio && payRadio.value === 'online');

    api('/orders', { method: 'POST', body: body }).then(function (r) {
      if (r.ok && r.json && r.json.data) {
        // успех → поръчката е създадена; количката се чисти и в двата случая
        clearCart();
        if (payOnline && r.json.data.id != null) {
          startPayment(r.json.data); // Stripe sheet; при отказ → „Готово" неплатена
        } else {
          renderDone(r.json.data);
        }
        return;
      }
      // 422 или друга валидация
      submitBtn.disabled = false;
      submitBtn.textContent = oldLabel;
      handleOrderErrors(r.json);
    }).catch(function () {
      // мрежова грешка → приятелско съобщение + остава на екрана за повторен опит
      submitBtn.disabled = false;
      submitBtn.textContent = oldLabel;
      document.getElementById('srvErr').textContent = ui('errNetwork');
    });
  }

  // Обработка на 422: показваме грешките четимо; ако ястие не е налично — махаме го
  function handleOrderErrors(json) {
    var srv = document.getElementById('srvErr');
    var messages = [];
    var removedDish = false;

    if (json && json.errors && typeof json.errors === 'object') {
      Object.keys(json.errors).forEach(function (k) {
        var arr = json.errors[k];
        (Array.isArray(arr) ? arr : [arr]).forEach(function (m) {
          messages.push(m);
          // ако сървърът маркира неналично ястие в items.* → чистим количката от него
          if (/not available|unavailable|наличн|доступ/i.test(String(m))) removedDish = true;
        });
      });
    }
    if (json && json.message && !messages.length) messages.push(json.message);
    if (!messages.length) messages.push(ui('errOrder'));

    // ако сървърът върне конкретни неналични id-та
    var gone = (json && (json.unavailable_dish_ids || (json.data && json.data.unavailable_dish_ids))) || null;
    if (Array.isArray(gone) && gone.length) {
      pruneUnavailableFromCart(gone);
      removedDish = true;
    }

    srv.textContent = messages.join(' ');
    if (removedDish) {
      toast(ui('dishGone'));
      // връщаме към количката, за да види промяната
      setTimeout(function () { location.hash = '#cart'; }, 400);
    }
  }

  // --- ЕКРАН 5: ГОТОВО ---
  function renderDone(data) {
    state.lastOrder = data;
    location.hash = '#done';
    view.innerHTML = '';
    var wrap = el('div', 'done');
    wrap.appendChild(el('div', 'done__check', '✓'));
    wrap.appendChild(el('h1', 'screen-title', esc(ui('doneTitle'))));
    wrap.appendChild(el('div', 'done__num', esc(data.number || '')));
    var badges = el('div', 'done__badges');
    badges.appendChild(el('span', 'done__status', esc(ui('doneStatus'))));
    if (data._paid) badges.appendChild(el('span', 'done__status done__status--paid', esc(ui('paidBadge'))));
    wrap.appendChild(badges);
    wrap.appendChild(el('p', 'done__msg', esc(ui('doneMsg')) + ' ' + esc(state.locationName || 'Бешамел') + '.'));
    if (data.total_eur != null && data.total_bgn != null) {
      wrap.appendChild(el('div', 'done__total', esc(fmtDual(data.total_eur, data.total_bgn))));
    }
    var again = el('button', 'btn btn--solid btn--lg', esc(ui('newOrder')));
    again.type = 'button';
    again.addEventListener('click', function () { location.hash = '#menu'; });
    wrap.appendChild(again);
    view.appendChild(wrap);
    updateCartBar();
  }

  function backLink(text, hash) {
    var b = el('button', 'back-link', '← ' + esc(text));
    b.type = 'button';
    b.addEventListener('click', function () { location.hash = hash; });
    return b;
  }

  /* ============================================================
     Данни: зареждане + кеш
     ============================================================ */
  function ensureLocations() {
    if (state.locations) return Promise.resolve(state.locations);
    return api('/locations').then(function (r) {
      if (!r.ok || !r.json || !Array.isArray(r.json.data)) throw new Error('bad');
      state.locations = r.json.data;
      // ако имаме запомнен обект — възстановяваме името му
      if (state.locationId && !state.locationName) {
        var found = state.locations.filter(function (l) { return l.id === state.locationId; })[0];
        if (found) state.locationName = t(found.name);
      }
      return state.locations;
    });
  }
  function ensureCategories() {
    if (state.categories) return Promise.resolve(state.categories);
    return api('/categories').then(function (r) {
      if (!r.ok || !r.json || !Array.isArray(r.json.data)) throw new Error('bad');
      state.categories = r.json.data;
      return state.categories;
    });
  }

  // Меню: първо /menu/today; ако data е null → fallback чрез /categories + /dishes
  function loadMenuDishes() {
    return api('/menu/today').then(function (r) {
      if (r.ok && r.json && r.json.data && Array.isArray(r.json.data.dishes)) {
        return { dishes: r.json.data.dishes, published: true, note: r.json.data.note };
      }
      // fallback: зареждаме всички ястия по категории
      return ensureCategories().then(function (cats) {
        var reqs = cats.map(function (c) {
          return api('/dishes?category=' + encodeURIComponent(c.slug)).then(function (rr) {
            return (rr.ok && rr.json && Array.isArray(rr.json.data)) ? rr.json.data : [];
          });
        });
        return Promise.all(reqs).then(function (lists) {
          var all = [];
          lists.forEach(function (l) { all = all.concat(l); });
          return { dishes: all, published: false, note: null };
        });
      });
    });
  }

  function loadAvailability() {
    if (!state.locationId) return Promise.resolve([]);
    return api('/locations/' + state.locationId + '/availability').then(function (r) {
      if (r.ok && r.json && r.json.data && Array.isArray(r.json.data.unavailable_dish_ids)) {
        return r.json.data.unavailable_dish_ids;
      }
      return [];
    }).catch(function () { return []; }); // наличността не бива да чупи менюто
  }

  // Махаме от количката ястия, които вече не са налични
  function pruneUnavailableFromCart(unavailableIds) {
    if (!unavailableIds || !unavailableIds.length) return;
    var before = state.cart.length;
    state.cart = state.cart.filter(function (it) { return unavailableIds.indexOf(it.dish_id) < 0; });
    if (state.cart.length !== before) { saveCart(); updateCartBar(); }
  }

  /* ============================================================
     Хедър: избран обект + език
     ============================================================ */
  function updateHeaderLoc() {
    var box = document.getElementById('hdrLoc');
    var nameEl = document.getElementById('hdrLocName');
    if (state.locationId && state.locationName) {
      nameEl.textContent = state.locationName;
      box.hidden = false;
    } else {
      box.hidden = true;
    }
  }

  var lastBarCount = 0; // за „подскачането" при добавяне
  var suppressBump = false; // fly-to-cart отлага bump-а до „кацането"
  function bumpCartbar() {
    var btn = document.getElementById('cartbarBtn');
    if (!btn) return;
    btn.classList.remove('is-bump');
    void btn.offsetWidth; // рестартирай анимацията
    btn.classList.add('is-bump');
  }
  function updateCartBar() {
    var bar = document.getElementById('cartbar');
    var count = cartCount();
    // показваме лентата само когато има артикули и НЕ сме на екрана количка/готово
    var hash = location.hash || '#location';
    var hide = count === 0 || hash === '#cart' || hash === '#done' || hash === '#checkout' || hash === '#profile';
    bar.hidden = hide;
    view.classList.toggle('has-cartbar', !hide);
    if (!hide) {
      document.getElementById('cartbarCount').textContent = String(count);
      var totals = cartTotals();
      document.getElementById('cartbarTotal').textContent = fmtEur(totals.eur);
      // привлечи окото, когато нещо ново влезе в количката
      if (count > lastBarCount && !suppressBump) bumpCartbar();
    }
    lastBarCount = count;
    updateTray();
  }

  /* ============================================================
     „ПОДРЕДИ СИ ТАБЛАТА" — tray индикатор над количката (#menu)
     Слот светва, щом количката съдържа ястие от категорията му.
     ============================================================ */
  var TRAY_SVG = {
    salad:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M4 13h16a8 8 0 0 1-16 0Z"/>' +
      '<path d="M13.2 9.8c.3-2.8 2-4.4 4.8-4.6-.3 2.8-2 4.4-4.8 4.6Z"/>' +
      '<path d="M10.6 9.8C10.4 7.6 9.2 6.2 7 5.8c.2 2.2 1.4 3.6 3.6 4Z"/></svg>',
    soup:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M4 11h16a8 8 0 0 1-16 0Z"/>' +
      '<path d="M9.6 8.2c0-1.1.9-1.5.9-2.7"/><path d="M13.6 8.2c0-1.1.9-1.5.9-2.7"/></svg>',
    main:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M4 16.5h16"/><path d="M5.5 16.5a6.5 6.5 0 0 1 13 0"/>' +
      '<path d="M12 10v-.9"/><circle cx="12" cy="7.9" r="1"/></svg>',
    dessert:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M6.5 12.5h11l-1.4 6.5H7.9l-1.4-6.5Z"/>' +
      '<path d="M7.3 12.5a4.8 4.8 0 0 1 9.4 0"/><path d="M12 5.7V4.5"/></svg>'
  };
  // мапинг категория → слот: salati→салата, supi→супа,
  // bez-meso + meso-riba→основно, deserti→десерт (togo-semeini не участва)
  var TRAY_SLOTS = [
    { key: 'salad', label: 'traySalad', cats: ['salati'] },
    { key: 'soup', label: 'traySoup', cats: ['supi'] },
    { key: 'main', label: 'trayMain', cats: ['bez-meso', 'meso-riba'] },
    { key: 'dessert', label: 'trayDessert', cats: ['deserti'] }
  ];
  var trayWasFull = false;

  // строи tray-а веднъж — вътре в #cartbar, над бутона (мести се със safe-area)
  function buildTray() {
    var bar = document.getElementById('cartbar');
    if (!bar || document.getElementById('traybar')) return;
    var wrap = el('div', 'traybar');
    wrap.id = 'traybar';
    wrap.hidden = true;
    var tray = el('div', 'tray');
    tray.setAttribute('role', 'group');
    TRAY_SLOTS.forEach(function (slot) {
      var b = el('button', 'tray__slot', TRAY_SVG[slot.key]);
      b.type = 'button';
      b.setAttribute('data-slot', slot.key);
      b.addEventListener('click', function () {
        // клик върху слот → скрол до категорията (за основно → първата налична)
        for (var i = 0; i < slot.cats.length; i++) {
          if (document.getElementById('cat-' + slot.cats[i])) {
            scrollToCategory(slot.cats[i]);
            return;
          }
        }
      });
      tray.appendChild(b);
    });
    var full = el('span', 'tray__full');
    full.setAttribute('aria-live', 'polite');
    tray.appendChild(full);
    wrap.appendChild(tray);
    bar.insertBefore(wrap, bar.firstChild);
  }

  // категорията на артикул: от записа в количката или от картата dish→slug
  function cartItemCat(it) {
    return it.category_slug || (state._dishCat && state._dishCat[it.dish_id]) || null;
  }
  function traySlotFilled(slot) {
    for (var i = 0; i < state.cart.length; i++) {
      var cat = cartItemCat(state.cart[i]);
      if (cat && slot.cats.indexOf(cat) >= 0) return true;
    }
    return false;
  }

  function updateTray() {
    var wrap = document.getElementById('traybar');
    if (!wrap) return;
    var tray = wrap.querySelector('.tray');
    tray.setAttribute('aria-label', ui('trayLabel'));

    var filled = 0, available = 0;
    TRAY_SLOTS.forEach(function (slot) {
      var b = tray.querySelector('[data-slot="' + slot.key + '"]');
      /* категория, която липсва в днешното меню → приглушен слот, не се брои */
      var avail = slot.cats.some(function (c) { return !!document.getElementById('cat-' + c); });
      b.classList.toggle('is-absent', !avail);
      if (avail) available++;
      var on = avail && traySlotFilled(slot);
      if (on) filled++;
      b.classList.toggle('is-filled', on);
      b.setAttribute('aria-label', ui(slot.label));
      b.title = ui(slot.label);
    });

    var isFull = available > 0 && filled === available;
    tray.classList.toggle('is-full', isFull);
    tray.querySelector('.tray__full').textContent = isFull ? ui('trayFull') : '';
    // еднократен пулс + дискретен празничен bounce при 4/4
    if (isFull && !trayWasFull) {
      tray.classList.remove('is-celebrate');
      void tray.offsetWidth;
      tray.classList.add('is-celebrate');
      setTimeout(function () { tray.classList.remove('is-celebrate'); }, 1400);
    }
    trayWasFull = isFull;

    // скрит при празна количка ИЛИ извън #menu
    var hash = location.hash || '#location';
    var show = hash === '#menu' && state.cart.length > 0;
    wrap.hidden = !show;
    document.body.classList.toggle('has-tray', show);
  }

  /* ============================================================
     КАТЕГОРИЙНИ ЧИПОВЕ + SCROLLSPY (#menu)
     ============================================================ */
  function prefersReduced() {
    return !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  // sticky отместване: хедър + лента с чипове
  function menuScrollOffset() {
    var hdr = document.querySelector('.hdr');
    var cb = document.getElementById('catbar');
    return (hdr ? hdr.offsetHeight : 0) + (cb ? cb.offsetHeight : 0) + 8;
  }
  // лентата ляга точно под sticky хедъра (височината му варира по екрани)
  function positionCatbar() {
    var cb = document.getElementById('catbar');
    if (!cb) return;
    var hdr = document.querySelector('.hdr');
    cb.style.top = ((hdr ? hdr.offsetHeight : 52) - 1) + 'px';
  }
  function scrollToCategory(slug) {
    var sec = document.getElementById('cat-' + slug);
    if (!sec) return;
    var y = Math.max(0, sec.getBoundingClientRect().top + window.pageYOffset - menuScrollOffset());
    // стари браузъри без ScrollToOptions → директен скок
    try {
      window.scrollTo({ top: y, behavior: prefersReduced() ? 'auto' : 'smooth' });
    } catch (e) {
      window.scrollTo(0, y);
    }
  }

  var spyTick = false;
  function onMenuScroll() {
    if (spyTick) return;
    spyTick = true;
    requestAnimationFrame(function () {
      spyTick = false;
      updateScrollSpy();
    });
  }
  function updateScrollSpy() {
    var secs = state._menuSections;
    var chips = state._chips;
    if (!secs || !secs.length || !chips || !document.getElementById('catbar')) return;
    var off = menuScrollOffset() + 30;
    var active = secs[0].slug;
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].el.getBoundingClientRect().top <= off) active = secs[i].slug;
    }
    // на дъното на страницата → последната секция е активна
    if (window.innerHeight + window.pageYOffset >=
        document.documentElement.scrollHeight - 4) {
      active = secs[secs.length - 1].slug;
    }
    if (active === state._activeCat) return;
    state._activeCat = active;
    Object.keys(chips).forEach(function (slug) {
      chips[slug].classList.toggle('is-active', slug === active);
    });
    var chip = chips[active];
    if (chip && chip.scrollIntoView) {
      chip.scrollIntoView({
        behavior: prefersReduced() ? 'auto' : 'smooth',
        inline: 'center', block: 'nearest'
      });
    }
  }

  /* ============================================================
     FLY-TO-CART — кръгло копие на снимката (или шафранова точка)
     излита по дъга от картата към количката; после bump.
     При prefers-reduced-motion: нищо не лети (само bump-ът).
     ============================================================ */
  function flyToCart(sourceMediaEl, doAdd) {
    if (prefersReduced() || !sourceMediaEl) { doAdd(); return; }

    // стартовият rect се взима ПРЕДИ doAdd/close да пипнат DOM-а
    var srcRect = sourceMediaEl.getBoundingClientRect();
    var img = sourceMediaEl.querySelector('img');
    var imgSrc = img ? (img.currentSrc || img.src) : null;

    suppressBump = true;
    doAdd(); // количката се обновява; cartbar-ът става видим
    suppressBump = false;

    var target = document.getElementById('cartbarCount');
    var bar = document.getElementById('cartbar');
    if (!target || !bar || bar.hidden || !srcRect.width) { bumpCartbar(); return; }
    var tRect = target.getBoundingClientRect();
    if (!tRect.width && !tRect.height) { bumpCartbar(); return; }

    var sx = srcRect.left + srcRect.width / 2;
    var sy = srcRect.top + srcRect.height / 2;
    var tx = tRect.left + tRect.width / 2;
    var ty = tRect.top + tRect.height / 2;

    // дъга: обвивката движи X, точката — Y (с „изгърбено" easing) + смаляване
    var fwrap = el('div', 'fly');
    var dot = el('div', 'fly__dot');
    if (imgSrc) dot.style.backgroundImage = 'url("' + imgSrc.replace(/"/g, '%22') + '")';
    fwrap.appendChild(dot);
    fwrap.style.left = sx + 'px';
    fwrap.style.top = sy + 'px';
    document.body.appendChild(fwrap);

    var done = false;
    function land() {
      if (done) return;
      done = true;
      fwrap.remove();
      bumpCartbar(); // съществуващият bump — след „кацането"
    }
    dot.addEventListener('transitionend', land);
    setTimeout(land, 800); // застраховка, ако transitionend не дойде

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        fwrap.style.transform = 'translateX(' + (tx - sx) + 'px)';
        dot.style.transform = 'translateY(' + (ty - sy) + 'px) scale(.22)';
        dot.style.opacity = '.85';
      });
    });
  }

  // Прилагаме текущия език към статичните UI надписи (data-i18n) + активен бутон
  function applyLang() {
    document.documentElement.lang = state.lang;
    LANGS.forEach(function (l) {
      // no-op, стойностите се вземат динамично
    });
    // бутони на превключвателя
    Array.prototype.forEach.call(document.querySelectorAll('.lang__opt'), function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === state.lang);
    });
    // статични надписи в HTML
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (n) {
      n.textContent = ui(n.getAttribute('data-i18n'));
    });
    updateHeaderLoc();
    updateAccountBtn();
  }

  /* ============================================================
     6) РУТЕР + INIT
     ============================================================ */
  function router() {
    // Първо посещение (няма запомнен начин на поръчка) → входният екран #mode;
    // има ли 'besh-ord-mode' — досегашното поведение (направо #location/менюто).
    var hash = location.hash ||
      (localStorage.getItem(LS.mode) ? '#location' : '#mode');
    // OAuth връщане (#token=… / #auth_error=1) — обработваме и при hashchange
    if (/^#(token=|auth_error=)/.test(hash)) {
      if (consumeAuthHash()) router(); // replaceState не пали hashchange → ръчно
      return;
    }
    // ако няма избран обект — насила към избора (профил и вход #mode са достъпни)
    if (!state.locationId && hash !== '#location' && hash !== '#profile' && hash !== '#mode') { location.hash = '#location'; return; }

    switch (hash) {
      case '#mode': screenMode(); break;
      case '#menu': screenMenu(); break;
      case '#cart': screenCart(); break;
      case '#checkout': screenCheckout(); break;
      case '#profile': screenProfile(); break;
      case '#done':
        // прерисуваме от запомнените данни (за да работи смяната на език);
        // при директен вход без поръчка → меню
        if (state.lastOrder) { renderDone(state.lastOrder); }
        else if (!view.querySelector('.done')) { location.hash = '#menu'; }
        break;
      case '#location':
      default: screenLocation(); break;
    }
    updateCartBar();
    window.scrollTo(0, 0);
  }

  function init() {
    // OAuth връщане: #token=… → пазим токена; #auth_error=1 → toast
    var consumedAuth = consumeAuthHash();

    // език
    applyLang();
    // хедър: избран обект
    updateHeaderLoc();

    // хедър: акаунт (иконка / аватар)
    updateAccountBtn();
    var accBtn = document.getElementById('hdrAccBtn');
    if (accBtn) {
      accBtn.addEventListener('click', function () {
        if (state.token) location.hash = '#profile';
        else openLoginSheet();
      });
    }

    // наличен токен от предишна сесия → зареждаме профила тихо
    if (state.token && !consumedAuth) loadMe(false);

    // онлайн плащане: конфигурация (в dev enabled=false → нищо ново в UI)
    loadPaymentsConfig();

    // слушатели: език
    Array.prototype.forEach.call(document.querySelectorAll('.lang__opt'), function (b) {
      b.addEventListener('click', function () {
        state.lang = b.getAttribute('data-lang');
        localStorage.setItem(LS.lang, state.lang);
        applyLang();
        router(); // прерисуваме текущия екран на новия език
      });
    });

    // хедър: смяна на обект
    document.getElementById('hdrLocBtn').addEventListener('click', changeLocationFlow);

    // хедър: „начало" → входният екран #mode (НЕ чисти количката/обекта)
    var homeBtn = document.getElementById('hdrHomeBtn');
    if (homeBtn) {
      homeBtn.addEventListener('click', function () {
        if (location.hash === '#mode') return;
        location.hash = '#mode';
      });
    }

    // sticky количка → отива към количката
    document.getElementById('cartbarBtn').addEventListener('click', function () {
      location.hash = '#cart';
    });

    // „Подреди си таблата" (tray) + scrollspy на категорийните чипове
    buildTray();
    window.addEventListener('scroll', onMenuScroll, { passive: true });
    window.addEventListener('resize', positionCatbar);

    // при запомнен обект — възстановяваме името му (async, за хедъра)
    if (state.locationId) {
      ensureLocations().then(function () { updateHeaderLoc(); }).catch(function () {});
    }

    window.addEventListener('hashchange', router);
    router();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
