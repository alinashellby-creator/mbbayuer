/* =====================================================================
   MAKKA BUYER — app.js
   Собирает секции из data.js и включает поведение интерфейса.
   Править контент здесь не нужно — он весь в data.js.
   ===================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- Telegram: одна ссылка на весь сайт --------------------- */
  $$('[data-tg]').forEach(function (a) {
    a.setAttribute('href', TELEGRAM_URL);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  /* ---------- Как это работает --------------------------------------- */
  var stepsBox = $('#steps');
  if (stepsBox) {
    stepsBox.innerHTML = steps.map(function (s, i) {
      return '<div class="step rv" style="transition-delay:' + (i * 60) + 'ms">' +
               '<div class="num">' + pad(i + 1) + '</div>' +
               '<div class="step__body">' +
                 '<h3 class="step__t">' + esc(s.title) + '</h3>' +
                 '<p class="step__d">' + esc(s.text) + '</p>' +
               '</div>' +
             '</div>';
    }).join('');
  }

  /* ---------- Этапы контроля ----------------------------------------- */
  var controlBox = $('#controlGrid');
  if (controlBox) {
    controlBox.innerHTML = control.map(function (c, i) {
      return '<div class="control__i rv" style="transition-delay:' + (i * 60) + 'ms">' +
               '<div class="num">' + pad(i + 1) + '</div>' +
               '<h3 class="control__t">' + esc(c.title) + '</h3>' +
               '<p class="control__d">' + esc(c.text) + '</p>' +
             '</div>';
    }).join('');
  }

  /* ---------- Преимущества ------------------------------------------- */
  var bensBox = $('#bens');
  if (bensBox) {
    bensBox.innerHTML = benefits.map(function (b, i) {
      return '<div class="ben rv" style="transition-delay:' + (i * 50) + 'ms">' +
               '<div class="num">' + pad(i + 1) + '</div>' +
               '<h3 class="ben__t">' + esc(b.title) + '</h3>' +
               '<p class="ben__d">' + esc(b.text) + '</p>' +
             '</div>';
    }).join('');
  }

  /* ---------- Weekly Privilege --------------------------------------- */
  var weeklySection = $('#weekly');
  if (weeklySection) {
    if (!weeklyOffer) {
      weeklySection.remove();
    } else {
      var body;

      if (weeklyOffer.active === true) {
        /* Конкретная акция недели */
        var meta = '';
        if (weeklyOffer.condition) {
          meta += '<div class="weekly__row"><dt>Условие</dt><dd>' + esc(weeklyOffer.condition) + '</dd></div>';
        }
        if (weeklyOffer.expires) {
          meta += '<div class="weekly__row"><dt>Срок</dt><dd>' + esc(weeklyOffer.expires) + '</dd></div>';
        }
        body =
          (weeklyOffer.number ? '<div class="num">' + esc(weeklyOffer.number) + '</div>' : '') +
          '<h3 class="weekly__title">' + esc(weeklyOffer.title) + '</h3>' +
          (weeklyOffer.description ? '<p class="weekly__desc">' + esc(weeklyOffer.description) + '</p>' : '') +
          (meta ? '<dl class="weekly__meta">' + meta + '</dl>' : '') +
          '<div class="weekly__cta"><a class="btn" href="#">' +
            esc(weeklyOffer.cta || 'Воспользоваться предложением') +
            '<span class="btn__arrow" aria-hidden="true">&#8594;</span></a></div>';
      } else {
        /* Отсылка в Telegram */
        body =
          '<h3 class="weekly__title">' + esc(weeklyOffer.teaserTitle || 'Смотрите в Telegram') + '</h3>' +
          '<p class="weekly__desc">' + esc(weeklyOffer.teaserText || '') + '</p>' +
          '<div class="weekly__cta"><a class="btn" href="#">' +
            esc(weeklyOffer.teaserCta || 'Следить в Telegram') +
            '<span class="btn__arrow" aria-hidden="true">&#8594;</span></a></div>';
      }

      $('#weeklyBody').innerHTML = body;

      var wBtn = $('#weeklyBody .btn');
      wBtn.setAttribute('href', TELEGRAM_URL);
      wBtn.setAttribute('target', '_blank');
      wBtn.setAttribute('rel', 'noopener');
    }
  }

  /* ---------- FAQ ----------------------------------------------------- */
  var faqBox = $('#faqList');
  if (faqBox) {
    faqBox.innerHTML = faq.map(function (item, i) {
      var id = 'faq-a-' + i;
      var qid = 'faq-q-' + i;
      return '<div class="faq__i">' +
               '<button class="faq__q" type="button" id="' + qid + '" aria-expanded="false" aria-controls="' + id + '">' +
                 '<span>' + esc(item.q) + '</span>' +
                 '<span class="faq__sign" aria-hidden="true"></span>' +
               '</button>' +
               '<div class="faq__a" id="' + id + '" data-open="false" role="region" aria-labelledby="' + qid + '">' +
                 '<div><p>' + esc(item.a) + '</p></div>' +
               '</div>' +
             '</div>';
    }).join('');

    faqBox.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq__q');
      if (!btn) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      $$('.faq__q', faqBox).forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        document.getElementById(b.getAttribute('aria-controls')).setAttribute('data-open', 'false');
      });
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        document.getElementById(btn.getAttribute('aria-controls')).setAttribute('data-open', 'true');
      }
    });
  }

  /* ---------- Отзывы --------------------------------------------------- */
  var revSection = $('#reviews');
  if (revSection) {
    if (!reviews.length) {
      revSection.remove();
      $$('a[href="#reviews"]').forEach(function (a) {
        var li = a.closest('li');
        (li || a).remove();
      });
    } else {
      $('#revGrid').innerHTML = reviews.map(function (r, i) {
        var body = '';
        if (r.image) {
          body += '<figure class="rev__shot"><button type="button" data-img="' + esc(r.image) + '" ' +
                  'aria-label="Открыть отзыв полностью">' +
                  '<img src="' + esc(r.image) + '" alt="Отзыв клиента' + (r.name ? ', ' + esc(r.name) : '') + '" loading="lazy">' +
                  '</button></figure>';
        }
        if (r.text) {
          body += '<p class="rev__text' + (r.featured ? '' : ' is-clamped') + '">' + esc(r.text) + '</p>' +
                  '<button class="rev__more" type="button" data-rev="' + i + '">Читать полностью</button>';
        }
        var meta = '';
        if (r.name || r.city || r.date) {
          meta = '<div class="rev__meta">' +
                   (r.name ? '<span class="rev__name">' + esc(r.name) + '</span>' : '') +
                   '<span class="rev__place">' + esc([r.city, r.date].filter(Boolean).join(' · ')) + '</span>' +
                 '</div>';
        }
        return '<article class="rev rv' + (r.featured ? ' rev--big' : '') + '" ' +
               'style="transition-delay:' + Math.min(i * 60, 240) + 'ms">' + body + meta + '</article>';
      }).join('');

      /* Убираем «Читать полностью» там, где текст и так помещается целиком.
         Вызываем несколькими путями: в фоновой вкладке requestAnimationFrame
         может не сработать, и кнопка осталась бы висеть без надобности. */
      var trimMore = function () {
        $$('.rev').forEach(function (card) {
          var text = $('.rev__text', card);
          var more = $('.rev__more', card);
          if (!text || !more) return;
          if (!text.classList.contains('is-clamped') || text.scrollHeight <= text.clientHeight + 2) more.remove();
        });
      };
      requestAnimationFrame(trimMore);
      setTimeout(trimMore, 400);
      window.addEventListener('load', trimMore);
    }
  }

  /* ---------- Фотоотчёты и реальные заказы ---------------------------- */
  function shotHtml(r, i) {
    return '<figure class="shot rv' + (r.wide ? ' shot--wide' : '') + '" ' +
           'style="transition-delay:' + Math.min(i * 60, 240) + 'ms">' +
             '<button type="button" data-img="' + esc(r.src) + '" aria-label="Открыть фото крупнее">' +
               '<img src="' + esc(r.src) + '" alt="' + esc(r.caption || 'Фотоотчёт по заказу') + '" loading="lazy">' +
             '</button>' +
             (r.caption ? '<figcaption>' + esc(r.caption) + '</figcaption>' : '') +
           '</figure>';
  }

  var ctrlGallery = $('#controlGallery');
  var ordersSection = $('#orders');
  var firstFour = reports.slice(0, 4);
  var rest = reports.slice(4);

  if (ctrlGallery) {
    if (firstFour.length) ctrlGallery.innerHTML = firstFour.map(shotHtml).join('');
    else ctrlGallery.remove();
  }
  if (ordersSection) {
    if (rest.length) $('#ordersGrid').innerHTML = rest.map(shotHtml).join('');
    else ordersSection.remove();
  }

  /* ---------- Модалка: полный отзыв и фото ---------------------------- */
  var modal = $('#modal');
  var modalBox = $('#modalBox');
  var lastFocus = null;

  function openModal(html, isImage) {
    modalBox.className = 'modal__box' + (isImage ? ' modal__box--img' : '');
    modalBox.innerHTML = html;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lastFocus = document.activeElement;
    $('#modalClose').focus();
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modalBox.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var imgBtn = e.target.closest('[data-img]');
    if (imgBtn) {
      openModal('<img src="' + esc(imgBtn.getAttribute('data-img')) + '" alt="">', true);
      return;
    }
    var moreBtn = e.target.closest('[data-rev]');
    if (moreBtn) {
      var r = reviews[+moreBtn.getAttribute('data-rev')];
      openModal(
        '<p class="modal__text">' + esc(r.text) + '</p>' +
        '<div class="modal__meta">' + esc([r.name, r.city, r.date].filter(Boolean).join(' · ')) + '</div>',
        false
      );
    }
  });

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('#modalClose')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ---------- Шапка и мобильное меню ---------------------------------- */
  var hdr = $('#hdr');
  var burger = $('#burger');
  var mobnav = $('#mobnav');

  if (burger && mobnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mobnav.classList.toggle('is-open', !open);
    });
    mobnav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        mobnav.classList.remove('is-open');
      }
    });
  }

  /* ---------- Нижняя кнопка на мобильном ------------------------------ */
  var sticky = $('#sticky');
  var finalVisible = false;

  function onScroll() {
    if (hdr) hdr.classList.toggle('is-scrolled', window.scrollY > 8);
    if (sticky) sticky.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.7 && !finalVisible);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- Появление при скролле ----------------------------------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pending = $$('.rv');

  /* Страховка: что бы ни случилось с наблюдателем, контент должен быть виден. */
  function revealVisible() {
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.1) {
        el.classList.add('is-in');
        return false;
      }
      return true;
    });
  }
  window.addEventListener('scroll', revealVisible, { passive: true });
  window.addEventListener('load', function () { setTimeout(revealVisible, 200); });
  setTimeout(revealVisible, 1400);

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $$('.rv').forEach(function (el) { io.observe(el); });

    var finalEl = $('#final');
    if (finalEl && sticky) {
      new IntersectionObserver(function (entries) {
        finalVisible = entries[0].isIntersecting;
        onScroll();
      }, { threshold: 0.2 }).observe(finalEl);
    }
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Год в футере -------------------------------------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
