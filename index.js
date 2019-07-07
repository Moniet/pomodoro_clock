const circleEl = document.querySelector('#timer_circle');
const behindCirc = document.querySelector('#timer_circle_behind');
const counter = document.querySelector('#counter_text');
const startPause = document.querySelector('.startPause__timer');
const startBtn = document.querySelector('.start_img');
const pauseBtn = document.querySelector('.pause_img');
const reset = document.querySelector('.reset__timer');
const addSessionBtn = document.querySelector('.add__session__time');
const subSessionBtn = document.querySelector('.sub__session__time');
const addBreakBtn = document.querySelector('.add__break__time');
const subBreakBtn = document.querySelector('.sub__break__time');
const sessionDisplay = document.querySelector('.session__time__display');
const breakDisplay = document.querySelector('.break__time__display');
const encourageDisplay = document.querySelector('#encourage_text');
const listContainer = document.querySelector('.todo__container');
const listWrapper = document.querySelector('.todo__wrapper');
const showHideListBtn = document.querySelector('.close__open__list');

let minutes = 25;
let breakMinutes = 10;
let timer;
let isRunning = false;
let radius = parseInt(circleEl.getAttribute('r'));
let circ = Math.floor(2 * 3.14 * radius) - 5; // get radius from the svg circle | sub 5px from circle to prevent overlap
let state = 'session';
let currentTime;
let screenWidth = document.documentElement.clientWidth;

function startTimer() {
  isRunning = true;
  let secs = (currentTime ? currentTime : getSeconds());
  // ^^
  // gets the break time when the session time ends
  // and vice versa

  timer = setInterval(() => {
    secs -= 1;
    currentTime = secs;
    let obj = getMinSec(secs);
    let min = obj.min;
    let sec = obj.sec;

    counter.textContent = `${min}:${sec}`;

    if (secs === 0) {
      if (state === 'session') {
        state = 'break';
      } else if (state === 'break') {
        state = 'session';
      }

      resetTimer();
      startTimer();
    }

    reduceCircle(secs);
  }, 1000);

}

function getMinSec(secs) {
  let min = Math.floor(secs / 60);
  let sec = secs - (min * 60);

  if (sec < 10) {
    sec = '0' + sec;
  }

  if (min < 10) {
    min = '0' + min;
  }

  return {
    min: min,
    sec: sec,
  };
}

function getSeconds() {
  if (state === 'session') {
    return minutes * 60;
  } else if (state === 'break') {
    return breakMinutes * 60;
  }
}

function resetTimer() {
  isRunning = false;
  currentTime = 0;
  clearInterval(timer);
  showPlayButton();

  let time = getSeconds();
  counter.textContent = `${getMinSec(time).min}:${getMinSec(time).sec}`;
  circleEl.style.strokeDashoffset = 0;
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timer);
  }
}

function reduceCircle(time) {
  let secondsPassed = getSeconds() - time;
  let percent = time * 100 / getSeconds();
  let newCirc = circ * percent / 100;

  circleEl.style.strokeDashoffset = `${circ - newCirc}px`;
}

function addSessionTime() {
  minutes += 1;
  sessionDisplay.textContent = `${minutes}`;
  state = 'session';
  resetTimer();
  showPlayButton();
}

function subSessionTime() {
  minutes -= 1;
  sessionDisplay.textContent = `${minutes}`;
  state = 'session';
  resetTimer();
  showPlayButton();
}

function addBreakTime() {
  breakMinutes += 1;
  breakDisplay.textContent = `${breakMinutes}`;
  state = 'break';
  resetTimer();
  showPlayButton();
}

function subBreakTime() {
  breakMinutes -= 1;
  breakDisplay.textContent = `${breakMinutes}`;
  state = 'break';
  resetTimer();
  showPlayButton();
}

function startPauseTimer() {
  if (!isRunning) {
    startTimer();
    showPauseButton();
  } else {
    pauseTimer();
    showPlayButton();
  }
}

function showPlayButton() {
  pauseBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');
}

function showPauseButton() {
  startBtn.classList.add('hidden');
  pauseBtn.classList.remove('hidden');
}

function init() {
  let seconds = getSeconds();
  let time = getMinSec(seconds);
  let min = time.min;
  let sec = time.sec;

  document.documentElement.style.setProperty('--circumference', `${circ}px`);

  counter.textContent = `${min}:${sec}`;

  // main controls (start, pause, reset)
  startPause.addEventListener('click', e => {
    startPauseTimer();
  });
  reset.addEventListener('click', resetTimer);

  // session controls
  addSessionBtn.addEventListener('click', addSessionTime);
  subSessionBtn.addEventListener('click', () => {
    if (minutes > 1) {
      subSessionTime();
    }
  });

  // break controls
  addBreakBtn.addEventListener('click', addBreakTime);
  subBreakBtn.addEventListener('click', () => {
    if (breakMinutes > 1) {
      subBreakTime();
    }
  });

  showHideListBtn.addEventListener('click', (event) => {
    let style = window.getComputedStyle(listContainer);
    let display = style.getPropertyValue('display');

    if (display === 'flex') {
      listContainer.style.display = 'none';
      listWrapper.classList.remove('todo_width');
      event.target.textContent = '>';
    } else {
      listContainer.style.display = 'flex';
      listWrapper.classList.add('todo_width');
      event.target.textContent = '<';
    }
  });
}

document.addEventListener('DOMContentLoaded', e => {
  init();
});
