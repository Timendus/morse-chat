import copy2 from './lib/epxx/copy2.js';
import pitchdetect from './lib/cwilso/pitchdetect.js';

export function setup() {
  pitchdetect.toggleLiveInput();
  return true;
}

// Connect pitchdetect to copy2

var last_tone = -1;

export function analyzer(tone) {
  // We "lost the signal"
  if ( tone == -1 ) {
    sm(false);
  }

  // Never mind if the tone is too low or too high
  if ( tone < 400 || tone > 1100 ) {
    return;
  }

  console.log(tone);
  sm(true);
}


// Taken from copy.js
// initial estimates
var wpm = 20;

var dot = 1420 / wpm;
var interdot = 1.5 * dot;

var last_event = null;
var last_event_is_ON = false;

var auto_off_timer = null;

function sm(is_ON)
{
  var now = new Date();

  if (! last_event) {
    last_event = now;
    last_event_is_ON = is_ON;
    return;
  }

  if (last_event_is_ON === is_ON) {
    return;
  }

  var e_time = now.getTime() - last_event.getTime();
  e_time = Math.min(e_time, 1000);
  var e_isON = last_event_is_ON;

  last_event = now;
  last_event_is_ON = is_ON;

  if (e_isON) {
    if (auto_off_timer) {
      clearTimeout(auto_off_timer);
      auto_off_timer = null;
    }
    auto_off_timer = setTimeout(function () {
      auto_off_timer = null;
      copy2.off_interpret(1000, true);
    }, 1000);
    copy2.on_interpret(e_time);
  } else {
    if (auto_off_timer) {
      clearTimeout(auto_off_timer);
      auto_off_timer = null;
    }
    copy2.off_interpret(e_time, e_time >= 1000);
  }

  // console.log(bits);
  var wpm = 1420 / ((dot + interdot) / 2);
  var farns = 1420 / dot;
  console.log("" + Math.round(wpm) + " wpm " + Math.round(farns) + " farns");
}
