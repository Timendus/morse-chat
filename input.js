window.addEventListener("load", function() {

  // For pitchdetect.js
  audioContext = new AudioContext();
  toggleLiveInput();

});

// Connect pitchdetect to copy2

var last_tone = -1;

window.analyzer = function(tone) {
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

// From copy.js

var keyelement;
var text;
var itext;
var estimate;
var bits = ""; // goes into text
var parsed_morse = ""; // goes into itext
var parsed_morse_ant = ""; // goes into itext (past sentences)

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
      off_interpret(1000, true);
    }, 1000);
    on_interpret(e_time);
  } else {
    if (auto_off_timer) {
      clearTimeout(auto_off_timer);
      auto_off_timer = null;
    }
    off_interpret(e_time, e_time >= 1000);
  }

  console.log(bits);
  var wpm = 1420 / ((dot + interdot) / 2);
  var farns = 1420 / dot;
  console.log("" + Math.round(wpm) + " wpm " + Math.round(farns) + " farns");
}
