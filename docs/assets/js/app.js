(function () {
  'use strict';

  var C = window.WEDDING_CONFIG || {};
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var topbar = $('#topbar');
  var actionBar = $('#actionBar');
  var replyVisible = false, inputFocused = false, introDone = false;

  /* ------------------------------------------------------------------
     Script-generated strings (static copy lives in the HTML)
     ------------------------------------------------------------------ */
  var T = {
    en: {
      title: 'Dr. Paras & Dr. Pooja · Shubh Vivah · 4 December 2026',
      daysLeft: '{n} days to go', dayLeft: '1 day to go', today: 'The celebrations have begun',
      summaryCounts: '= {a} {aw} + {k} {kw}', adult: 'adult', adults: 'adults', child: 'child', children: 'children',
      errName: 'Kindly write your name.',
      errPhone: 'Kindly check the mobile number.',
      errDate: 'Kindly choose the day you will arrive.',
      errOther: 'Kindly pick the date.',
      errCount: 'Kindly choose how many people will come.',
      errKids: 'There should be at least one adult.',
      fix: 'Kindly check the details marked in red.',
      sending: 'Sending…',
      failed: 'Sorry, this could not be sent. Kindly check your internet connection and try again.',
      demo: 'Preview mode: the Google Sheet is not connected yet, so this reply was not saved.',
      sArrival: 'Arrival', sTime: 'Time', sGuests: 'Guests', sAdults: 'Adults', sKids: 'Children',
      thanksYes: 'Heartfelt thanks', thanksYesMsg: 'Your arrival is eagerly awaited.',
      thanksNo: 'Thank you for your blessings', thanksNoMsg: 'You will be dearly missed. Your blessings will reach the couple.',
      ticketYes: '<b>{name}</b> — {n} {g}, arriving {date}.', guest: 'guest', guests: 'guests',
      ticketNo: '<b>{name}</b> — your blessings have reached us.',
      cal3: 'Haldi & Mehendi · Paras & Pooja', cal4: 'Wedding · Dr. Paras & Dr. Pooja', cal6: 'Sangeet & Reception · Paras & Pooja',
      cal3d: 'Haldi 11 AM–1 PM, lunch 2 PM, Mehendi 3–5 PM, tea 5–6 PM at the Swimming Pool, Hotel Ananya Regency, Ramnagar Road, Kashipur.\nBhaat & dinner 8–10 PM at our residence, R. K. Hospital, Ramnagar Road, Kashipur.',
      cal4d: 'Ghudchadhi 9:30 AM; baraat leaves 10 AM by bus from R. K. Hospital, Ramnagar Road, Kashipur, for Sapphire Hotel, Haldwani.\nLagan 3 PM · Chadhat baraat 7 PM · Wedding rites at the auspicious muhurat at Vintage Green, Haldwani.',
      cal6d: 'Sangeet 5–7 PM, reception dinner from 7 PM at Hotel Ananya Regency, Ramnagar Road, Kashipur.',
      calSign: '\n\nWith love, the Sharma family · ',
      shareText: 'You are warmly invited to the wedding of Dr. Paras & Dr. Pooja (4 December 2026). Kindly confirm your arrival here:',
      copied: 'Link copied — paste it anywhere to share.'
    },
    hi: {
      title: 'शुभ विवाह · डॉ. पारस एवं डॉ. पूजा · 4 दिसम्बर 2026',
      daysLeft: 'विवाह में {n} दिन शेष', dayLeft: 'विवाह में 1 दिन शेष', today: 'मंगल उत्सव आरम्भ',
      summaryCounts: '= {a} {aw} + {k} {kw}', adult: 'बड़े', adults: 'बड़े', child: 'बच्चा', children: 'बच्चे',
      errName: 'कृपया अपना नाम लिखें।',
      errPhone: 'कृपया मोबाइल नंबर जाँच लें।',
      errDate: 'कृपया आगमन का दिन चुनें।',
      errOther: 'कृपया तिथि चुनें।',
      errCount: 'कृपया बताएँ कि कुल कितने लोग आएँगे।',
      errKids: 'कम से कम एक बड़े सदस्य होने चाहिए।',
      fix: 'कृपया लाल रंग में दिखाई गई जानकारी ठीक करें।',
      sending: 'भेजा जा रहा है…',
      failed: 'क्षमा करें, सूचना नहीं भेजी जा सकी। कृपया इंटरनेट जाँचकर पुनः प्रयास करें।',
      demo: 'पूर्वावलोकन: गूगल शीट अभी जुड़ी नहीं है, इसलिए यह सूचना सहेजी नहीं गई।',
      sArrival: 'आगमन', sTime: 'समय', sGuests: 'कुल सदस्य', sAdults: 'बड़े', sKids: 'बच्चे',
      thanksYes: 'हार्दिक आभार', thanksYesMsg: 'आपके शुभागमन की प्रतीक्षा रहेगी।',
      thanksNo: 'आपके आशीर्वाद के लिए आभार', thanksNoMsg: 'आपकी कमी अवश्य खलेगी। आपका आशीर्वाद वर-वधू तक पहुँचेगा।',
      ticketYes: '<b>{name}</b> — {n} {g}, आगमन {date}।', guest: 'सदस्य', guests: 'सदस्य',
      ticketNo: '<b>{name}</b> — आपका आशीर्वाद हमें प्राप्त हो गया है।',
      cal3: 'हल्दी एवं मेहंदी · पारस-पूजा', cal4: 'शुभ विवाह · डॉ. पारस एवं डॉ. पूजा', cal6: 'संगीत संध्या एवं प्रीतिभोज · पारस-पूजा',
      cal3d: 'हल्दी दोपहर 11–1 बजे, भोजन 2 बजे, मेहंदी 3–5 बजे, नाश्ता 5–6 बजे — स्विमिंग पूल, अनन्या रीजेंसी, रामनगर रोड, काशीपुर।\nभात एवं प्रीति भोज रात्रि 8–10 बजे — निज निवास, आर. के. हॉस्पिटल, रामनगर रोड, काशीपुर।',
      cal4d: 'घुड़चढ़ी प्रातः 9:30 बजे; बारात प्रातः 10 बजे बस द्वारा आर. के. हॉस्पिटल, काशीपुर से सफायर होटल, हल्द्वानी।\nलग्न 3 बजे · चढ़त बारात सायं 7 बजे · वैवाहिक कार्यक्रम शुभलग्नानुसार — विंटेज ग्रीन, हल्द्वानी।',
      cal6d: 'संगीत संध्या सायं 5–7 बजे, प्रीतिभोज सायं 7 बजे से — अनन्या रीजेंसी, रामनगर रोड, काशीपुर।',
      calSign: '\n\nसस्नेह, शर्मा परिवार · ',
      shareText: 'डॉ. पारस एवं डॉ. पूजा के शुभ विवाह (4 दिसम्बर 2026) में आप सपरिवार सादर आमंत्रित हैं। कृपया यहाँ अपने आगमन की सूचना दें:',
      copied: 'लिंक कॉपी हो गया — अब कहीं भी भेज सकते हैं।'
    }
  };
  function lang() { return root.dataset.lang === 'hi' ? 'hi' : 'en'; }
  function t(k, vars) {
    var s = (T[lang()] && T[lang()][k]) || T.en[k] || k;
    if (vars) Object.keys(vars).forEach(function (v) { s = s.split('{' + v + '}').join(vars[v]); });
    return s;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ------------------------------------------------------------------
     Dates
     ------------------------------------------------------------------ */
  var WD = { en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'] };
  var MO = { en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'] };
  function parseISO(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null; }
  // style: 'long' → Saturday, 28 November · 'short' → 28 Nov · 'full' → Thu, 3 Dec 2026 (en) / गुरुवार, 3 दिसम्बर 2026
  function fmtDate(iso, l, style) {
    var d = parseISO(iso); if (!d) return iso || '';
    var day = d.getUTCDate(), wd = WD[l][d.getUTCDay()], mo = MO[l][d.getUTCMonth()];
    if (style === 'short') return day + ' ' + (l === 'en' ? mo.slice(0, 3) : mo);
    if (style === 'long') return wd + ', ' + day + ' ' + mo;
    if (l === 'en') return wd.slice(0, 3) + ', ' + day + ' ' + mo.slice(0, 3) + ' ' + d.getUTCFullYear();
    return wd + ', ' + day + ' ' + mo + ' ' + d.getUTCFullYear();
  }
  function fmtTime(hm, l) {
    var m = /^(\d{1,2}):(\d{2})/.exec(hm || ''); if (!m) return '';
    var h = +m[1], mm = m[2], h12 = (h % 12) || 12;
    if (l === 'hi') return (h < 4 ? 'रात' : h < 12 ? 'सुबह' : h < 16 ? 'दोपहर' : h < 19 ? 'शाम' : 'रात') + ' ' + h12 + ':' + mm + ' बजे';
    return h12 + ':' + mm + ' ' + (h < 12 ? 'AM' : 'PM');
  }
  function todayIST() { return new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10); }

  /* ------------------------------------------------------------------
     Language — ?lang= keeps the choice in shareable links
     ------------------------------------------------------------------ */
  var langListeners = [];
  function setLang(l, opts) {
    opts = opts || {};
    if (l !== 'en' && l !== 'hi') l = 'en';
    root.dataset.lang = l; root.lang = l;
    $$('[data-set-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.setLang === l)); });
    $$('[data-ph-' + l + ']').forEach(function (el) { el.placeholder = el.getAttribute('data-ph-' + l); });
    document.title = t('title');
    if (opts.persist) store.set('lang', l);
    if (opts.updateUrl && window.history && history.replaceState) {
      try { var u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(history.state, '', u.toString()); } catch (e) {}
    }
    langListeners.forEach(function (fn) { fn(l); });
  }
  $$('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.setLang, { persist: true, updateUrl: true }); });
  });
  function shareUrl() {
    var base = C.siteUrl || (location.origin + location.pathname);
    try { var u = new URL(base); u.searchParams.set('lang', lang()); return u.toString(); } catch (e) { return base; }
  }

  /* ------------------------------------------------------------------
     Opening — digital jharokha doors (auto-open; skipped on return visits / #rsvp)
     ------------------------------------------------------------------ */
  var intro = $('#intro');
  var replied = !!store.get('rsvp');
  var skipIntro = location.hash === '#rsvp' || store.get('seenIntro') === '1' || replied;
  var autoTimer;

  function finishIntro() {
    introDone = true;
    intro.classList.add('gone');
    document.body.classList.remove('locked');
    observeReveals();
    updateBar();
  }
  function openIntro() {
    if (intro.classList.contains('opening')) return;
    clearTimeout(autoTimer);
    store.set('seenIntro', '1');
    intro.classList.add('opening');
    if (!reduceMotion) petals();
    setTimeout(finishIntro, reduceMotion ? 50 : 1500);
  }
  if (skipIntro) {
    finishIntro();
  } else {
    document.body.classList.add('locked');
    $('#introGate').addEventListener('click', openIntro);
    $('#introOpen').addEventListener('click', openIntro);
    autoTimer = setTimeout(openIntro, 3200);
  }

  function petals() {
    var colors = ['#ec8a1e', '#f7b53a', '#d24a7d', '#f19ab9', '#e85d3a', '#f6c453'];
    var n = window.innerWidth < 600 ? 24 : 38;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      var size = 9 + Math.random() * 9;
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.width = size + 'px';
      p.style.height = (size * 1.3) + 'px';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--dur', (4.5 + Math.random() * 3.5) + 's');
      p.style.setProperty('--sway', (1.6 + Math.random() * 1.8) + 's');
      p.style.setProperty('--rot', (Math.random() > .5 ? '' : '-') + (360 + Math.random() * 540) + 'deg');
      p.style.animationDelay = (Math.random() * 1.2) + 's, 0s';
      document.body.appendChild(p);
      setTimeout(p.remove.bind(p), 10000);
    }
  }

  /* ------------------------------------------------------------------
     Days left, reply-by date
     ------------------------------------------------------------------ */
  var replyBy = C.replyBy || '2026-11-28';
  function renderDates() {
    var l = lang();
    $$('.replyby').forEach(function (el) { el.textContent = fmtDate(replyBy, l, 'long'); });
    $$('.replyby-short').forEach(function (el) { el.textContent = fmtDate(replyBy, l, 'short'); });
    var el = $('#daysLeft');
    var wedding = parseISO((C.weddingDate || '2026-12-04')), now = parseISO(todayIST());
    var n = Math.round((wedding - now) / 864e5);
    if (n > 1) el.textContent = t('daysLeft', { n: n });
    else if (n === 1) el.textContent = t('dayLeft');
    else if (n >= -3) el.textContent = t('today');
    el.hidden = n < -3;
  }
  langListeners.push(renderDates);

  /* ------------------------------------------------------------------
     Map + calendar links
     ------------------------------------------------------------------ */
  var venues = C.venues || {};
  $$('[data-venue]').forEach(function (a) { var url = venues[a.dataset.venue]; if (url) a.href = url; else a.hidden = true; });

  var CAL = {
    day3: { key: 'cal3', d: 'cal3d', start: '20261203T110000', end: '20261203T220000', loc: 'Hotel Ananya Regency, Ramnagar Road, Kashipur, Uttarakhand' },
    day4: { key: 'cal4', d: 'cal4d', start: '20261204T093000', end: '20261204T235900', loc: 'R. K. Hospital, Ramnagar Road, Kashipur → Vintage Green, Haldwani' },
    day6: { key: 'cal6', d: 'cal6d', start: '20261206T170000', end: '20261206T220000', loc: 'Hotel Ananya Regency, Ramnagar Road, Kashipur, Uttarakhand' }
  };
  function updateCalLinks() {
    $$('[data-cal]').forEach(function (a) {
      var ev = CAL[a.dataset.cal]; if (!ev) return;
      a.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent(t(ev.key)) +
        '&dates=' + ev.start + '/' + ev.end + '&ctz=Asia/Kolkata' +
        '&location=' + encodeURIComponent(ev.loc) +
        '&details=' + encodeURIComponent(t(ev.d) + t('calSign') + shareUrl());
    });
  }
  langListeners.push(updateCalLinks);

  /* ------------------------------------------------------------------
     Reveal, top bar, reminder bar
     ------------------------------------------------------------------ */
  var revealsObserved = false;
  function observeReveals() {
    if (revealsObserved) return; revealsObserved = true;
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    els.forEach(function (e) { io.observe(e); });
  }
  function updateBar() {
    topbar.classList.toggle('scrolled', window.scrollY > 30);
    actionBar.classList.toggle('show', introDone && !replied && !replyVisible && !inputFocused && window.scrollY > 120);
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('resize', updateBar);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { replyVisible = en[0].isIntersecting; updateBar(); }, { threshold: 0 }).observe($('#replyCard'));
  }
  document.addEventListener('focusin', function (e) { if (e.target.matches('input:not([type=radio]), textarea')) { inputFocused = true; updateBar(); } });
  document.addEventListener('focusout', function () { inputFocused = false; setTimeout(updateBar, 50); });

  /* ------------------------------------------------------------------
     Reply card
     ------------------------------------------------------------------ */
  var form = $('#rsvpForm');
  var thanks = $('#thanks');
  var ticket = $('#ticket');
  var statusEl = $('#formStatus');
  var btn = $('#submitBtn');
  var kids = $('#f-kids');
  var more = $('#f-totalMore');
  var moreWrap = $('#moreWrap');
  var otherWrap = $('#otherDateWrap');
  var details = $('#moreDetails');
  var lastResult = null, submitting = false;

  function toInt(v, d) { var n = parseInt(v, 10); return isNaN(n) ? d : n; }
  function declining() { return form.classList.contains('declining'); }
  function chosenTotal() {
    var r = form.querySelector('input[name="totalChoice"]:checked');
    if (!r) return 0;
    return r.value === 'more' ? Math.min(60, Math.max(7, toInt(more.value, 7))) : toInt(r.value, 0);
  }
  function renderCounts() {
    var tot = chosenTotal();
    var k = Math.max(0, toInt(kids.value, 0));
    if (tot && k > tot - 1) k = tot - 1;           // at least one adult
    if (String(k) !== kids.value) kids.value = k;
    var sum = $('#countSummary');
    if (!tot) { sum.textContent = ''; return; }
    var a = tot - k;
    sum.textContent = t('summaryCounts', { a: a, aw: t(a === 1 ? 'adult' : 'adults'), k: k, kw: t(k === 1 ? 'child' : 'children') });
  }
  $$('[data-stepper]').forEach(function (st) {
    var input = $('input', st);
    $$('button', st).forEach(function (b) {
      b.addEventListener('click', function () {
        var next = toInt(input.value, 0) + toInt(b.dataset.step, 0);
        if (input === kids && chosenTotal() && next > chosenTotal() - 1) {
          // adding a child beyond the total: grow the total instead of refusing
          var r = form.querySelector('input[name="totalChoice"]:checked');
          var newTot = Math.min(60, next + 1);
          if (newTot <= 6) form.querySelector('input[name="totalChoice"][value="' + newTot + '"]').checked = true;
          else { form.querySelector('input[name="totalChoice"][value="more"]').checked = true; more.value = newTot; moreWrap.hidden = false; }
          if (!r) clearErr('count');
        }
        input.value = Math.max(toInt(input.min, 0), Math.min(toInt(input.max, 60), next));
        renderCounts(); clearErr('count');
      });
    });
    input.addEventListener('change', renderCounts);
  });
  $$('input[name="totalChoice"]').forEach(function (r) {
    r.addEventListener('change', function () { moreWrap.hidden = r.value !== 'more'; renderCounts(); clearErr('count'); });
  });
  $$('input[name="arrivalDate"]').forEach(function (r) {
    r.addEventListener('change', function () { otherWrap.hidden = r.value !== 'other'; clearErr('arrivalDate'); });
  });
  $('#f-name').addEventListener('input', function () { clearErr('name'); });
  $('#f-phone').addEventListener('input', function () { clearErr('phone'); });

  function setDeclining(on) {
    form.classList.toggle('declining', on);
    $('#f-attending').value = on ? 'no' : 'yes';
    $('#declineNote').hidden = !on;
    if (on) details.open = true;
    ['arrivalDate', 'count'].forEach(clearErr);
    setStatus('');
  }
  $('#declineBtn').addEventListener('click', function () { setDeclining(true); $('#f-name').focus(); });
  $('#undeclineBtn').addEventListener('click', function () { setDeclining(false); $('#q-date').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); });

  function errEl(k) { return form.querySelector('[data-err="' + k + '"]'); }
  function setErr(k, key) {
    var el = errEl(k); if (!el) return;
    el.dataset.key = key; el.textContent = t(key);
    var q = el.closest('.q, .field'); if (q) q.classList.add('invalid');
  }
  function clearErr(k) {
    var el = errEl(k); if (!el) return;
    el.textContent = ''; delete el.dataset.key;
    var q = el.closest('.q, .field'); if (q) q.classList.remove('invalid');
  }
  function setStatus(key, isError) {
    statusEl.dataset.key = key || '';
    statusEl.textContent = key ? t(key) : '';
    statusEl.classList.toggle('error', !!isError);
  }

  function readForm() {
    var fd = new FormData(form);
    var att = declining() ? 'no' : 'yes';
    var date = fd.get('arrivalDate') || '';
    if (date === 'other') date = fd.get('otherDate') || '';
    var tot = att === 'yes' ? chosenTotal() : 0;
    var k = att === 'yes' ? Math.max(0, toInt(kids.value, 0)) : 0;
    return {
      attending: att,
      name: String(fd.get('name') || '').trim().replace(/\s+/g, ' '),
      phone: String(fd.get('phone') || '').trim(),
      arrivalDate: att === 'yes' ? date : '',
      dateChoice: String(fd.get('arrivalDate') || ''),
      arrivalTime: att === 'yes' ? String(fd.get('arrivalTime') || '') : '',
      totalChoice: String(fd.get('totalChoice') || ''),
      totalPeople: tot, kids: k, adults: Math.max(0, tot - k),
      message: String(fd.get('message') || '').trim(),
      website: String(fd.get('website') || '')
    };
  }

  function validate(d) {
    var first = null;
    ['name', 'phone', 'arrivalDate', 'count'].forEach(clearErr);
    if (d.attending === 'yes') {
      var picked = form.querySelector('input[name="arrivalDate"]:checked');
      if (!picked) { setErr('arrivalDate', 'errDate'); first = first || '#q-date'; }
      else if (picked.value === 'other' && !parseISO(d.arrivalDate)) { setErr('arrivalDate', 'errOther'); first = first || '#f-otherDate'; }
      if (!d.totalPeople) { setErr('count', 'errCount'); first = first || '#q-count'; }
      else if (d.kids >= d.totalPeople) { setErr('count', 'errKids'); first = first || '#q-count'; }
    }
    if (d.name.length < 2) { setErr('name', 'errName'); first = first || '#f-name'; }
    if (d.phone) {
      var digits = d.phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 13 || /[^\d\s+\-()]/.test(d.phone)) {
        setErr('phone', 'errPhone'); details.open = true; first = first || '#f-phone';
      }
    }
    if (first) {
      var el = $(first);
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      if (el.tagName === 'INPUT') try { el.focus({ preventScroll: true }); } catch (e) {}
    }
    return !first;
  }

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function send(payload) {
    var url = C.rsvpEndpoint;
    if (!url) {
      console.warn('[RSVP] No rsvpEndpoint in assets/js/config.js — preview mode, nothing saved.', payload);
      return new Promise(function (res) { setTimeout(function () { res({ ok: true, demo: true }); }, 700); });
    }
    var body = new URLSearchParams();
    Object.keys(payload).forEach(function (k) { body.append(k, payload[k]); });
    // Simple form POST (no CORS preflight). We only say "thank you" once the Sheet confirms.
    // A retry after an error re-sends the same `id`, which the Apps Script ignores if already saved.
    return fetch(url, { method: 'POST', body: body, redirect: 'follow' })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j || !j.ok) throw new Error((j && j.error) || 'Server rejected'); return j; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submitting) return;
    var d = readForm();
    if (!validate(d)) { setStatus('fix', true); return; }
    if (d.website) { showThanks(d, false); return; } // bot

    submitting = true; btn.disabled = true; btn.classList.add('loading'); setStatus('sending');
    var payload = {
      id: form.dataset.id || (form.dataset.id = uid()),
      attending: d.attending,
      name: d.name, phone: d.phone,
      arrivalDate: d.arrivalDate,
      arrivalTime: fmtTime(d.arrivalTime, 'en'),
      totalPeople: d.totalPeople, adults: d.adults, kids: d.kids,
      message: d.message, lang: lang(), website: d.website
    };
    send(payload).then(function (res) {
      replied = true;
      store.set('rsvp', JSON.stringify(d));
      showThanks(d, !!res.demo);
    }).catch(function (err) {
      console.error('[RSVP] failed', err);
      setStatus('failed', true);
    }).then(function () {
      submitting = false; btn.disabled = false; btn.classList.remove('loading');
    });
  });

  function renderThanks() {
    if (!lastResult) return;
    var d = lastResult.d, l = lang(), yes = d.attending === 'yes';
    $('#thanksTitle').textContent = t(yes ? 'thanksYes' : 'thanksNo');
    $('#thanksName').textContent = d.name;
    $('#thanksMsg').textContent = t(yes ? 'thanksYesMsg' : 'thanksNoMsg') + (lastResult.demo ? ' — ' + t('demo') : '');
    var dl = $('#summary'); dl.innerHTML = '';
    if (!yes) return;
    [[t('sArrival'), fmtDate(d.arrivalDate, l, 'full')],
     d.arrivalTime ? [t('sTime'), fmtTime(d.arrivalTime, l)] : null,
     [t('sGuests'), String(d.totalPeople)],
     [t('sAdults'), String(d.adults)],
     [t('sKids'), String(d.kids)]
    ].filter(Boolean).forEach(function (r) {
      var dt = document.createElement('dt'); dt.textContent = r[0];
      var dd = document.createElement('dd'); dd.textContent = r[1];
      dl.appendChild(dt); dl.appendChild(dd);
    });
  }
  function showThanks(d, demo) {
    lastResult = { d: d, demo: demo };
    renderThanks();
    form.hidden = true; ticket.hidden = true; thanks.hidden = false;
    setStatus('');
    updateBar();
    $('#replyCard').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    try { thanks.focus({ preventScroll: true }); } catch (e) {}
  }

  function resetForm() {
    form.reset(); delete form.dataset.id;
    otherWrap.hidden = true; moreWrap.hidden = true; details.open = false;
    setDeclining(false);
    ['name', 'phone', 'arrivalDate', 'count'].forEach(clearErr);
    renderCounts();
  }
  $('#againBtn').addEventListener('click', function () {
    resetForm(); lastResult = null;
    thanks.hidden = true; form.hidden = false;
    replied = false; updateBar();
    $('#q-date').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  });

  // Returning visitor → show a confirmation ticket instead of the form
  function savedReply() { try { return JSON.parse(store.get('rsvp') || 'null'); } catch (e) { return null; } }
  function renderTicket() {
    var p = savedReply(); if (!p || ticket.hidden) return;
    var n = p.totalPeople;
    $('#ticketBody').innerHTML = p.attending === 'no'
      ? t('ticketNo', { name: esc(p.name) })
      : t('ticketYes', { name: esc(p.name), n: n, g: t(n === 1 ? 'guest' : 'guests'), date: esc(fmtDate(p.arrivalDate, lang(), 'long')) });
  }
  (function () {
    var p = savedReply();
    if (!p || !p.name) return;
    form.hidden = true; ticket.hidden = false;
    renderTicket();
  })();
  langListeners.push(renderTicket);

  $('#changeBtn').addEventListener('click', function () {
    var p = savedReply() || {};
    resetForm();
    $('#f-name').value = p.name || '';
    $('#f-phone').value = p.phone || '';
    $('#f-msg').value = p.message || '';
    if (p.attending === 'no') setDeclining(true);
    else {
      var dc = form.querySelector('input[name="arrivalDate"][value="' + (p.dateChoice || p.arrivalDate) + '"]');
      if (dc) { dc.checked = true; if (dc.value === 'other') { otherWrap.hidden = false; $('#f-otherDate').value = p.arrivalDate || ''; } }
      var tc = form.querySelector('input[name="totalChoice"][value="' + (p.totalChoice || '') + '"]');
      if (tc) { tc.checked = true; if (tc.value === 'more') { moreWrap.hidden = false; more.value = p.totalPeople; } }
      kids.value = p.kids || 0;
      $('#f-time').value = p.arrivalTime || '';
      if (p.phone || p.arrivalTime || p.message) details.open = true;
    }
    renderCounts();
    ticket.hidden = true; form.hidden = false;
    replied = false; updateBar();
  });

  /* ------------------------------------------------------------------
     Share
     ------------------------------------------------------------------ */
  var shareStatus = $('#shareStatus');
  $$('[data-share]').forEach(function (b) {
    b.addEventListener('click', function () {
      var url = shareUrl();
      if (navigator.share) {
        navigator.share({ title: t('title'), text: t('shareText'), url: url }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t('shareText') + ' ' + url).then(function () { shareStatus.textContent = t('copied'); });
      } else {
        window.prompt('', url);
      }
    });
  });

  /* ------------------------------------------------------------------
     Language-dependent dynamic text
     ------------------------------------------------------------------ */
  langListeners.push(function () {
    renderCounts();
    $$('.err[data-key]').forEach(function (el) { el.textContent = t(el.dataset.key); });
    if (statusEl.dataset.key) statusEl.textContent = t(statusEl.dataset.key);
    shareStatus.textContent = '';
    renderThanks();
  });

  setLang(root.dataset.lang, { persist: false, updateUrl: false });
  updateBar();
})();
