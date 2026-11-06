// サイト共通のスクリプト(HP・LP)

// Googleアナリティクス。測定IDが入るまでは読み込まない
const GA_ID = 'G-XXXXXXXXXX';
if (!GA_ID.includes('XXXX')) {
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
}

// LINEボタンが押されたら記録する(どのボタンかは data-place で分ける)
document.querySelectorAll('a[href*="lin.ee"]').forEach(a => {
  a.addEventListener('click', () => {
    if (window.gtag) gtag('event', 'line_click', { place: a.dataset.place || 'unknown', page: location.pathname });
  });
});

// スクロールで少しずつ表示
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// ヘッダー: スクロールしたら影を付ける
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// スマホのメニュー
const toggle = document.querySelector('.menu-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.drawer a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// スマホ下部の固定ボタン: 最初のボタンが画面から消えたら出す
const sticky = document.querySelector('.sticky-cta');
const firstCta = document.querySelector('[data-first-cta]');
if (sticky && firstCta) {
  new IntersectionObserver(([e]) => {
    sticky.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0);
  }).observe(firstCta);
} else if (sticky) {
  // 下層ページは、少しスクロールしたら出す
  const onScroll = () => sticky.classList.toggle('show', scrollY > 500);
  addEventListener('scroll', onScroll, { passive: true });
}

// PC用: 公式LINEのQRコード(URLが入るまでは枠だけ表示)
document.querySelectorAll('[data-qr]').forEach(card => {
  const url = card.dataset.qr;
  if (url.includes('XXXX') || !window.QRCode) return;
  const box = card.querySelector('.qr');
  box.textContent = '';
  new QRCode(box, { text: url, width: 180, height: 180, colorDark: '#25212C', colorLight: '#ffffff' });
  card.classList.add('ready');
});
