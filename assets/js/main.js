(function () {
  'use strict';

  /* ---------- Header: borda ao fazer scroll ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () { header && header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu móvel ---------- */
  var menuBtn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Link ativo na navegação ---------- */
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)')) : [];
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var a = byId[entry.target.id];
        if (!a) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navObserver.observe(el);
    });
  }

  /* ---------- Diagrama do topo: com movimento reduzido, os tokens param e saem ---------- */
  var reduceMotionEarly = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotionEarly) {
    document.querySelectorAll('svg.bpmn').forEach(function (svg) {
      if (svg.pauseAnimations) svg.pauseAnimations();
      svg.querySelectorAll('.bpmn-token').forEach(function (t) { t.remove(); });
    });
  }

  /* ---------- Bolhas de sabão ----------
     Cada contentor [data-bubbles] solta bolhas a partir de data-origin ("x y" em %).
     data-size (px), data-spread e data-rise (frações do contentor) são intervalos "mín máx";
     data-fill preenche as bolhas com a cor do traço.
     As bolhas enchem, sobem com um balanço lateral, deformam-se ligeiramente
     e acabam por desvanecer ou rebentar. */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = typeof Element !== 'undefined' && 'animate' in Element.prototype;

  function rand(min, max) { return min + Math.random() * (max - min); }
  function nums(value, fallback) {
    var parts = (value || '').trim().split(/\s+/).map(Number);
    return parts.length === fallback.length && parts.every(isFinite) ? parts : fallback;
  }

  function BubbleField(el) {
    this.el = el;
    this.origin = nums(el.dataset.origin, [50, 50]);
    this.size = nums(el.dataset.size, [10, 40]);
    this.spread = nums(el.dataset.spread, [-0.35, 0.4]);
    this.rise = nums(el.dataset.rise, [0.3, 0.7]);
    this.colors = (el.dataset.palette || 'blue').split(/\s+/).map(function (c) { return 'var(--doo-' + c + ')'; });
    this.fill = 'fill' in el.dataset; // bolhas cheias em vez de anéis
    this.alive = [];
    this.running = false;
    this.timer = null;
  }

  BubbleField.prototype.spawn = function (progress) {
    var box = this.el.getBoundingClientRect();
    if (!box.width || this.alive.length > 10) return;

    var d = this.size[0] + (this.size[1] - this.size[0]) * Math.pow(Math.random(), 1.8);
    var b = document.createElement('span');
    b.className = 'bubble';
    b.style.width = b.style.height = d + 'px';
    b.style.borderWidth = (d / 4) + 'px';
    b.style.setProperty('--c', this.colors[Math.floor(Math.random() * this.colors.length)]);
    if (this.fill) b.style.background = 'var(--c)';
    this.el.appendChild(b);

    var ox = box.width * (this.origin[0] + rand(-2, 2)) / 100 - d / 2;
    var oy = box.height * (this.origin[1] + rand(-2, 2)) / 100 - d / 2;
    var driftX = box.width * rand(this.spread[0], this.spread[1]);
    var rise = box.height * rand(this.rise[0], this.rise[1]);
    var sway = rand(6, 18);
    var cycles = rand(0.8, 2);
    var phase = rand(0, Math.PI * 2);
    var wobble = rand(2.5, 4.5);
    var pops = Math.random() < 0.55;
    var duration = rand(5500, 9500) + d * 60;

    var frames = [];
    var steps = 30;
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var push = 1 - Math.pow(1 - t, 1.8);                       // sai do soprador e abranda
      var x = ox + driftX * push + Math.sin(t * cycles * Math.PI * 2 + phase) * sway * t;
      var y = oy - rise * (0.55 * push + 0.45 * t);               // flutua para cima
      var grow = t < 0.12 ? 0.15 + 0.95 * (t / 0.12) : 1 + 0.1 * Math.max(0, 0.2 - t); // enche
      var w = 0.045 * Math.sin(t * wobble * Math.PI * 2 + phase);
      var opacity = t < 0.06 ? t / 0.06 : 1;
      if (pops) { if (t > 0.96) { grow *= 1.3; opacity = 0; } }
      else if (t > 0.78) opacity = Math.max(0, (1 - t) / 0.22);
      frames.push({
        transform: 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' +
          (grow * (1 + w)).toFixed(3) + ',' + (grow * (1 - w)).toFixed(3) + ')',
        opacity: opacity * 0.95
      });
    }

    var anim = b.animate(frames, { duration: duration, easing: 'linear', fill: 'both' });
    if (progress) anim.currentTime = duration * progress;
    if (!this.running) anim.pause();
    var alive = this.alive;
    alive.push(anim);
    anim.onfinish = function () {
      b.remove();
      alive.splice(alive.indexOf(anim), 1);
    };
  };

  BubbleField.prototype.schedule = function () {
    var self = this;
    this.timer = setTimeout(function () {
      if (!self.running) return;
      var burst = Math.random() < 0.3 ? Math.round(rand(2, 4)) : 1; // um sopro pode soltar várias
      for (var i = 0; i < burst; i++) setTimeout(function () { if (self.running) self.spawn(); }, i * rand(110, 240));
      self.schedule();
    }, rand(600, 1500));
  };

  BubbleField.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.alive.forEach(function (a) { a.play(); });
    this.schedule();
  };

  BubbleField.prototype.stop = function () {
    this.running = false;
    clearTimeout(this.timer);
    this.alive.forEach(function (a) { a.pause(); });
  };

  if (!reduceMotion && canAnimate) {
    document.querySelectorAll('[data-bubbles]').forEach(function (el) {
      var field = new BubbleField(el);
      el.classList.add('bubbles-live');
      field.running = true;
      for (var i = 0; i < 5; i++) field.spawn(rand(0.1, 0.8)); // a cena já começa em movimento
      field.running = false;

      var inView = !('IntersectionObserver' in window);
      var update = function () { inView && !document.hidden ? field.start() : field.stop(); };
      if (!inView) {
        new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; update(); }).observe(el);
      }
      document.addEventListener('visibilitychange', update);
      update();
    });
  }

  /* ---------- Cenas ----------
     Cada secção do <main> é uma cena. A passagem de uma secção para a seguinte é o gatilho:
     - ao entrar, os elementos .reveal da cena animam em sequência (títulos palavra a palavra);
     - ao sair, a cena sobe e esbate-se ligeiramente, ligada ao scroll;
     - as secções creme abrem de cartão arredondado para a largura total e a faixa azul cresce. */
  var scenes = Array.prototype.slice.call(document.querySelectorAll('main > section'));
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var escapeHtml = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  if (!reduceMotion) {
    document.querySelectorAll('main h2.display-l').forEach(function (h) {
      var text = h.textContent.trim().replace(/\s+/g, ' ');
      h.setAttribute('aria-label', text);
      h.classList.add('split');
      h.innerHTML = text.split(' ').map(function (word, i) {
        return '<span class="w" aria-hidden="true"><span style="--wi:' + i + '">' + escapeHtml(word) + '</span></span>';
      }).join(' ');
    });
  }

  var show = function (el) { el.classList.add(el.classList.contains('steps') ? 'is-drawn' : 'is-visible'); };
  var canObserve = 'IntersectionObserver' in window && !reduceMotion;
  // Elementos longe do ecrã quando a cena começa entram sozinhos, quando lá chegarem
  var lateObserver = canObserve && new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.style.setProperty('--delay', '0ms'); show(entry.target); lateObserver.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  var playScene = function (scene) {
    var limit = window.innerHeight * 1.05;
    var i = 0;
    scene.querySelectorAll('.reveal, .steps').forEach(function (el) {
      if (el.getBoundingClientRect().top < limit) {
        el.style.setProperty('--delay', (Math.min(i++, 7) * 110) + 'ms');
        show(el);
      } else {
        lateObserver.observe(el);
      }
    });
  };

  if (canObserve) {
    var sceneObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { playScene(entry.target); sceneObserver.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -22% 0px' });
    scenes.forEach(function (scene) { sceneObserver.observe(scene); });
  } else {
    document.querySelectorAll('.reveal, .steps').forEach(show);
  }

  if (!reduceMotion) {
    document.documentElement.classList.add('scene-js');
    var sunken = scenes.filter(function (s) { return s.classList.contains('section--sunken'); });
    var band = document.querySelector('.band');
    var sceneTicking = false;
    var drawScenes = function () {
      sceneTicking = false;
      var vh = window.innerHeight;
      scenes.forEach(function (scene, i) {
        if (i === scenes.length - 1) return; // a última cena não tem para onde sair
        var r = scene.getBoundingClientRect();
        var inner = scene.firstElementChild;
        if (!inner || r.bottom < -vh || r.top > vh * 2) return;
        var out = clamp((vh * 0.55 - r.bottom) / (vh * 0.55));
        inner.style.opacity = out ? (1 - out * 0.55).toFixed(3) : '';
        inner.style.translate = out ? '0 ' + (-out * 56).toFixed(1) + 'px' : '';
      });
      var maxInset = Math.min(48, window.innerWidth * 0.04);
      sunken.forEach(function (s) {
        var open = easeOut(clamp((vh - s.getBoundingClientRect().top) / (vh * 0.6)));
        s.style.setProperty('--inset', ((1 - open) * maxInset).toFixed(1) + 'px');
        s.style.setProperty('--round', ((1 - open) * 40).toFixed(1) + 'px');
      });
      if (band) {
        var grow = easeOut(clamp((vh - band.getBoundingClientRect().top) / (vh * 0.7)));
        band.style.setProperty('--grow', (0.92 + 0.08 * grow).toFixed(4));
      }
    };
    window.addEventListener('scroll', function () {
      if (!sceneTicking) { sceneTicking = true; requestAnimationFrame(drawScenes); }
    }, { passive: true });
    window.addEventListener('resize', drawScenes);
    drawScenes();
  }

  /* ---------- Paralaxe suave ([data-parallax] = velocidade relativa ao scroll) ---------- */
  var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (parallax.length && !reduceMotion) {
    var ticking = false;
    var moveParallax = function () {
      ticking = false;
      var mid = window.innerHeight / 2;
      parallax.forEach(function (el) {
        var box = el.parentElement.getBoundingClientRect();
        if (box.bottom < -200 || box.top > window.innerHeight + 200) return;
        var offset = (box.top + box.height / 2 - mid) * Number(el.dataset.parallax);
        el.style.translate = '0 ' + (-offset).toFixed(1) + 'px';
      });
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(moveParallax); }
    }, { passive: true });
    window.addEventListener('resize', moveParallax);
    moveParallax();
  }

  /* ---------- Botões: bolha a partir do ponto de clique ---------- */
  if (!reduceMotion) {
    document.addEventListener('pointerdown', function (e) {
      var btn = e.target.closest && e.target.closest('.btn');
      if (!btn) return;
      var box = btn.getBoundingClientRect();
      var size = Math.max(box.width, box.height) * 2.2;
      var bubble = document.createElement('span');
      bubble.className = 'btn-bubble';
      bubble.style.width = bubble.style.height = size + 'px';
      bubble.style.left = (e.clientX - box.left - size / 2) + 'px';
      bubble.style.top = (e.clientY - box.top - size / 2) + 'px';
      btn.appendChild(bubble);
      bubble.addEventListener('animationend', function () { bubble.remove(); });
    });
  }

  /* ---------- Galeria: ampliar fotos (setas e Esc navegam) ---------- */
  var lightbox = document.querySelector('.lightbox');
  var shots = Array.prototype.slice.call(document.querySelectorAll('.gallery-open'));
  if (lightbox && shots.length && typeof lightbox.showModal === 'function') {
    var lbImg = lightbox.querySelector('img');
    var lbCap = lightbox.querySelector('figcaption');
    var current = 0;
    var showShot = function (i) {
      current = (i + shots.length) % shots.length;
      var b = shots[current];
      lbImg.src = b.dataset.full;
      lbImg.alt = b.querySelector('img').alt;
      lbCap.textContent = b.dataset.caption || '';
      lbCap.hidden = !b.dataset.caption;
    };
    shots.forEach(function (b, i) {
      b.addEventListener('click', function () { showShot(i); lightbox.showModal(); });
    });
    lightbox.addEventListener('click', function (e) {
      var action = e.target.closest('[data-lightbox]');
      if (action) {
        var a = action.dataset.lightbox;
        if (a === 'close') lightbox.close();
        else showShot(current + (a === 'next' ? 1 : -1));
      } else if (e.target === lightbox) {
        lightbox.close(); // clique fora da foto
      }
    });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') showShot(current + 1);
      if (e.key === 'ArrowLeft') showShot(current - 1);
    });
    lightbox.addEventListener('close', function () { shots[current].focus(); });
  }

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
