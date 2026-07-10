(function () {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll (Lenis, optional) ---------- */
  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          if (lenis) lenis.scrollTo(el, { offset: -10 });
          else el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- nav stuck state ---------- */
  var nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: function (self) {
      nav.classList.toggle('is-stuck', self.scroll() > 80);
    }
  });
  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-stuck', window.scrollY > 80);
  }, { passive: true });

  /* ---------- language engine: BG / EN / RU (choice persists across pages) ---------- */
  function setLang(l) {
    document.documentElement.lang = l;
    document.querySelectorAll('[data-bg]').forEach(function (el) {
      var v = el.getAttribute('data-' + l) || el.getAttribute('data-bg');
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll('.lang__opt').forEach(function (o) {
      o.classList.toggle('is-active', o.getAttribute('data-l') === l);
    });
    try { localStorage.setItem('besh-lang', l); } catch (err) {}
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  var langBtn = document.getElementById('lang');
  if (langBtn) {
    langBtn.addEventListener('click', function (e) {
      var opt = e.target.closest('.lang__opt');
      if (opt) setLang(opt.getAttribute('data-l'));
    });
  }

  /* ---------- reveal on enter ---------- */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    ScrollTrigger.create({
      trigger: el, start: 'top 82%',
      onEnter: function () { el.classList.add('is-in'); }
    });
  });

  /* ---------- hero: scroll-scrubbed frame sequence — „Обядът, по реда му" (Kling table glide) ---------- */
  var canvas = document.getElementById('heroCanvas');
  var heroIntro = document.getElementById('heroIntro');
  var heroOutro = document.getElementById('heroOutro');
  var heroCue = document.getElementById('heroScroll');
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var FRAMES = 201;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var imgs = new Array(FRAMES);
    var curF = -1, targetF = 0, smoothF = 0;
    function pad(n) { return ('00' + n).slice(-3); }
    function draw(idx) {
      if (idx < 0) idx = 0; if (idx > FRAMES - 1) idx = FRAMES - 1;
      if (idx === curF) return;
      var img = imgs[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      curF = idx;
      var cw = canvas.width, ch = canvas.height, iw = img.naturalWidth, ih = img.naturalHeight;
      var s = Math.max(cw / iw, ch / ih), w = iw * s, h = ih * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }
    function sizeCanvas() {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      curF = -1; draw(Math.round(smoothF));
    }
    for (var i = 0; i < FRAMES; i++) {
      (function (i) {
        var img = new Image();
        img.onload = function () { if (i === Math.round(smoothF)) { curF = -1; draw(i); } };
        img.src = 'assets/seq/f_' + pad(i + 1) + '.jpg';
        imgs[i] = img;
      })(i);
    }
    window.addEventListener('resize', sizeCanvas);
    sizeCanvas();
    ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: function (self) {
        var p = self.progress;
        targetF = p * (FRAMES - 1);
        var io = 1 - clamp01(p / 0.3);
        heroIntro.style.opacity = io;
        heroIntro.style.transform = 'translate(-50%,calc(-50% - ' + (p * 48) + 'px))';
        if (heroCue) heroCue.style.opacity = io;
        var oo = clamp01((p - 0.7) / 0.28);
        heroOutro.style.opacity = oo;
        heroOutro.style.transform = 'translate(-50%,calc(-50% + ' + ((1 - oo) * 28) + 'px))';
      }
    });
    (function tick() {
      smoothF += (targetF - smoothF) * 0.18;
      draw(Math.round(smoothF));
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- discipline: pinned horizontal (десктоп) / естествено плъзгане (телефон) ---------- */
  var track = document.getElementById('discTrack');
  if (track && window.matchMedia('(min-width:761px)').matches) {
    var getShift = function () { return track.scrollWidth - window.innerWidth + 80; };
    gsap.to(track, {
      x: function () { return -getShift(); },
      ease: 'none',
      scrollTrigger: {
        trigger: '.discipline',
        start: 'top top',
        end: function () { return '+=' + getShift(); },
        pin: true, scrub: 1, invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
  }

  /* ---------- dishes: „Подреди си таблата" — five tray frames, scroll-crossfade ---------- */
  var traySteps = document.getElementById('traySteps');
  if (traySteps) {
    var tslides = Array.prototype.slice.call(traySteps.querySelectorAll('.tray-step'));
    var TACTS = [
      ['1 / 4',
        { bg: 'Започни · Салата', en: 'Start · Salad', ru: 'Начни · Салат' },
        { bg: 'Снежанка салата', en: 'Snezhanka yogurt salad', ru: 'Салат «Снежанка»' },
        { bg: '150гр. · 169кал. · 2,70 € / 5,28 лв', en: '150g · 169 kcal · 2,70 € / 5,28 лв', ru: '150 г · 169 ккал · 2,70 € / 5,28 лв' }],
      ['2 / 4',
        { bg: 'Добави · Супа', en: 'Add · Soup', ru: 'Добавь · Суп' },
        { bg: 'Крем супа от тиква с ементал', en: 'Pumpkin cream soup with emmental', ru: 'Тыквенный крем-суп с эмменталем' },
        { bg: '300гр. · 393кал. · 1,99 € / 3,90 лв', en: '300g · 393 kcal · 1,99 € / 3,90 лв', ru: '300 г · 393 ккал · 1,99 € / 3,90 лв' }],
      ['3 / 4',
        { bg: 'Основното', en: 'The main', ru: 'Основное' },
        { bg: 'Гювеч с телешко месо', en: 'Veal guvech', ru: 'Гювеч из телятины' },
        { bg: '350гр. · 447кал. · 5,20 € / 10,17 лв', en: '350g · 447 kcal · 5,20 € / 10,17 лв', ru: '350 г · 447 ккал · 5,20 € / 10,17 лв' }],
      ['4 / 4',
        { bg: 'Завърши · Десерт', en: 'Finish · Dessert', ru: 'Заверши · Десерт' },
        { bg: 'Макарони на фурна', en: 'Baked sweet macaroni', ru: 'Запечённые сладкие макароны' },
        { bg: '200гр. · 479кал. · 2,50 € / 4,89 лв', en: '200g · 479 kcal · 2,50 € / 4,89 лв', ru: '200 г · 479 ккал · 2,50 € / 4,89 лв' }]
    ];
    var TSTOPS = [0, 0.26, 0.52, 0.78];
    var tpStep = document.getElementById('tpStep');
    var tpCat = document.getElementById('tpCat');
    var tpName = document.getElementById('tpName');
    var tpInfo = document.getElementById('tpInfo');
    var tAct = -1;
    function setTrayPanel(i) {
      var l = document.documentElement.lang || 'bg';
      var a = TACTS[i];
      function put(el, o) {
        el.textContent = o[l] || o.bg;
        el.setAttribute('data-bg', o.bg); el.setAttribute('data-en', o.en); el.setAttribute('data-ru', o.ru);
      }
      tpStep.textContent = a[0];
      put(tpCat, a[1]); put(tpName, a[2]); put(tpInfo, a[3]);
    }
    function goAct(i) {
      if (i === tAct) return;
      tAct = i;
      tslides.forEach(function (s, idx) { s.classList.toggle('is-on', idx === i); });
      setTrayPanel(i);
    }
    goAct(0);
    ScrollTrigger.create({
      trigger: '.dishes',
      start: 'top top',
      end: '+=280%',
      pin: true, scrub: true, anticipatePin: 1,
      onUpdate: function (self) {
        var p = self.progress;
        var i = 0;
        TSTOPS.forEach(function (st, idx) { if (p >= st) i = idx; });
        goAct(i);
      }
    });
  }

  /* ---------- „Светлините на София": пътят се изчертава, обектите пламват ---------- */
  var jrWrap = document.getElementById('jr');
  var jrPath = document.getElementById('jrPath');
  if (jrWrap && jrPath) {
    var jrGlowLine = document.getElementById('jrGlowLine');
    var jrRoad = document.getElementById('jrRoad');
    var jrParticlesG = document.getElementById('jrParticles');
    var jrStops = gsap.utils.toArray('#jr .jr__stop');
    var jrMob = window.matchMedia('(max-width:760px)');
    var jrStill = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var jrLen = 0;      /* пълна дължина на пътя (viewBox единици) */
    var jrLit = 0;      /* докъде е изчертан в момента */
    var jrMarks = [];   /* праг (progress 0..1) за всеки възел */
    var jrDrawnP = 0;   /* текущ прогрес на изчертаването */

    /* изчертава до прогрес p и запалва подминатите възли */
    function jrDrawTo(p) {
      /* overshoot: доливаме линията преди края на тригера — последният възел
         лежи на самия край на пътя и иначе остава недостижим при нормален скрол */
      p = Math.min(1, p * 1.12);
      jrDrawnP = p;
      jrLit = jrLen * p;
      var off = jrLen - jrLit;
      jrPath.style.strokeDashoffset = off;
      jrPath.style.visibility = p > 0.002 ? '' : 'hidden';
      if (jrGlowLine) {
        jrGlowLine.style.strokeDashoffset = off;
        jrGlowLine.style.visibility = p > 0.002 ? '' : 'hidden';
      }
      for (var i = 0; i < jrStops.length; i++) {
        jrStops[i].classList.toggle('is-lit', p >= jrMarks[i] - 0.004);
      }
    }

    /* избира кривата за екрана (десктоп/мобилно), позиционира
       възлите в проценти и мери праговете им по дължината на пътя */
    function jrBuild() {
      var mob = jrMob.matches;
      var d = jrPath.getAttribute(mob ? 'data-d-mobile' : 'data-d-desktop');
      jrPath.setAttribute('d', d);
      if (jrRoad) jrRoad.setAttribute('d', d);
      if (jrGlowLine) jrGlowLine.setAttribute('d', d);
      jrLen = jrPath.getTotalLength();

      var pts = jrStops.map(function (s) {
        var x = parseFloat((mob && s.getAttribute('data-xm')) || s.getAttribute('data-x'));
        var y = parseFloat((mob && s.getAttribute('data-ym')) || s.getAttribute('data-y'));
        s.style.left = (x / 720 * 100) + '%';
        s.style.top = (y / 1560 * 100) + '%';
        return { x: x, y: y };
      });

      /* праг на възела = мястото, където пътят минава най-близо до него */
      var best = pts.map(function () { return { d2: Infinity, at: 0 }; });
      var STEPS = 300;
      for (var i = 0; i <= STEPS; i++) {
        var at = jrLen * i / STEPS;
        var pt = jrPath.getPointAtLength(at);
        for (var k = 0; k < pts.length; k++) {
          var dx = pt.x - pts[k].x, dy = pt.y - pts[k].y;
          var d2 = dx * dx + dy * dy;
          if (d2 < best[k].d2) { best[k].d2 = d2; best[k].at = at; }
        }
      }
      jrMarks = best.map(function (b) { return b.at / jrLen; });

      jrPath.style.strokeDasharray = jrLen;
      if (jrGlowLine) jrGlowLine.style.strokeDasharray = jrLen;
      jrDrawTo(jrStill ? 1 : jrDrawnP);
    }

    /* частици: няколко светли точки пътуват по вече изчертаната част */
    var jrDots = [];
    if (!jrStill && jrParticlesG) {
      [{ r: 3.2, o: 0.9, v: 9000, ph: 0 },
       { r: 2.4, o: 0.6, v: 12500, ph: 0.37 },
       { r: 2.8, o: 0.75, v: 10700, ph: 0.64 },
       { r: 2.0, o: 0.5, v: 14500, ph: 0.82 }].forEach(function (c) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        el.setAttribute('r', c.r);
        el.setAttribute('class', 'jr__spark');
        el.setAttribute('opacity', '0');
        jrParticlesG.appendChild(el);
        jrDots.push({ el: el, v: c.v, ph: c.ph, o: c.o });
      });
    }
    var jrRaf = 0;
    function jrFlow(ts) {
      for (var i = 0; i < jrDots.length; i++) {
        var f = jrDots[i];
        if (jrLit < 60) { f.el.setAttribute('opacity', '0'); continue; }
        var t = ((ts / f.v) + f.ph) % 1;
        var p = jrPath.getPointAtLength(t * jrLit);
        f.el.setAttribute('cx', p.x);
        f.el.setAttribute('cy', p.y);
        /* меко гаснене към върха на линията и при тръгване */
        f.el.setAttribute('opacity', (f.o * Math.min(1, t * 8, (1 - t) * 6)).toFixed(3));
      }
      jrRaf = requestAnimationFrame(jrFlow);
    }

    /* --- кино слоят: 121 кадъра от утринното камионче (Kling) --- */
    var jrCine = document.getElementById('jrCine');
    var jrCtx = jrCine ? jrCine.getContext('2d') : null;
    var JRF = 121;
    var jrImgs = new Array(JRF);
    var jrLoaded = false, jrCur = -1, jrTarget = 0, jrSmooth = 0, jrCineRaf = 0;
    function jrPad(n) { return ('00' + n).slice(-3); }
    function jrCineDraw(idx) {
      if (!jrCtx) return;
      if (idx < 0) idx = 0; if (idx > JRF - 1) idx = JRF - 1;
      if (idx === jrCur) return;
      var img = jrImgs[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      jrCur = idx;
      var cw = jrCine.width, ch = jrCine.height, iw = img.naturalWidth, ih = img.naturalHeight;
      var sc = Math.max(cw / iw, ch / ih), w = iw * sc, h = ih * sc;
      jrCtx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }
    function jrCineSize() {
      if (!jrCine) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      jrCine.width = Math.round(jrCine.clientWidth * dpr);
      jrCine.height = Math.round(jrCine.clientHeight * dpr);
      jrCur = -1; jrCineDraw(Math.round(jrSmooth));
    }
    function jrCineLoad() {
      if (jrLoaded || !jrCine) return;
      jrLoaded = true;
      for (var fi = 0; fi < JRF; fi++) {
        (function (fi) {
          var img = new Image();
          img.onload = function () { if (fi === Math.round(jrSmooth)) { jrCur = -1; jrCineDraw(fi); } };
          img.src = 'assets/seq-story/f_' + jrPad(fi + 1) + '.jpg';
          jrImgs[fi] = img;
        })(fi);
      }
      window.addEventListener('resize', jrCineSize);
      jrCineSize();
      if (!jrStill) {
        (function jrCineTick() {
          jrSmooth += (jrTarget - jrSmooth) * 0.18;
          jrCineDraw(Math.round(jrSmooth));
          jrCineRaf = requestAnimationFrame(jrCineTick);
        })();
      } else {
        /* намалено движение: един спокоен среден кадър */
        jrTarget = jrSmooth = 60;
      }
    }
    /* кадрите тръгват да се теглят чак когато секцията наближи (пестим старта) */
    ScrollTrigger.create({
      trigger: '#map', start: 'top 250%',
      once: true, onEnter: jrCineLoad
    });
    /* киното следва скрола под ЦЕЛИЯ маршрут — ръчен "pin" с живи измервания
       (GSAP pin/sticky се разместват, когато lazy снимки пораснат страницата) */
    var jrCineWrap = document.querySelector('.jr-cine');
    var jrMapSec = document.getElementById('map');
    if (jrCineWrap && jrMapSec) {
      var jrFollow = function () {
        var r = jrMapSec.getBoundingClientRect();
        var vh = window.innerHeight;
        /* колко да слезе слоят, за да стои в екрана, докато секцията минава */
        var yOff = Math.min(Math.max(0, -r.top), Math.max(0, r.height - vh));
        jrCineWrap.style.transform = 'translate3d(0,' + yOff.toFixed(1) + 'px,0)';
      };
      window.addEventListener('scroll', jrFollow, { passive: true });
      window.addEventListener('resize', jrFollow);
      jrFollow();
    }

    jrBuild();

    if (!jrStill) {
      /* скръб: линията следва скрола, без pin */
      ScrollTrigger.create({
        trigger: '#map', start: 'top 62%', end: 'bottom 78%', scrub: 0.5,
        onUpdate: function (self) { jrDrawTo(self.progress); jrTarget = self.progress * (JRF - 1); }
      });
      /* частиците текат само докато секцията е на екрана */
      ScrollTrigger.create({
        trigger: jrWrap, start: 'top bottom', end: 'bottom top',
        onToggle: function (self) {
          if (self.isActive && jrDots.length && !jrRaf) jrRaf = requestAnimationFrame(jrFlow);
          else if (!self.isActive && jrRaf) { cancelAnimationFrame(jrRaf); jrRaf = 0; }
        }
      });
    }

    /* при смяна на брейкпойнта: нова крива, нови позиции и прагове */
    var jrOnMQ = function () { jrBuild(); ScrollTrigger.refresh(); };
    if (jrMob.addEventListener) jrMob.addEventListener('change', jrOnMQ);
    else if (jrMob.addListener) jrMob.addListener(jrOnMQ);
  }

  /* ---------- weekly promos (editable in promo-data.js) ---------- */
  var WP = window.BESHAMEL_PROMOS;
  if (WP && document.querySelector('.js-wpromos')) {
    document.querySelectorAll('.js-wpweek').forEach(function (el) { el.textContent = WP.week; });
    document.querySelectorAll('.js-wpromos').forEach(function (box) {
      WP.items.forEach(function (it) {
        var l = document.documentElement.lang || 'bg';
        var card = document.createElement('article');
        card.className = 'dishcard';
        var img = document.createElement('img');
        img.src = 'assets/menu/' + it.img + '.webp'; img.alt = it.bg; img.loading = 'lazy';
        var deal = document.createElement('span');
        deal.className = 'deal'; deal.textContent = it.deal;
        function trio(el, vBg, vEn, vRu) {
          var o = { bg: vBg, en: vEn || vBg, ru: vRu || vBg };
          el.textContent = o[l] || o.bg;
          el.setAttribute('data-bg', o.bg); el.setAttribute('data-en', o.en); el.setAttribute('data-ru', o.ru);
          return el;
        }
        var cat = trio(document.createElement('span'), it.catBg, it.catEn, it.catRu);
        cat.className = 'wcat';
        var b = trio(document.createElement('b'), it.bg, it.en, it.ru);
        var info = document.createElement('span');
        info.className = 'info'; info.textContent = it.info;
        card.appendChild(img); card.appendChild(deal); card.appendChild(cat);
        card.appendChild(b); card.appendChild(info);
        box.appendChild(card);
      });
    });
  }

  /* ---------- floating CTA (design-system signature) ---------- */
  if (!document.querySelector('.float-cta')) {
    var fc = document.createElement('a');
    fc.className = 'float-cta';
    fc.href = window.BESHAMEL_ORDERS_URL || 'products.html';
    fc.setAttribute('aria-label', 'Дневно меню');
    fc.setAttribute('title', 'Дневно меню');
    fc.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3"/><path d="M6 12v9"/><path d="M18 3c-2 0-3 2-3 5s1 4 3 4"/><path d="M18 12v9"/></svg>';
    document.body.appendChild(fc);
  }

  /* ---------- product slider — pinned scroll rail (desktop); native swipe on mobile ---------- */
  var strack = document.querySelector('.pslider__track');
  if (strack && window.matchMedia('(min-width:761px)').matches) {
    var swrap = strack.closest('.pslider');
    var ssec = strack.closest('section');
    var sShift = function () { return Math.max(0, strack.scrollWidth - swrap.clientWidth); };
    gsap.to(strack, {
      x: function () { return -sShift(); },
      ease: 'none',
      scrollTrigger: {
        trigger: ssec, start: 'top 8%',
        end: function () { return '+=' + (sShift() + 140); },
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
      }
    });
  }

  /* ---------- stats count up on reveal ---------- */
  document.querySelectorAll('.stat b').forEach(function (el) {
    var m = /^(\d+)(\+|%)?$/.exec(el.textContent.trim());
    if (!m) return;
    var target = parseInt(m[1], 10), suf = m[2] || '';
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () {
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1100);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suf;
          if (p < 1) { requestAnimationFrame(step); } else { el.textContent = target + suf; }
        }
        requestAnimationFrame(step);
      }
    });
  });

  /* ---------- generic modal (data-modal-open / data-modal-close) ---------- */
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open]');
    if (opener) {
      var m = document.getElementById(opener.getAttribute('data-modal-open'));
      if (m) { m.hidden = false; document.body.style.overflow = 'hidden'; }
      return;
    }
    if (e.target.closest('[data-modal-close]')) {
      var open = document.querySelector('.modal:not([hidden])');
      if (open) { open.hidden = true; document.body.style.overflow = ''; }
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var open = document.querySelector('.modal:not([hidden])');
      if (open) { open.hidden = true; document.body.style.overflow = ''; }
    }
  });


  /* ---------- online orders links (адресът е в promo-data.js) ---------- */
  if (window.BESHAMEL_ORDERS_URL) {
    document.querySelectorAll('.js-order-link').forEach(function (a) {
      a.href = window.BESHAMEL_ORDERS_URL;
    });
  }
  /* ---------- premium: scroll progress bar ---------- */
  var prog = document.createElement('div');
  prog.className = 'scroll-prog';
  document.body.appendChild(prog);
  function updateProg() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProg, { passive: true });
  window.addEventListener('resize', updateProg);
  updateProg();

  /* ---------- premium: subtle magnetic primary buttons (desktop only) ---------- */
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.btn--solid').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var my = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        btn.style.transform = 'translate(' + (mx * 4).toFixed(1) + 'px,' + (my * 4 - 2).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- мобилно меню: бургер + пълноекранен слой (сглобява се от nav линковете) ---------- */
  var navLinksBox = document.querySelector('.nav__links');
  var navRight = document.querySelector('.nav__right');
  if (navLinksBox && navRight && !document.querySelector('.nav__burger')) {
    var burger = document.createElement('button');
    burger.className = 'nav__burger';
    burger.setAttribute('aria-label', 'Меню');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    navRight.appendChild(burger);

    var mnav = document.createElement('div');
    mnav.className = 'mnav';
    var inner = document.createElement('div');
    inner.className = 'mnav__inner';
    navLinksBox.querySelectorAll('a').forEach(function (a) {
      inner.appendChild(a.cloneNode(true)); /* клонът носи data-bg/en/ru → триезичен */
    });
    var dailyBtn = document.querySelector('.nav__right .btn--pill');
    if (dailyBtn) {
      var dc = dailyBtn.cloneNode(true);
      dc.className = 'mnav__daily';
      inner.appendChild(dc);
    }
    var orderLink = document.querySelector('.nav__order');
    if (orderLink) {
      var oc = orderLink.cloneNode(true);
      oc.className = 'mnav__order js-order-link';
      if (window.BESHAMEL_ORDERS_URL) oc.href = window.BESHAMEL_ORDERS_URL;
      inner.appendChild(oc);
    }
    mnav.appendChild(inner);
    document.body.appendChild(mnav);

    function setMenu(open) {
      mnav.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { setMenu(!mnav.classList.contains('is-open')); });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a') || e.target === mnav) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* apply the saved language after all dynamic content is built */
  var savedLang = null;
  try { savedLang = localStorage.getItem('besh-lang'); } catch (err) {}
  if (savedLang && savedLang !== 'bg') setLang(savedLang);

  /* късно заредените (lazy) снимки растат страницата → опреснявай позициите на тригерите */
  var lazyRefreshT = 0;
  document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
    if (img.complete) return;
    img.addEventListener('load', function () {
      clearTimeout(lazyRefreshT);
      lazyRefreshT = setTimeout(function () { ScrollTrigger.refresh(); }, 250);
    }, { once: true });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
