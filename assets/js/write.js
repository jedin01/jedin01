/* Página /write/: escreve um artigo em Markdown ou prepara uma foto para a galeria
   e abre o GitHub com o ficheiro pronto a guardar. Não há servidor: o GitHub guarda
   o ficheiro e o GitHub Pages republica o site. */
(function () {
  'use strict';

  var app = document.getElementById('write-app');
  if (!app) return;
  var repo = app.dataset.repo;
  var branch = app.dataset.branch || 'main';
  var DRAFT_KEY = 'write-draft-v1';
  var MAX_URL = 7000; // URLs maiores falham no GitHub; nesse caso o texto vai pela área de transferência

  /* ---------- Separadores ---------- */
  var tabs = document.querySelectorAll('[role="tab"]');
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { selectTab(t); }); });
  if (location.hash === '#photo') selectTab(document.getElementById('tab-photo'));

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; });
    }
    return Promise.resolve(false);
  }
  function setStatus(el, msg, ok) {
    el.className = 'form-status ' + (ok ? 'is-success' : 'is-error');
    el.textContent = msg;
  }

  /* ---------- Artigo ---------- */
  var form = document.getElementById('article-form');
  var f = form.elements;
  var status = document.getElementById('article-status');
  var previewTitle = document.getElementById('preview-title');
  var previewBody = document.getElementById('preview-body');

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function slugify(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 8).join('-');
  }
  function yamlString(s) { return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }

  function markdownFile() {
    var tags = f.tags.value.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    var lines = ['---', 'title: ' + yamlString(f.title.value.trim())];
    if (f.description.value.trim()) lines.push('description: ' + yamlString(f.description.value.trim().replace(/\s+/g, ' ')));
    if (tags.length) lines.push('tags: [' + tags.map(yamlString).join(', ') + ']');
    lines.push('lang: ' + f.lang.value);
    if (f.image.value.trim()) lines.push('image: ' + yamlString(f.image.value.trim()));
    lines.push('---', '', f.body.value.trim(), '');
    return lines.join('\n');
  }
  function fileName() {
    return '_posts/' + (f.date.value || today()) + '-' + (slugify(f.title.value) || 'untitled') + '.md';
  }

  function render() {
    previewTitle.textContent = f.title.value.trim() || 'Your title';
    var body = f.body.value.trim();
    if (!body) { previewBody.innerHTML = '<p class="muted">Start writing to see the article here.</p>'; return; }
    if (window.marked) {
      // Pré-visualização local do próprio autor; o site final é gerado pelo GitHub Pages
      previewBody.innerHTML = window.marked.parse(body.replace(/</g, '&lt;'));
    } else {
      previewBody.textContent = body;
    }
  }

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        title: f.title.value, date: f.date.value, lang: f.lang.value, description: f.description.value,
        tags: f.tags.value, image: f.image.value, body: f.body.value
      }));
    } catch (e) {}
  }
  function loadDraft() {
    try {
      var d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (d) Object.keys(d).forEach(function (k) { if (f[k]) f[k].value = d[k]; });
    } catch (e) {}
    if (!f.date.value) f.date.value = today();
  }

  loadDraft();
  render();
  form.addEventListener('input', function () { render(); saveDraft(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!f.title.value.trim() || !f.body.value.trim()) {
      setStatus(status, 'Add a title and some text before publishing.', false);
      (f.title.value.trim() ? f.body : f.title).focus();
      return;
    }
    var content = markdownFile();
    var base = 'https://github.com/' + repo + '/new/' + branch + '?filename=' + encodeURIComponent(fileName());
    var url = base + '&value=' + encodeURIComponent(content);
    if (url.length <= MAX_URL) {
      window.open(url, '_blank', 'noopener');
      setStatus(status, 'GitHub opened with the article ready. Review it and press Commit changes.', true);
    } else {
      copy(content).then(function (ok) {
        window.open(base, '_blank', 'noopener');
        setStatus(status, ok
          ? 'The article is long, so it was copied instead. Paste it into the file on GitHub and press Commit changes.'
          : 'The article is long. Use Copy Markdown, then paste it into the file that opened on GitHub.', ok);
      });
    }
  });

  document.getElementById('article-copy').addEventListener('click', function () {
    copy(markdownFile()).then(function (ok) {
      setStatus(status, ok ? 'Markdown copied, file name: ' + fileName() : 'Could not copy. Select the text manually.', ok);
    });
  });
  document.getElementById('article-clear').addEventListener('click', function () {
    form.reset();
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
    f.date.value = today();
    render();
    setStatus(status, 'Draft cleared.', true);
  });

  /* ---------- Foto ---------- */
  var photo = document.getElementById('photo-form');
  var pf = photo.elements;
  var pstatus = document.getElementById('photo-status');
  photo.addEventListener('submit', function (e) {
    e.preventDefault();
    var file = pf.file.value.trim().replace(/^\/?(assets\/gallery\/)?/, '');
    if (!file || !pf.alt.value.trim()) {
      setStatus(pstatus, 'Add the file name and a description of the photo.', false);
      (file ? pf.alt : pf.file).focus();
      return;
    }
    var entry = '- src: /assets/gallery/' + file + '\n' +
      (pf.caption.value.trim() ? '  caption: ' + yamlString(pf.caption.value.trim()) + '\n' : '') +
      '  alt: ' + yamlString(pf.alt.value.trim()) + '\n';
    copy(entry).then(function (ok) {
      window.open('https://github.com/' + repo + '/edit/' + branch + '/_data/gallery.yml', '_blank', 'noopener');
      setStatus(pstatus, ok
        ? 'Entry copied. Paste it at the end of the file on GitHub and press Commit changes.'
        : 'Could not copy automatically. Add this at the end of the file: ' + entry.replace(/\n/g, ' '), ok);
    });
  });
})();
