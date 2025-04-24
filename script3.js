// 時計だけ動かす script3.js

(function(d){
  const timeBars = d.querySelectorAll('.time');
  const datetimeOverlay = d.getElementById('datetime-overlay');
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const fixedDate = new Date();
  const fixedWeek = weekDays[fixedDate.getDay()];
  const datetimeText = '使用日時: ' + fixedDate.getFullYear() + '/' +
                       ('0' + (fixedDate.getMonth() + 1)).slice(-2) + '/' +
                       ('0' + fixedDate.getDate()).slice(-2) + '(' + fixedWeek + ') ' +
                       ('0' + fixedDate.getHours()).slice(-2) + ':' +
                       ('0' + fixedDate.getMinutes()).slice(-2);

  if (datetimeOverlay) datetimeOverlay.textContent = datetimeText;

  function updateTimeBar() {
    const now = new Date();
    const nowWeek = weekDays[now.getDay()];
    let milliseconds = Math.floor(now.getMilliseconds() / 10);
    milliseconds = ('0' + milliseconds).slice(-2);

    const timeText = now.getFullYear() + '/' +
                     ('0' + (now.getMonth() + 1)).slice(-2) + '/' +
                     ('0' + now.getDate()).slice(-2) + ' (' + nowWeek + ') ' +
                     ('0' + now.getHours()).slice(-2) + ':' +
                     ('0' + now.getMinutes()).slice(-2) + ':' +
                     ('0' + now.getSeconds()).slice(-2) + '.' +
                     milliseconds;

    timeBars.forEach(p => p.textContent = timeText);
    requestAnimationFrame(updateTimeBar);
  }

  requestAnimationFrame(updateTimeBar);
})(document);


// ページ3 スライドイン／アウト制御
const page3 = document.getElementById('page3');
const openPage3 = document.getElementById('openPage3');
const upper3 = document.getElementById('upper3');

// スライドイン
if (page3 && openPage3) {
  openPage3.addEventListener('click', () => {
    page3.classList.add('visible');
    requestAnimationFrame(() => {
      page3.classList.add('active');
    });
  });
}

// スライドアウト
if (page3 && upper3) {
  upper3.addEventListener('click', (e) => {
    e.preventDefault();
    page3.classList.remove('active');

    const handleTransitionEnd3 = (event) => {
      if (event.propertyName === 'transform') {
        page3.classList.remove('visible');
        page3.removeEventListener('transitionend', handleTransitionEnd3);
      }
    };

    page3.addEventListener('transitionend', handleTransitionEnd3);
  });
}