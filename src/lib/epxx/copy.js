// Taken from https://epxx.co/morse/copy.html
// Code from http://www.softsynth.com/webaudio/tone.php

var oscillator;
var amp;

// Create an oscillator and an amplifier.
function initAudio()
{
    return;
    // Use audioContext from webaudio_tools.js
    if( audioContext )
    {
        oscillator = audioContext.createOscillator();
        fixOscillator(oscillator);
        oscillator.frequency.value = 800;
        amp = audioContext.createGain();
        amp.gain.value = 0;
    
        // Connect oscillator to amp and amp to the mixer of the audioContext.
        // This is like connecting cables between jacks on a modular synth.
        oscillator.connect(amp);
        amp.connect(audioContext.destination);
        oscillator.start(0);
    }
}

function startTone()
{
    return;
    var now = audioContext.currentTime;
    
    // oscillator.frequency.setValueAtTime(frequency, now);
    
    // Ramp up the gain so we can hear the sound.
    // We can ramp smoothly to the desired value.
    // First we should cancel any previous scheduled events that might interfere.
    amp.gain.cancelScheduledValues(now);
    // Anchor beginning of ramp at current value.
    amp.gain.setValueAtTime(amp.gain.value, now);
    amp.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.005);
}

function stopTone()
{
    return;
    var now = audioContext.currentTime;
    amp.gain.cancelScheduledValues(now);
    amp.gain.setValueAtTime(amp.gain.value, now);
    amp.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 0.005);
}

// init once the page has finished loading.
window.onload = initAudio;
function is_key(e)
{
  var keynum;
  var keychar;
  var meta;

  if (window.event) {
    e = window.event;
    keynum = e.keyCode;
  } else if (e.which) {
    keynum = e.which;
  } else {
    return false;
  }
  meta = e.altKey || e.shiftKey || e.metaKey || e.ctrlKey;

  keychar = String.fromCharCode(keynum);

  return !meta && (keychar.length === 1 && keychar.match(/[a-z0-9 ]/i));
}

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

  text.innerHTML = bits;
  var wpm = 1420 / ((dot + interdot) / 2);
  var farns = 1420 / dot;
  estimate.innerHTML = "" + Math.round(wpm) + " wpm " + Math.round(farns) + " farns";
}

function setup2()
{
  initAudio();

  text = document.getElementById("text");
  itext = document.getElementById("itext");
  keyelement = document.getElementById("key");
  estimate = document.getElementById("wpm");
  keyelement.focus();
  var kd = false;

  keyelement.onkeydown = function (e) {
    if (! is_key(e)) {
      return true;
    }

    e.returnValue = false;
    if (e.preventDefault) {
      e.preventDefault();
    }

    if (kd) {
      // protection against multiple keydowns w/o keyup
      stopTone();
      kd = false;
      key.style.color = "black";
    } else {
      kd = true;
      startTone();
      key.style.color = "red";
      sm(true);
    }

    return false;
  };

  keyelement.onkeyup = function (e) {
    if (! is_key(e)) {
      return true;
    }
    e.returnValue = false;
    if (e.preventDefault) {
      e.preventDefault();
    }

    stopTone();
    kd = false;
    key.style.color = "black";
    sm(false);

    return false;
  };

  keyelement.onblur = function (e) {
    stopTone();
    kd = false;
    key.style.color = "black";
    sm(false);
  };
}

setup2();
