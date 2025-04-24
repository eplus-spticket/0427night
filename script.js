// ===== 共通定数と関数 =====
const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

const formatDateTime = (d, withSeconds = false) => {
  const pad = n => ('0' + n).slice(-2);
  const w = weekDays[d.getDay()];
  const date = `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}(${w})`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}` +
               (withSeconds ? `:${pad(d.getSeconds())}.${('0' + Math.floor(d.getMilliseconds() / 10)).slice(-2)}` : '');
  return `${date} ${time}`;
};

const updateDatetime = () => {
  datetimeOverlay.textContent = '使用日時: ' + formatDateTime(new Date());
};

// ===== DOMキャッシュ =====
const page2 = document.getElementById('page2');
const glowButton = document.getElementById('glowButton');
const datetimeOverlay = document.getElementById('datetime-overlay');
const timeBars = document.querySelectorAll('.time');
const bannerFront = document.getElementById('banner-front');
const bannerBack = document.getElementById('banner-back');
const attention = document.getElementById('attention');

// ===== ページ切替関数 =====
const showPage2 = () => {
  page2.classList.add('visible');
  requestAnimationFrame(() => page2.classList.add('active'));
};

const hidePage2 = () => {
  page2.classList.remove('active');
  page2.addEventListener('transitionend', () => {
    page2.classList.remove('visible');
  }, { once: true });
};

// ===== 時計処理 =====
const startClock = () => {
  const update = () => {
    const now = new Date();
    const timeText = formatDateTime(now, true);
    timeBars.forEach(p => p.textContent = timeText);
    requestAnimationFrame(update);
  };
  update();
};

startClock();
updateDatetime();

// ===== スライドイン/アウト操作 =====
glowButton.addEventListener('click', showPage2);

document.querySelectorAll('#pageA .upper').forEach(img => {
  img.addEventListener('click', e => {
    e.preventDefault();
    hidePage2();
  });
});

// ===== スワイプ処理 =====
let startX = 0, startY = 0, deltaX = 0, isSwiping = false;
const swipeThreshold = 100;
const colors = ["#3789C3", "#459CA6", "#439F88", "#95C47E", "#F6EE72", "#E65958"];
const colorStepSize = 30;

const onSwipeSuccess = () => {
  document.getElementById('pageA').style.display = 'none';
  document.getElementById('pageB').style.display = 'block';
  updateDatetime();

  const overlay = document.getElementById('banner-overlay');
  overlay.style.opacity = '1';
  overlay.style.display = 'block';
  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.display = 'none', 1000);
  }, 700);
};

const onSwipeCancel = () => {
  bannerFront.style.transition = "transform 0.3s ease-out";
  bannerFront.style.transform = "translateX(0)";
  bannerBack.style.setProperty('--banner-color', colors[0]);
  bannerFront.src = "top.jpg";
  attention.style.opacity = 0;
};

bannerFront.addEventListener('touchstart', e => {
  if (e.touches.length !== 2) return;
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  deltaX = 0;
  isSwiping = true;

  bannerFront.style.transition = "none";
  bannerFront.src = "gate.gif";
  attention.style.opacity = 1;
}, { passive: true });

bannerFront.addEventListener('touchmove', e => {
  if (!isSwiping) return;
  const touch = e.touches[0];
  deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) e.preventDefault();

  bannerFront.style.transform = `translateX(${deltaX}px)`;
  const colorIndex = Math.min(Math.floor(Math.abs(deltaX) / colorStepSize), colors.length - 1);
  bannerBack.style.setProperty('--banner-color', colors[colorIndex]);
}, { passive: false });

bannerFront.addEventListener('touchend', () => {
  isSwiping = false;
  Math.abs(deltaX) > swipeThreshold ? onSwipeSuccess() : onSwipeCancel();
}, { passive: true });

// ===== ピンチ・ジェスチャー無効化 =====
document.addEventListener('touchmove', e => {
  if (e.scale !== 1) e.preventDefault();
}, { passive: false });

['gesturestart', 'gesturechange', 'gestureend'].forEach(type => {
  document.addEventListener(type, e => e.preventDefault());
});
