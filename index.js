const circleEl = document.querySelector('#timer_circle');
const counter = document.querySelector('.counter__txt');
const start = document.querySelector('.start__timer');
const pause = document.querySelector('.pause__timer');
const reset = document.querySelector('.reset__timer');
const addSessionBtn = document.querySelector('.add__session__time');
const subSessionBtn = document.querySelector('.sub__session__time');
const addBreakBtn = document.querySelector('.add__break__time');
const subBreakBtn = document.querySelector('.sub__break__time');
const sessionDisplay = document.querySelector('.session__time__display');
const breakDisplay = document.querySelector('.break__time__display');

let minutes = 20;
let breakMinutes = 10;
let currentTime;
let isRunning = false;
let radius = parseInt(circleEl.getAttribute('r'));
let circ = 2 * 3.14 * radius;
let state = 'session';
let seconds = getSeconds();
let tween;

function startTimer() {
  isRunning = true;
  let secs = getSeconds();
  // create a function that changes the seconds based on

  currentTime = setInterval(() => {
    secs -= 1;
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

  }, 1000);

  reduceCircle(secs);
}

function getMinSec(secs) {
  let min = Math.floor(secs / 60);
  let sec = secs - (min * 60);

  if (sec < 10) {
    sec = "0" + sec;
  }

  if (min < 10) {
    min = "0" + min;
  }

  return {
    min: min,
    sec: sec
  }
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
  clearInterval(currentTime);

  let time = getSeconds();
  counter.textContent = `${getMinSec(time).min}:${getMinSec(time).sec}`;

	circleEl.style.strokeDashoffset = 0;
	tween.progress(0);
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(currentTime);
		tween.pause();
  }
}

function reduceCircle(time) {
	tween = TweenLite.to(circleEl, time, {
		strokeDashoffset: circ
	});
}

function addSessionTime() {
  minutes += 1;
  sessionDisplay.textContent = `${minutes} mins`;
  state = 'session';
  resetTimer();
}

function subSessionTime() {
  minutes -= 1;
  sessionDisplay.textContent = `${minutes} mins`;
  state = 'session';
  resetTimer();
}

function addBreakTime() {
  breakMinutes += 1;
  breakDisplay.textContent = `${breakMinutes} mins`;
  state = 'break';
  resetTimer();
}

function subBreakTime() {
  breakMinutes -= 1;
  breakDisplay.textContent = `${breakMinutes} mins`;
  state = 'break';
  resetTimer();
}


function init() {
  let time = getMinSec(seconds);
  let min = time.min;
  let sec = time.sec;

  document.documentElement.style.setProperty('--circumference', `${circ}px`);

  counter.textContent = `${min}:${sec}`;

  // main controls
  start.addEventListener('click', (e) => {
    if (!isRunning && seconds > 0) {
      startTimer();
    }
  });
  pause.addEventListener('click', pauseTimer);
  reset.addEventListener('click', resetTimer);

  // session controls
  addSessionBtn.addEventListener('click', addSessionTime);
  subSessionBtn.addEventListener('click', () => {
    if (minutes > 1) {
      subSessionTime();
    }
  });

  addBreakBtn.addEventListener('click', addBreakTime);
  subBreakBtn.addEventListener('click', () => {
    if (breakMinutes > 1) {
      subBreakTime();
    }
  });
}

document.addEventListener('DOMContentLoaded', e => {

  init();

});


// create buttons for the break time
//
