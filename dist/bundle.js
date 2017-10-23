/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startSending = startSending;
exports.stopSending = stopSending;
exports.renderLog = renderLog;
exports.showMessage = showMessage;
exports.showCharacter = showCharacter;
exports.closeMessage = closeMessage;
exports.clearMessages = clearMessages;
exports.showFlashMessage = showFlashMessage;
var log = [];
var openMessage = false;

function startSending() {
  document.getElementById("text-input").disabled = true;
  document.getElementById("send-button").disabled = true;
  document.getElementById("send-button").innerText = "Sending...";
}

function stopSending() {
  document.getElementById("text-input").disabled = false;
  document.getElementById("send-button").disabled = false;
  document.getElementById("send-button").innerText = "Send";
}

function storeMessage(message, owner) {
  log.push({ message: message, owner: owner });
  localStorage.setItem('morse_log', JSON.stringify(log));
}

function renderLog() {
  log = JSON.parse(localStorage.getItem('morse_log')) || [];
  log.forEach(function (entry) {
    return renderMessage(entry.message, entry.owner);
  });
}

function showMessage(message, owner) {
  storeMessage(message, owner);
  renderMessage(message, owner);
}

function renderMessage(message, owner) {
  var messageNode = document.createElement("div");
  messageNode.className = owner;
  messageNode.innerText = message;
  document.getElementById("messages").appendChild(messageNode);
  scrollDown();
}

function newestMessage(owner) {
  var theirMessages = document.getElementsByClassName(owner);
  return theirMessages[theirMessages.length - 1];
}

function scrollDown() {
  document.getElementById("messages").scrollTop = 100000;
}

function showCharacter(character, owner) {
  if (!openMessage) {
    renderMessage("", "theirs typing");
    openMessage = true;
  }
  newestMessage(owner).innerText += character;
}

function closeMessage(owner) {
  openMessage = false;
  newestMessage(owner).classList.remove("typing");
  storeMessage(newestMessage(owner).innerText, owner);
}

function clearMessages() {
  // Erase log
  localStorage.removeItem('morse_log');
  log = [];
  // Clean up DOM
  var messages = document.getElementById("messages");
  Array.from(messages.children).forEach(function (child) {
    if (!child.classList.contains('flash')) {
      messages.removeChild(child);
    }
  });
}

function showFlashMessage(message) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var flashNode = document.createElement("div");
  flashNode.className = "flash " + level;
  flashNode.innerText = message;
  document.getElementById("messages").appendChild(flashNode);
  scrollDown();
  return flashNode;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  code_table: code_table,
  setup: setup,
  config: config,
  encode_morse: encode_morse,
  gen_timeline: gen_timeline,
  start_schedule: start_schedule
};

function code_table() {
  return code;
}

// Taken from https://epxx.co/morse/

var audio_status = 0;
var a = {};
var sample = 0;
var SAMPLE_RATE = 48000;

a.playing = false;

var ERROR_NONFATAL = '×';
var ERROR_FATAL = '÷';

var code = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
  'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
  'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
  'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
  'Z': '--..',
  '0': '-----', ',': '--..--',
  '1': '.----', '.': '.-.-.-',
  '2': '..---', '?': '..--..',
  '3': '...--', ';': '-.-.-.',
  '4': '....-', ':': '---...',
  '5': '.....', "'": '.----.',
  '6': '-....', '-': '-....-',
  '7': '--...', '/': '-..-.',
  '8': '---..', '(': '-.--.-',
  '9': '----.', ')': '-.--.-',
  ' ': ' ', '_': '..--.-',
  '@': '.--.-.', '$': '...-..-',
  '&': '.-...', '!': '-.-.--',
  '\n': '\n',
  '×': 'ee',
  '÷': 'fff'
};

a.code = code;

var nonascii = [['çÇ©', 'C'], ['ñÑ', 'N'], ['ÁÃÀÂÄáãàâä', 'A'], ['ÉÈÊËéèêë', 'E'], ['ÍÌÎÏíìîï', 'I'], ['ÓÒÔÖÕóòôöõ', 'O'], ['ÚÙÛÜúùûü', 'U'], ['', 'AP']];

a.nonascii = nonascii;

function ramp(pos, length, dotlength) {
  /*
  Generates a fadein/fadeout ramp for sound
  */

  var rvolume = 1.0;
  var fadein = Math.min(SAMPLE_RATE * 0.002, 0.1 * dotlength);
  var fadeout = length - fadein;
  if (pos < fadein) {
    rvolume = pos / fadein;
  } else if (pos > fadeout) {
    rvolume = (length - pos) / fadein;
  }

  rvolume = Math.sin(Math.PI * rvolume / 2);
  rvolume *= rvolume;

  return rvolume;
}

function generate_float_wave(freq, volume, duration, dotduration) {
  var sduration = Math.floor(SAMPLE_RATE * duration);
  var sdotduration = Math.floor(SAMPLE_RATE * dotduration);
  var samples = a.ctx.createBuffer(1, sduration, SAMPLE_RATE);
  var s = samples.getChannelData(0);

  for (var i = 0; i < sduration; ++i) {
    s[i] = Math.sin(freq * (i / SAMPLE_RATE) * Math.PI * 2) * volume * ramp(i, sduration, sdotduration);
  }

  return samples;
}

function cast_alphabet(input) {
  /*
  Filters a text message for Morse encoding.
  The input should be Unicode.
  Characters that have no Morse symbol are removed.
   Some Latin characters like "é" are converted to the
  non-accented version ("e") to mitigate the loss. See
  module.nonascii tuple for details.
  */

  input = input.toUpperCase();
  var output = "";
  for (var i = 0; i < input.length; ++i) {
    var c = input[i];
    for (var j = 0; j < nonascii.length; ++j) {
      var chars = nonascii[j][0];
      var replacement = nonascii[j][1];
      if (chars.indexOf(c) != -1) {
        c = replacement;
        break;
      }
    }
    if (code[c]) {
      output += c;
    }
  }

  return output;
}

var cfg = {};
cfg['.'] = 1.0;

function make_audio_samples() {
  /*
  Prepares audio samples.
  */

  var dot_duration = cfg['FARNS_DOT_LENGTH'] * cfg['.'];
  var dash_duration = cfg['FARNS_DOT_LENGTH'] * cfg['-'];
  var interbit_duration = cfg['FARNS_DOT_LENGTH'] * cfg['i'];
  var space_duration = cfg['WPM_DOT_LENGTH'] * cfg[' '];
  var interword_duration = cfg['WPM_DOT_LENGTH'] * cfg['w'];

  var err_dot_duration = 0.05 * cfg['.'];
  var err_dash_duration = 0.05 * cfg['-'];

  cfg['sample.'] = generate_float_wave(cfg['freq'], cfg['volume'], dot_duration, dot_duration);
  cfg['sample-'] = generate_float_wave(cfg['freq'], cfg['volume'], dash_duration, dot_duration);
  cfg['samplee'] = generate_float_wave(cfg['freq'] / 1.4, cfg['volume'], err_dot_duration, err_dot_duration);
  cfg['samplef'] = generate_float_wave(cfg['freq'] / 1.4, cfg['volume'], err_dash_duration, err_dot_duration);

  cfg['duration.'] = dot_duration;
  cfg['duration-'] = dash_duration;
  cfg['duratione'] = err_dot_duration;
  cfg['durationf'] = err_dash_duration;
  cfg['durationi'] = interbit_duration;
  cfg['duration '] = space_duration;
  cfg['durationw'] = interword_duration;
}

function config(freq, volume, wpm, farns, dash, interbit, intersymbol, interword) {
  /*
  Configure Morse code sound and rhythm.
   freq: beep frequency, in Hz. Default 800Hz
   volume: volume between 0.0 and 1.0. Default: 0.25
   wpm: speed in words per minute. Default: 20.0
      Dot sound length will be made = 1.42 / wpm,
     so e.g. 20 WPM translates to a dot of ~70ms,
     and all the rest will be proportional to this.
         farns: Fansworth compression, expressed in wpm
      Regulates the signalling speed. If hither than wpm,
             the signalling will be played in 'farns' speed but
             the intersymbol space is proportional to 'wpm'.
   dash: dash sound length, in dots. Default: 3 times a dot.
   interbit: silence between Morse dits and dats, in dots. Default: 0.6 dots.
   intersymbol: silence between two letters, in dots. Default: 2 dots.
   interword: silence between two words (space), in dots. Default: 3 dots
  */

  farns = Math.max(wpm, farns ? farns : wpm);

  cfg['compensation'] = 1;

  cfg['WPM'] = wpm;
  cfg['FARNS'] = farns;
  cfg['WPM_DOT_LENGTH'] = 1.42 / wpm / cfg['compensation'];
  cfg['FARNS_DOT_LENGTH'] = 1.42 / farns / cfg['compensation'];
  cfg['-'] = dash;
  cfg['i'] = interbit;
  cfg[' '] = intersymbol;
  cfg['w'] = interword;
  cfg['freq'] = freq;
  cfg['volume'] = volume;

  make_audio_samples();
}

function encode_morse(input) {
  // Coerce the message into the supported alphabet.
  // See "nonascii" tuple.
  input = cast_alphabet(input);
  var output = "";
  for (var i = 0; i < input.length; ++i) {
    var c = input[i];
    var k = code[c];
    if (!k) {
      continue;
    }
    output += k;
    if (k != ' ') {
      output += ' ';
    }
  }
  return [input, output];
}

function gen_timeline(bits) {
  a.timeline = [];
  var timestamp = 0;
  var lastbit = "#";
  var interword = false;

  for (var i = 0; i < bits.length; ++i) {
    var bit = bits[i];
    if (bit == "\n") {
      bit = " ";
    }
    if (lastbit == "." || lastbit == "-" || lastbit == "e" || lastbit == "f") {
      timestamp += cfg['duration' + 'i'];
    }

    if (cfg['sample' + bit]) {
      a.timeline.push([cfg['sample' + bit], timestamp, cfg['duration' + bit]]);
    }

    if (bit == ' ' && lastbit == ' ') {
      // just add inter-word
      if (!interword) {
        timestamp += cfg['durationw'];
        interword = true;
      }
    } else {
      timestamp += cfg['duration' + bit];
      interword = false;
    }
    lastbit = bit;
  }
}

function schedule() {
  var now = a.ctx.currentTime;
  // schedule up to 1 second ahead current time
  var sch_limit = now + 1;
  var last_note_finishes_at = now;

  while (a.timeline_pos < a.timeline.length) {
    var sample = a.timeline[a.timeline_pos][0];
    var timestamp = a.timeline[a.timeline_pos][1] + a.currentTime0;
    var duration = a.timeline[a.timeline_pos][2];

    if (timestamp > sch_limit) {
      // ok, we have scheduled enough
      setTimeout(schedule, 250);
      return;
    } else if (timestamp < now) {
      // we are late! try to compensate that so at least we avoid
      // all samples mounting together immediately
      var delay = now - timestamp + 0.2;
      console.log("Corrective delay " + delay);
      a.currentTime0 += delay;
      timestamp += delay;
    }

    var node = a.ctx.createBufferSource();
    node.buffer = sample;
    node.connect(a.ctx.destination);
    node.start ? node.start(timestamp) : node.noteOn(timestamp);
    ++a.timeline_pos;
    // console.log(timestamp, sch_limit);

    last_note_finishes_at = timestamp + duration;
  }

  // end of timeline
  a.playing = false;
  a.timeline = [];
  setTimeout(function () {
    if (a.end_cb) {
      var cb = a.end_cb;
      a.end_cb = null;
      cb();
    }
  }, 1000 * (last_note_finishes_at - now));
}

function start_schedule(end_cb) {
  a.currentTime0 = a.ctx.currentTime + 0.2;
  a.timeline_pos = 0;
  a.playing = true;
  a.end_cb = end_cb;
  schedule();
}

function bad_browser() {
  alert("Your browser does not support Audio API (HTML5).\nPlease use a compatible browser e.g. Chrome with Audio API enabled in page about:flags\n\nMorse encoding to text can still be used.");
}

function setup() {
  if (audio_status) {
    return;
  }

  if (!window.AudioContext) {
    if (!window.webkitAudioContext) {
      audio_status = 2;
      bad_browser();
      return;
    }
    window.AudioContext = window.webkitAudioContext;
    window.AudioNode = window.webkitAudioNode;
  }

  a.ctx = new AudioContext();

  audio_status = 1;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;
exports.analyzer = analyzer;

var _copy = __webpack_require__(10);

var _copy2 = _interopRequireDefault(_copy);

var _pitchdetect = __webpack_require__(11);

var _pitchdetect2 = _interopRequireDefault(_pitchdetect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setup() {
  _pitchdetect2.default.toggleLiveInput();
  return true;
}

// Connect pitchdetect to copy2

var last_tone = -1;

function analyzer(tone) {
  // We "lost the signal"
  if (tone == -1) {
    sm(false);
  }

  // Never mind if the tone is too low or too high
  if (tone < 400 || tone > 1100) {
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

function sm(is_ON) {
  var now = new Date();

  if (!last_event) {
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
      _copy2.default.off_interpret(1000, true);
    }, 1000);
    _copy2.default.on_interpret(e_time);
  } else {
    if (auto_off_timer) {
      clearTimeout(auto_off_timer);
      auto_off_timer = null;
    }
    _copy2.default.off_interpret(e_time, e_time >= 1000);
  }

  // console.log(bits);
  var wpm = 1420 / ((dot + interdot) / 2);
  var farns = 1420 / dot;
  console.log("" + Math.round(wpm) + " wpm " + Math.round(farns) + " farns");
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

var _chatroom = __webpack_require__(0);

var chatroom = _interopRequireWildcard(_chatroom);

var _output = __webpack_require__(9);

var output = _interopRequireWildcard(_output);

var _input = __webpack_require__(2);

var input = _interopRequireWildcard(_input);

var _runtime = __webpack_require__(12);

var runtime = _interopRequireWildcard(_runtime);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Start execution


// Load javascripts
window.addEventListener('load', function () {
  output.setup();
  chatroom.renderLog();
  input.setup() && chatroom.showFlashMessage("Listening for morse signals...", "info");

  document.getElementById("text-input").addEventListener("keyup", function (e) {
    if (e.keyCode == 13) output.sendMessage();
  });
  document.getElementById("send-button").addEventListener("click", output.sendMessage);
  document.getElementById("clear").addEventListener("click", chatroom.clearMessages);
});

// Service worker setup
// Load styling
if ('serviceWorker' in navigator) {

  // This is the callback that the service worker can do on us
  navigator.serviceWorker.addEventListener('message', function (event) {
    switch (event.data.action) {
      case 'new_version':
        var element = chatroom.showFlashMessage("There is a new version available! Click here to reload the app", "notice clickable");
        element.addEventListener("click", function () {
          return location.reload();
        });
        break;
    }
  });

  // Here we register the service worker
  var registration = runtime.register();
}

// Done
console.log("Ready!");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\nhtml, body, .messages, .input {\n  margin: 0px auto;\n  padding: 0px;\n  font-family: Tahoma, Arial, sans-serif;\n  font-size: 13px; }\n\nbody {\n  display: grid;\n  grid-template-columns: 20vw 64vw 16vw;\n  grid-template-rows: calc(100vh - 40px) 40px;\n  grid-template-areas: \"navbar chatroom chatroom\" \"navbar textinput send\";\n  justify-content: center; }\n  @media (max-width: 768px) {\n    body {\n      grid-template-columns: 80vw 20vw;\n      grid-template-rows: 40px calc(100vh - 80px) 40px;\n      grid-template-areas: \"navbar navbar\" \"chatroom chatroom\" \"textinput send\"; } }\n  body .navbar {\n    grid-area: navbar; }\n  body .messages {\n    grid-area: chatroom; }\n  body textarea {\n    grid-area: textinput; }\n  body button {\n    grid-area: send; }\n\n.navbar {\n  display: flex;\n  background-color: white; }\n  .navbar h1 {\n    font-size: 1.8em;\n    text-align: center;\n    margin: 0;\n    padding: 0; }\n  @media (min-width: 769px) {\n    .navbar {\n      flex-direction: column;\n      align-items: stretch;\n      border-right: 1px solid #ddd; }\n      .navbar h1 {\n        margin: 2em 10px; }\n      .navbar button {\n        padding: 1em;\n        margin: 5px 10px; } }\n  @media (max-width: 768px) {\n    .navbar {\n      flex-direction: row;\n      border-bottom: 1px solid #ddd; }\n      .navbar h1, .navbar button {\n        flex-grow: 1; }\n      .navbar h1 {\n        line-height: 40px; }\n      .navbar button {\n        margin-left: 0; } }\n\n.messages {\n  width: 100%;\n  box-sizing: border-box;\n  padding: 1em 1.5em;\n  background-color: white;\n  overflow-y: scroll;\n  border-bottom: 1px solid #ddd; }\n  .messages .theirs, .messages .mine {\n    position: relative;\n    border: 0px;\n    width: fit-content;\n    min-width: 15%;\n    max-width: 70%;\n    padding: 1em;\n    border-radius: 10px; }\n    .messages .theirs:first-letter, .messages .mine:first-letter {\n      text-transform: uppercase; }\n    .messages .theirs:before, .messages .mine:before {\n      content: '';\n      position: absolute;\n      top: -15px;\n      height: 0;\n      width: 0;\n      border: 15px solid transparent;\n      transform: rotateZ(45deg); }\n  .messages .mine {\n    margin: 1em 0 0 auto;\n    background-color: #cdeccd; }\n    .messages .mine:before {\n      right: -5px;\n      border-right: 15px solid #cdeccd; }\n    .messages .mine + .mine {\n      margin-top: 0.3em; }\n      .messages .mine + .mine:before {\n        display: none; }\n  .messages .theirs {\n    margin: 1em auto 0 0;\n    background-color: #e7e7ff; }\n    .messages .theirs:before {\n      left: -5px;\n      border-bottom: 15px solid #e7e7ff; }\n    .messages .theirs + .theirs {\n      margin-top: 0.3em; }\n      .messages .theirs + .theirs:before {\n        display: none; }\n  .messages .typing:after {\n    content: '\\2026'; }\n  .messages .flash {\n    margin: 1em 0 0 0;\n    text-align: center;\n    font-size: 0.8em;\n    font-style: italic;\n    line-height: 3em;\n    border-radius: 10px; }\n    .messages .flash.info {\n      background-color: #e7e7ff; }\n    .messages .flash.notice {\n      background-color: #efec89; }\n    .messages .flash.clickable {\n      cursor: pointer; }\n\ntextarea, button {\n  box-sizing: border-box;\n  border-radius: 5px;\n  margin: 5px; }\n\ntextarea {\n  font-size: 20px;\n  margin-right: 0px;\n  border: 0px; }\n\nbutton {\n  font-size: 1em;\n  background-color: #eee;\n  border: 1px solid #ddd;\n  cursor: pointer; }\n  button:hover {\n    border-color: #ccc;\n    background-color: #ddd; }\n", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(8);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.setup = setup;
exports.sendMessage = sendMessage;

var _chatroom = __webpack_require__(0);

var chatroom = _interopRequireWildcard(_chatroom);

var _morse = __webpack_require__(1);

var _morse2 = _interopRequireDefault(_morse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Morse generation settings:
var tone = 600;
var volume = 50;
var wpm = 20;
var farns = 20;

function setup() {
  _morse2.default.setup();
  _morse2.default.config(tone, volume / 100, wpm, farns, 3, 0.6, 2, 3);
}

function playAsMorse(message, callback) {
  var input, output;

  var _morse$encode_morse = _morse2.default.encode_morse(message);

  var _morse$encode_morse2 = _slicedToArray(_morse$encode_morse, 2);

  input = _morse$encode_morse2[0];
  output = _morse$encode_morse2[1];

  console.log("Sending this code: " + output);
  _morse2.default.gen_timeline(output);
  _morse2.default.start_schedule(callback);
}

function sendMessage() {
  chatroom.startSending();
  var message = document.getElementById("text-input").value.toLowerCase();

  chatroom.showMessage(message, "mine");

  playAsMorse(message, function () {
    document.getElementById("text-input").value = "";
    chatroom.stopSending();
    document.getElementById("text-input").focus();
  });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  on_interpret: on_interpret,
  off_interpret: off_interpret,
  parse_morse: parse_morse
};

var chatroom = __webpack_require__(0);
var morse = __webpack_require__(1);

// Taken from https://epxx.co/morse/copy.html

// initial estimates
var wpm = 20;

var dot = 1420 / wpm;
var dotdev = 0;

var interdot = 1.5 * dot;
var interdotdev = 0;

var dot_proportion = 0.5;
var interdot_proportion = 0.75;

var dot_proportion_weight = 0.05;
var dot_adj_weight = 0.1;
var interdot_proportion_weight = 0.05;
var interdot_adj_weight = 0.1;

var keyelement;
var text;
var itext;
var estimate;
var bits = ""; // goes into text
var parsed_morse = ""; // goes into itext
var parsed_morse_ant = ""; // goes into itext (past sentences)

function on_interpret(time) {
  var is_dot = 0;
  if (time > dot * 3 + dotdev) {
    // definitively dash
    bits += "-";
    is_dot = -1;
  } else if (time > dot * 1.9 + dotdev) {
    // take as dash
    bits += "-";
  } else if (time < dot) {
    // definitively dot
    is_dot = 2;
    bits += ".";
  } else {
    // take as dot
    is_dot = 1;
    bits += ".";
  }

  console.log("ON time " + Math.round(time));

  // moving average of dot/dash proportion
  dot_proportion = (1 - dot_proportion_weight) * dot_proportion + dot_proportion_weight * (is_dot > 0 ? 1 : 0);
  // console.log("Proportion of dots: " + Math.round(dot_proportion * 100) + "%");

  var weight = dot_adj_weight;
  if (is_dot >= 2) {
    // dot is certainly shorter than current wpm estimation
  } else if (is_dot < 0) {
    // dash is certainly longer than current wpm estimation
    time /= 3;
  } else {
    // calibrate weight as proportion dot/dash deviates from 50%
    weight *= 2 * Math.abs(dot_proportion - 0.5);
    if (dot_proportion > 0.5) {
      // too many dots; consider that `time` is most probably a dash
      // convert dash time to dot time
      time /= 3;
    } else {
      // too many dashes; consider that `time` is most probably a dot 
    }
  }
  dot = (1.0 - weight) * dot + weight * time;
  dotdev = (1.0 - weight) * dotdev + weight * Math.abs(dot - time);
  console.log("dot time " + Math.round(dot) + " " + Math.round(dotdev));
}

function off_interpret(time, to) {
  var is_interdot = 0;

  if (to) {
    // timeout
    parse_morse(2); // inter-sentence
    is_interdot = -2;
  } else if (time > interdot * 3.5) {
    // probably inter-word
    is_interdot = -2;
    parse_morse(1);
  } else if (time > interdot * 2 + interdotdev) {
    // certainly inter-letter
    is_interdot = -1;
    parse_morse(0);
  } else if (time > interdot * 1.5 + interdotdev) {
    // take as inter-letter
    parse_morse(0);
  } else if (time < interdot) {
    // definitively inter-dot
    is_interdot = 2;
  } else {
    // take as inter-dot
    is_interdot = 1;
  }

  console.log("OFF time " + (to ? "to" : Math.round(time)));

  if (to) {
    // do not take timeout into account for moving avgs
    return;
  }

  // moving average of 'spaces'
  interdot_proportion = (1 - interdot_proportion_weight) * interdot_proportion + interdot_proportion_weight * (is_interdot > 0 ? 1 : 0);
  // console.log("Proportion of interdot: " + Math.round(interdot_proportion * 100) + "%");

  var weight = interdot_adj_weight;
  if (is_interdot >= 2) {
    // interdot is certainly shorter than current wpm estimation
  } else if (is_interdot < 0) {
    // interdot is certainly longer than current wpm estimation
    time /= 2.5;
  } else {
    // scale weight as proportion interdot/interletter deviates from 75%
    weight *= 4 * Math.min(0.25, Math.abs(interdot_proportion - 0.75));
    if (interdot_proportion > 0.75) {
      // too many interdots; consider that `time` is most probably inter-letter
      // convert inter-letter time to interdot time
      time /= 2.5;
    } else {
      // too many dashes; consider that `time` is most probably a dot 
    }
  }
  interdot = (1.0 - weight) * interdot + weight * time;
  interdotdev = (1.0 - weight) * interdotdev + weight * Math.abs(interdot - time);
  console.log("interdot time " + Math.round(interdot) + " " + Math.round(interdotdev));
}

function parse_morse(pause) {
  console.log("Parsing " + bits);
  if (bits.length <= 0) {
    return;
  }

  var c = "#";
  for (var k in morse.code_table()) {
    if (morse.code_table()[k] === bits) {
      c = k;
      break;
    }
  }
  parsed_morse += c;
  bits = "";

  chatroom.showCharacter(c.toLowerCase(), "theirs");

  if (pause >= 2) {
    // inter-sentence
    parsed_morse_ant = parsed_morse + "<br>" + parsed_morse_ant;
    // showMessage(parsed_morse.toLowerCase(), "theirs");
    chatroom.closeMessage("theirs");
    parsed_morse = "";
  } else if (pause >= 1) {
    // inter-word
    parsed_morse += " ";
    chatroom.showCharacter(" ", "theirs");
  }

  // text.innerHTML = bits;
  // itext.innerHTML = parsed_morse + "<br>" + parsed_morse_ant;
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  toggleLiveInput: toggleLiveInput
};

var input = __webpack_require__(2);

/*
The MIT License (MIT)
Copyright (c) 2014 Chris Wilson
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var DEBUGCANVAS = null;
var mediaStreamSource = null;
var detectorElem, canvasElem, waveCanvas, pitchElem, noteElem, detuneElem, detuneAmount;

// window.onload = function() {
//   audioContext = new AudioContext();
//   MAX_SIZE = Math.max(4,Math.floor(audioContext.sampleRate/5000));  // corresponds to a 5kHz signal
//   var request = new XMLHttpRequest();
//   request.open("GET", "../sounds/whistling3.ogg", true);
//   request.responseType = "arraybuffer";
//   request.onload = function() {
//     audioContext.decodeAudioData( request.response, function(buffer) { 
//         theBuffer = buffer;
//     } );
//   }
//   request.send();

//   detectorElem = document.getElementById( "detector" );
//   canvasElem = document.getElementById( "output" );
//   DEBUGCANVAS = document.getElementById( "waveform" );
//   if (DEBUGCANVAS) {
//     waveCanvas = DEBUGCANVAS.getContext("2d");
//     waveCanvas.strokeStyle = "black";
//     waveCanvas.lineWidth = 1;
//   }
//   pitchElem = document.getElementById( "pitch" );
//   noteElem = document.getElementById( "note" );
//   detuneElem = document.getElementById( "detune" );
//   detuneAmount = document.getElementById( "detune_amt" );

//   detectorElem.ondragenter = function () { 
//     this.classList.add("droptarget"); 
//     return false; };
//   detectorElem.ondragleave = function () { this.classList.remove("droptarget"); return false; };
//   detectorElem.ondrop = function (e) {
//       this.classList.remove("droptarget");
//       e.preventDefault();
//     theBuffer = null;

//       var reader = new FileReader();
//       reader.onload = function (event) {
//         audioContext.decodeAudioData( event.target.result, function(buffer) {
//           theBuffer = buffer;
//         }, function(){alert("error loading!");} ); 

//       };
//       reader.onerror = function (event) {
//         alert("Error: " + reader.error );
//     };
//       reader.readAsArrayBuffer(e.dataTransfer.files[0]);
//       return false;
//   };


// }

function error() {
  alert('Stream generation failed.');
}

function getUserMedia(dictionary, callback) {
  try {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia(dictionary, callback, error);
  } catch (e) {
    alert('getUserMedia threw exception :' + e);
  }
}

function gotStream(stream) {
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Connect it to the destination.
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  mediaStreamSource.connect(analyser);
  updatePitch();
}

function toggleOscillator() {
  if (isPlaying) {
    //stop playing and return
    sourceNode.stop(0);
    sourceNode = null;
    analyser = null;
    isPlaying = false;
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
    window.cancelAnimationFrame(rafID);
    return "play oscillator";
  }
  sourceNode = audioContext.createOscillator();

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  sourceNode.connect(analyser);
  analyser.connect(audioContext.destination);
  sourceNode.start(0);
  isPlaying = true;
  isLiveInput = false;
  updatePitch();

  return "stop";
}

function toggleLiveInput() {
  if (isPlaying) {
    //stop playing and return
    sourceNode.stop(0);
    sourceNode = null;
    analyser = null;
    isPlaying = false;
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
    window.cancelAnimationFrame(rafID);
  }
  getUserMedia({
    "audio": {
      "mandatory": {
        "googEchoCancellation": "false",
        "googAutoGainControl": "false",
        "googNoiseSuppression": "false",
        "googHighpassFilter": "false"
      },
      "optional": []
    }
  }, gotStream);
}

function togglePlayback() {
  if (isPlaying) {
    //stop playing and return
    sourceNode.stop(0);
    sourceNode = null;
    analyser = null;
    isPlaying = false;
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
    window.cancelAnimationFrame(rafID);
    return "start";
  }

  sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = theBuffer;
  sourceNode.loop = true;

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  sourceNode.connect(analyser);
  analyser.connect(audioContext.destination);
  sourceNode.start(0);
  isPlaying = true;
  isLiveInput = false;
  updatePitch();

  return "stop";
}

var rafID = null;
var tracks = null;
var buflen = 1024;
var buf = new Float32Array(buflen);

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteFromPitch(frequency) {
  var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function centsOffFromPitch(frequency, note) {
  return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
}

// this is a float version of the algorithm below - but it's not currently used.
/*
function autoCorrelateFloat( buf, sampleRate ) {
  var MIN_SAMPLES = 4;  // corresponds to an 11kHz signal
  var MAX_SAMPLES = 1000; // corresponds to a 44Hz signal
  var SIZE = 1000;
  var best_offset = -1;
  var best_correlation = 0;
  var rms = 0;
  if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES))
    return -1;  // Not enough data
  for (var i=0;i<SIZE;i++)
    rms += buf[i]*buf[i];
  rms = Math.sqrt(rms/SIZE);
  for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
    var correlation = 0;
    for (var i=0; i<SIZE; i++) {
      correlation += Math.abs(buf[i]-buf[i+offset]);
    }
    correlation = 1 - (correlation/SIZE);
    if (correlation > best_correlation) {
      best_correlation = correlation;
      best_offset = offset;
    }
  }
  if ((rms>0.1)&&(best_correlation > 0.1)) {
    console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")");
  }
//  var best_frequency = sampleRate/best_offset;
}
*/

var MIN_SAMPLES = 0; // will be initialized when AudioContext is created.
var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

function autoCorrelate(buf, sampleRate) {
  var SIZE = buf.length;
  var MAX_SAMPLES = Math.floor(SIZE / 2);
  var best_offset = -1;
  var best_correlation = 0;
  var rms = 0;
  var foundGoodCorrelation = false;
  var correlations = new Array(MAX_SAMPLES);

  for (var i = 0; i < SIZE; i++) {
    var val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) // not enough signal
    return -1;

  var lastCorrelation = 1;
  for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    var correlation = 0;

    for (var i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buf[i] - buf[i + offset]);
    }
    correlation = 1 - correlation / MAX_SAMPLES;
    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
    if (correlation > GOOD_ENOUGH_CORRELATION && correlation > lastCorrelation) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {
      // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
      // Now we need to tweak the offset - by interpolating between the values to the left and right of the
      // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
      // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
      // (anti-aliased) offset.

      // we know best_offset >=1, 
      // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
      // we can't drop into this clause until the following pass (else if).
      var shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];
      return sampleRate / (best_offset + 8 * shift);
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
    return sampleRate / best_offset;
  }
  return -1;
  //  var best_frequency = sampleRate/best_offset;
}

function updatePitch(time) {
  var cycles = new Array();
  analyser.getFloatTimeDomainData(buf);
  var ac = autoCorrelate(buf, audioContext.sampleRate);
  // TODO: Paint confidence meter on canvasElem here.

  if (DEBUGCANVAS) {
    // This draws the current waveform, useful for debugging
    waveCanvas.clearRect(0, 0, 512, 256);
    waveCanvas.strokeStyle = "red";
    waveCanvas.beginPath();
    waveCanvas.moveTo(0, 0);
    waveCanvas.lineTo(0, 256);
    waveCanvas.moveTo(128, 0);
    waveCanvas.lineTo(128, 256);
    waveCanvas.moveTo(256, 0);
    waveCanvas.lineTo(256, 256);
    waveCanvas.moveTo(384, 0);
    waveCanvas.lineTo(384, 256);
    waveCanvas.moveTo(512, 0);
    waveCanvas.lineTo(512, 256);
    waveCanvas.stroke();
    waveCanvas.strokeStyle = "black";
    waveCanvas.beginPath();
    waveCanvas.moveTo(0, buf[0]);
    for (var i = 1; i < 512; i++) {
      waveCanvas.lineTo(i, 128 + buf[i] * 128);
    }
    waveCanvas.stroke();
  }

  input.analyzer(ac);

  // if (ac == -1) {
  //   detectorElem.className = "vague";
  //   pitchElem.innerText = "--";
  //   noteElem.innerText = "-";
  //   detuneElem.className = "";
  //   detuneAmount.innerText = "--";
  // } else {
  //   detectorElem.className = "confident";
  //   pitch = ac;
  //   pitchElem.innerText = Math.round( pitch ) ;
  //   var note =  noteFromPitch( pitch );
  //   noteElem.innerHTML = noteStrings[note%12];
  //   var detune = centsOffFromPitch( pitch, note );
  //   if (detune == 0 ) {
  //     detuneElem.className = "";
  //     detuneAmount.innerHTML = "--";
  //   } else {
  //     if (detune < 0)
  //       detuneElem.className = "flat";
  //     else
  //       detuneElem.className = "sharp";
  //     detuneAmount.innerHTML = Math.abs( detune );
  //   }
  // }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame;
  rafID = window.requestAnimationFrame(updatePitch);
}

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var serviceWorkerOption = {"scriptURL":"/sw.js"};
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable flowtype/require-valid-file-annotation */
/* global serviceWorkerOption */

exports.default = {
  register: function register() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (navigator.serviceWorker) {
      return navigator.serviceWorker.register(serviceWorkerOption.scriptURL, options);
    }

    return false;
  }
};
module.exports = exports["default"];

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjA5MjQzMjg2ZmFlNGQ4ZDYxNGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NoYXRyb29tLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZXB4eC9tb3JzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZXNoZWV0cy9pbmRleC5zY3NzPzVmNDkiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlc2hlZXRzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9vdXRwdXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9lcHh4L2NvcHkyLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvY3dpbHNvL3BpdGNoZGV0ZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zZXJ2aWNld29ya2VyLXdlYnBhY2stcGx1Z2luL2xpYi9ydW50aW1lLmpzIl0sIm5hbWVzIjpbInN0YXJ0U2VuZGluZyIsInN0b3BTZW5kaW5nIiwicmVuZGVyTG9nIiwic2hvd01lc3NhZ2UiLCJzaG93Q2hhcmFjdGVyIiwiY2xvc2VNZXNzYWdlIiwiY2xlYXJNZXNzYWdlcyIsInNob3dGbGFzaE1lc3NhZ2UiLCJsb2ciLCJvcGVuTWVzc2FnZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJkaXNhYmxlZCIsImlubmVyVGV4dCIsInN0b3JlTWVzc2FnZSIsIm1lc3NhZ2UiLCJvd25lciIsInB1c2giLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlIiwiZ2V0SXRlbSIsImZvckVhY2giLCJyZW5kZXJNZXNzYWdlIiwiZW50cnkiLCJtZXNzYWdlTm9kZSIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJhcHBlbmRDaGlsZCIsInNjcm9sbERvd24iLCJuZXdlc3RNZXNzYWdlIiwidGhlaXJNZXNzYWdlcyIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJsZW5ndGgiLCJzY3JvbGxUb3AiLCJjaGFyYWN0ZXIiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJyZW1vdmVJdGVtIiwibWVzc2FnZXMiLCJBcnJheSIsImZyb20iLCJjaGlsZHJlbiIsImNoaWxkIiwiY29udGFpbnMiLCJyZW1vdmVDaGlsZCIsImxldmVsIiwiZmxhc2hOb2RlIiwibW9kdWxlIiwiZXhwb3J0cyIsImNvZGVfdGFibGUiLCJzZXR1cCIsImNvbmZpZyIsImVuY29kZV9tb3JzZSIsImdlbl90aW1lbGluZSIsInN0YXJ0X3NjaGVkdWxlIiwiY29kZSIsImF1ZGlvX3N0YXR1cyIsImEiLCJzYW1wbGUiLCJTQU1QTEVfUkFURSIsInBsYXlpbmciLCJFUlJPUl9OT05GQVRBTCIsIkVSUk9SX0ZBVEFMIiwibm9uYXNjaWkiLCJyYW1wIiwicG9zIiwiZG90bGVuZ3RoIiwicnZvbHVtZSIsImZhZGVpbiIsIk1hdGgiLCJtaW4iLCJmYWRlb3V0Iiwic2luIiwiUEkiLCJnZW5lcmF0ZV9mbG9hdF93YXZlIiwiZnJlcSIsInZvbHVtZSIsImR1cmF0aW9uIiwiZG90ZHVyYXRpb24iLCJzZHVyYXRpb24iLCJmbG9vciIsInNkb3RkdXJhdGlvbiIsInNhbXBsZXMiLCJjdHgiLCJjcmVhdGVCdWZmZXIiLCJzIiwiZ2V0Q2hhbm5lbERhdGEiLCJpIiwiY2FzdF9hbHBoYWJldCIsImlucHV0IiwidG9VcHBlckNhc2UiLCJvdXRwdXQiLCJjIiwiaiIsImNoYXJzIiwicmVwbGFjZW1lbnQiLCJpbmRleE9mIiwiY2ZnIiwibWFrZV9hdWRpb19zYW1wbGVzIiwiZG90X2R1cmF0aW9uIiwiZGFzaF9kdXJhdGlvbiIsImludGVyYml0X2R1cmF0aW9uIiwic3BhY2VfZHVyYXRpb24iLCJpbnRlcndvcmRfZHVyYXRpb24iLCJlcnJfZG90X2R1cmF0aW9uIiwiZXJyX2Rhc2hfZHVyYXRpb24iLCJ3cG0iLCJmYXJucyIsImRhc2giLCJpbnRlcmJpdCIsImludGVyc3ltYm9sIiwiaW50ZXJ3b3JkIiwibWF4IiwiayIsImJpdHMiLCJ0aW1lbGluZSIsInRpbWVzdGFtcCIsImxhc3RiaXQiLCJiaXQiLCJzY2hlZHVsZSIsIm5vdyIsImN1cnJlbnRUaW1lIiwic2NoX2xpbWl0IiwibGFzdF9ub3RlX2ZpbmlzaGVzX2F0IiwidGltZWxpbmVfcG9zIiwiY3VycmVudFRpbWUwIiwic2V0VGltZW91dCIsImRlbGF5IiwiY29uc29sZSIsIm5vZGUiLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJidWZmZXIiLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJzdGFydCIsIm5vdGVPbiIsImVuZF9jYiIsImNiIiwiYmFkX2Jyb3dzZXIiLCJhbGVydCIsIndpbmRvdyIsIkF1ZGlvQ29udGV4dCIsIndlYmtpdEF1ZGlvQ29udGV4dCIsIkF1ZGlvTm9kZSIsIndlYmtpdEF1ZGlvTm9kZSIsImFuYWx5emVyIiwidG9nZ2xlTGl2ZUlucHV0IiwibGFzdF90b25lIiwidG9uZSIsInNtIiwiZG90IiwiaW50ZXJkb3QiLCJsYXN0X2V2ZW50IiwibGFzdF9ldmVudF9pc19PTiIsImF1dG9fb2ZmX3RpbWVyIiwiaXNfT04iLCJEYXRlIiwiZV90aW1lIiwiZ2V0VGltZSIsImVfaXNPTiIsImNsZWFyVGltZW91dCIsIm9mZl9pbnRlcnByZXQiLCJvbl9pbnRlcnByZXQiLCJyb3VuZCIsImNoYXRyb29tIiwicnVudGltZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwia2V5Q29kZSIsInNlbmRNZXNzYWdlIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsImV2ZW50IiwiZGF0YSIsImFjdGlvbiIsImVsZW1lbnQiLCJsb2NhdGlvbiIsInJlbG9hZCIsInJlZ2lzdHJhdGlvbiIsInJlZ2lzdGVyIiwicGxheUFzTW9yc2UiLCJjYWxsYmFjayIsInZhbHVlIiwidG9Mb3dlckNhc2UiLCJmb2N1cyIsInBhcnNlX21vcnNlIiwicmVxdWlyZSIsIm1vcnNlIiwiZG90ZGV2IiwiaW50ZXJkb3RkZXYiLCJkb3RfcHJvcG9ydGlvbiIsImludGVyZG90X3Byb3BvcnRpb24iLCJkb3RfcHJvcG9ydGlvbl93ZWlnaHQiLCJkb3RfYWRqX3dlaWdodCIsImludGVyZG90X3Byb3BvcnRpb25fd2VpZ2h0IiwiaW50ZXJkb3RfYWRqX3dlaWdodCIsImtleWVsZW1lbnQiLCJ0ZXh0IiwiaXRleHQiLCJlc3RpbWF0ZSIsInBhcnNlZF9tb3JzZSIsInBhcnNlZF9tb3JzZV9hbnQiLCJ0aW1lIiwiaXNfZG90Iiwid2VpZ2h0IiwiYWJzIiwidG8iLCJpc19pbnRlcmRvdCIsInBhdXNlIiwiYXVkaW9Db250ZXh0IiwiaXNQbGF5aW5nIiwic291cmNlTm9kZSIsImFuYWx5c2VyIiwidGhlQnVmZmVyIiwiREVCVUdDQU5WQVMiLCJtZWRpYVN0cmVhbVNvdXJjZSIsImRldGVjdG9yRWxlbSIsImNhbnZhc0VsZW0iLCJ3YXZlQ2FudmFzIiwicGl0Y2hFbGVtIiwibm90ZUVsZW0iLCJkZXR1bmVFbGVtIiwiZGV0dW5lQW1vdW50IiwiZXJyb3IiLCJnZXRVc2VyTWVkaWEiLCJkaWN0aW9uYXJ5Iiwid2Via2l0R2V0VXNlck1lZGlhIiwibW96R2V0VXNlck1lZGlhIiwiZ290U3RyZWFtIiwic3RyZWFtIiwiY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2UiLCJjcmVhdGVBbmFseXNlciIsImZmdFNpemUiLCJ1cGRhdGVQaXRjaCIsInRvZ2dsZU9zY2lsbGF0b3IiLCJzdG9wIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSIsInJhZklEIiwiY3JlYXRlT3NjaWxsYXRvciIsImlzTGl2ZUlucHV0IiwidG9nZ2xlUGxheWJhY2siLCJsb29wIiwidHJhY2tzIiwiYnVmbGVuIiwiYnVmIiwiRmxvYXQzMkFycmF5Iiwibm90ZVN0cmluZ3MiLCJub3RlRnJvbVBpdGNoIiwiZnJlcXVlbmN5Iiwibm90ZU51bSIsImZyZXF1ZW5jeUZyb21Ob3RlTnVtYmVyIiwibm90ZSIsInBvdyIsImNlbnRzT2ZmRnJvbVBpdGNoIiwiTUlOX1NBTVBMRVMiLCJHT09EX0VOT1VHSF9DT1JSRUxBVElPTiIsImF1dG9Db3JyZWxhdGUiLCJzYW1wbGVSYXRlIiwiU0laRSIsIk1BWF9TQU1QTEVTIiwiYmVzdF9vZmZzZXQiLCJiZXN0X2NvcnJlbGF0aW9uIiwicm1zIiwiZm91bmRHb29kQ29ycmVsYXRpb24iLCJjb3JyZWxhdGlvbnMiLCJ2YWwiLCJzcXJ0IiwibGFzdENvcnJlbGF0aW9uIiwib2Zmc2V0IiwiY29ycmVsYXRpb24iLCJzaGlmdCIsImN5Y2xlcyIsImdldEZsb2F0VGltZURvbWFpbkRhdGEiLCJhYyIsImNsZWFyUmVjdCIsInN0cm9rZVN0eWxlIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwic3Ryb2tlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7UUMxRGdC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QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQSw2QkFBNkIsbUJBQW1COztBQUVoRDs7QUFFQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzVXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVB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QUFJOUosQ0FBSixJQUFPLEdBQWhDO0FBQ0Q7QUFDRG1JLGVBQVc4RCxNQUFYO0FBQ0Q7O0FBRUQvTCxRQUFNd0QsUUFBTixDQUFlaUksRUFBZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBSSxDQUFDdEksT0FBTzZJLHFCQUFaLEVBQ0U3SSxPQUFPNkkscUJBQVAsR0FBK0I3SSxPQUFPOEksMkJBQXRDO0FBQ0Y1QyxVQUFRbEcsT0FBTzZJLHFCQUFQLENBQThCaEQsV0FBOUIsQ0FBUjtBQUNELEM7Ozs7OztBQ3JYRCwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0MiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZjA5MjQzMjg2ZmFlNGQ4ZDYxNGYiLCJ2YXIgbG9nID0gW107XG52YXIgb3Blbk1lc3NhZ2UgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0U2VuZGluZygpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXh0LWlucHV0XCIpLmRpc2FibGVkID0gdHJ1ZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZW5kLWJ1dHRvblwiKS5kaXNhYmxlZCA9IHRydWU7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VuZC1idXR0b25cIikuaW5uZXJUZXh0ID0gXCJTZW5kaW5nLi4uXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9wU2VuZGluZygpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXh0LWlucHV0XCIpLmRpc2FibGVkID0gZmFsc2U7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VuZC1idXR0b25cIikuZGlzYWJsZWQgPSBmYWxzZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZW5kLWJ1dHRvblwiKS5pbm5lclRleHQgPSBcIlNlbmRcIjtcbn1cblxuXG5mdW5jdGlvbiBzdG9yZU1lc3NhZ2UobWVzc2FnZSwgb3duZXIpIHtcbiAgbG9nLnB1c2goe21lc3NhZ2U6IG1lc3NhZ2UsIG93bmVyOiBvd25lcn0pO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbW9yc2VfbG9nJywgSlNPTi5zdHJpbmdpZnkobG9nKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJMb2coKSB7XG4gIGxvZyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21vcnNlX2xvZycpKSB8fCBbXTtcbiAgbG9nLmZvckVhY2goZW50cnkgPT4gcmVuZGVyTWVzc2FnZShlbnRyeS5tZXNzYWdlLCBlbnRyeS5vd25lcikpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93TWVzc2FnZShtZXNzYWdlLCBvd25lcikge1xuICBzdG9yZU1lc3NhZ2UobWVzc2FnZSwgb3duZXIpO1xuICByZW5kZXJNZXNzYWdlKG1lc3NhZ2UsIG93bmVyKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyTWVzc2FnZShtZXNzYWdlLCBvd25lcikge1xuICB2YXIgbWVzc2FnZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBtZXNzYWdlTm9kZS5jbGFzc05hbWUgPSBvd25lcjtcbiAgbWVzc2FnZU5vZGUuaW5uZXJUZXh0ID0gbWVzc2FnZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZXNzYWdlc1wiKS5hcHBlbmRDaGlsZChtZXNzYWdlTm9kZSk7XG4gIHNjcm9sbERvd24oKTtcbn1cblxuZnVuY3Rpb24gbmV3ZXN0TWVzc2FnZShvd25lcikge1xuICB2YXIgdGhlaXJNZXNzYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUob3duZXIpO1xuICByZXR1cm4gdGhlaXJNZXNzYWdlc1t0aGVpck1lc3NhZ2VzLmxlbmd0aC0xXVxufVxuXG5mdW5jdGlvbiBzY3JvbGxEb3duKCkge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lc3NhZ2VzXCIpLnNjcm9sbFRvcCA9IDEwMDAwMDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0NoYXJhY3RlcihjaGFyYWN0ZXIsIG93bmVyKSB7XG4gIGlmICghb3Blbk1lc3NhZ2UpIHtcbiAgICByZW5kZXJNZXNzYWdlKFwiXCIsIFwidGhlaXJzIHR5cGluZ1wiKTtcbiAgICBvcGVuTWVzc2FnZSA9IHRydWU7XG4gIH1cbiAgbmV3ZXN0TWVzc2FnZShvd25lcikuaW5uZXJUZXh0ICs9IGNoYXJhY3Rlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlTWVzc2FnZShvd25lcikge1xuICBvcGVuTWVzc2FnZSA9IGZhbHNlO1xuICBuZXdlc3RNZXNzYWdlKG93bmVyKS5jbGFzc0xpc3QucmVtb3ZlKFwidHlwaW5nXCIpO1xuICBzdG9yZU1lc3NhZ2UobmV3ZXN0TWVzc2FnZShvd25lcikuaW5uZXJUZXh0LCBvd25lcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhck1lc3NhZ2VzKCkge1xuICAvLyBFcmFzZSBsb2dcbiAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ21vcnNlX2xvZycpO1xuICBsb2cgPSBbXTtcbiAgLy8gQ2xlYW4gdXAgRE9NXG4gIHZhciBtZXNzYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVzc2FnZXNcIik7XG4gIEFycmF5LmZyb20obWVzc2FnZXMuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4ge1xuICAgIGlmICghY2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmbGFzaCcpKSB7XG4gICAgICBtZXNzYWdlcy5yZW1vdmVDaGlsZChjaGlsZClcbiAgICB9XG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93Rmxhc2hNZXNzYWdlKG1lc3NhZ2UsIGxldmVsPScnKSB7XG4gIHZhciBmbGFzaE5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBmbGFzaE5vZGUuY2xhc3NOYW1lID0gXCJmbGFzaCBcIiArIGxldmVsO1xuICBmbGFzaE5vZGUuaW5uZXJUZXh0ID0gbWVzc2FnZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZXNzYWdlc1wiKS5hcHBlbmRDaGlsZChmbGFzaE5vZGUpO1xuICBzY3JvbGxEb3duKCk7XG4gIHJldHVybiBmbGFzaE5vZGU7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2hhdHJvb20uanMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29kZV90YWJsZTogY29kZV90YWJsZSxcbiAgc2V0dXA6IHNldHVwLFxuICBjb25maWc6IGNvbmZpZyxcbiAgZW5jb2RlX21vcnNlOiBlbmNvZGVfbW9yc2UsXG4gIGdlbl90aW1lbGluZTogZ2VuX3RpbWVsaW5lLFxuICBzdGFydF9zY2hlZHVsZTogc3RhcnRfc2NoZWR1bGVcbn1cblxuZnVuY3Rpb24gY29kZV90YWJsZSgpIHtcbiAgcmV0dXJuIGNvZGU7XG59XG5cbi8vIFRha2VuIGZyb20gaHR0cHM6Ly9lcHh4LmNvL21vcnNlL1xuXG52YXIgYXVkaW9fc3RhdHVzID0gMDtcbnZhciBhID0ge307XG52YXIgc2FtcGxlID0gMDtcbnZhciBTQU1QTEVfUkFURSA9IDQ4MDAwO1xuXG5hLnBsYXlpbmcgPSBmYWxzZTtcblxudmFyIEVSUk9SX05PTkZBVEFMID0gJ8OXJztcbnZhciBFUlJPUl9GQVRBTCA9ICfDtyc7IFxuXG52YXIgY29kZSA9IHsnQSc6ICcuLScsICdCJzogJy0uLi4nLCAnQyc6ICctLi0uJywgJ0QnOiAnLS4uJywgJ0UnOiAnLicsXG4gICdGJzogJy4uLS4nLCAnRyc6ICctLS4nLCAnSCc6ICcuLi4uJywgJ0knOiAnLi4nLCAnSic6ICcuLS0tJyxcbiAgJ0snOiAnLS4tJywgJ0wnOiAnLi0uLicsICdNJzogJy0tJywgJ04nOiAnLS4nLCAnTyc6ICctLS0nLFxuICAnUCc6ICcuLS0uJywgJ1EnOiAnLS0uLScsICdSJzogJy4tLicsICdTJzogJy4uLicsICdUJzogJy0nLFxuICAnVSc6ICcuLi0nLCAnVic6ICcuLi4tJywgJ1cnOiAnLi0tJywgJ1gnOiAnLS4uLScsICdZJzogJy0uLS0nLFxuICAnWic6ICctLS4uJyxcbiAgJzAnOiAnLS0tLS0nLCAgICAgICAgICAgJywnOiAnLS0uLi0tJyxcbiAgJzEnOiAnLi0tLS0nLCAgICAgICAgICAgJy4nOiAnLi0uLS4tJyxcbiAgJzInOiAnLi4tLS0nLCAgICAgICAgICAgJz8nOiAnLi4tLS4uJyxcbiAgJzMnOiAnLi4uLS0nLCAgICAgICAgICAgJzsnOiAnLS4tLi0uJyxcbiAgJzQnOiAnLi4uLi0nLCAgICAgICAgICAgJzonOiAnLS0tLi4uJyxcbiAgJzUnOiAnLi4uLi4nLCAgICAgICAgICAgXCInXCI6ICcuLS0tLS4nLFxuICAnNic6ICctLi4uLicsICAgICAgICAgICAnLSc6ICctLi4uLi0nLFxuICAnNyc6ICctLS4uLicsICAgICAgICAgICAnLyc6ICctLi4tLicsXG4gICc4JzogJy0tLS4uJywgICAgICAgICAgICcoJzogJy0uLS0uLScsXG4gICc5JzogJy0tLS0uJywgICAgICAgICAgICcpJzogJy0uLS0uLScsXG4gICcgJzogJyAnLCAgICAgICAgICAgICAgICdfJzogJy4uLS0uLScsXG4gICdAJzogJy4tLS4tLicsICAgICAgICAgICckJzogJy4uLi0uLi0nLFxuICAnJic6ICcuLS4uLicsICAgICAgICAgICAnISc6ICctLi0uLS0nLFxuICAnXFxuJzogJ1xcbicsXG4gICfDlyc6ICdlZScsXG4gICfDtyc6ICdmZmYnLFxufTtcblxuYS5jb2RlID0gY29kZTtcblxudmFyIG5vbmFzY2lpID0gW1xuICAgIFsnw6fDh8KpJywgICAgICAgICdDJ10sXG4gICAgWyfDscORJywgICAgICAgICAnTiddLFxuICAgIFsnw4HDg8OAw4LDhMOhw6PDoMOiw6QnLCAnQSddLFxuICAgIFsnw4nDiMOKw4vDqcOow6rDqycsICAgJ0UnXSxcbiAgICBbJ8ONw4zDjsOPw63DrMOuw68nLCAgICdJJ10sXG4gICAgWyfDk8OSw5TDlsOVw7PDssO0w7bDtScsICdPJ10sXG4gICAgWyfDmsOZw5vDnMO6w7nDu8O8JywgICAnVSddLFxuICAgIFsn76O/JywgICAnQVAnXV07XG5cbmEubm9uYXNjaWkgPSBub25hc2NpaTtcblxuZnVuY3Rpb24gcmFtcChwb3MsIGxlbmd0aCwgZG90bGVuZ3RoKVxue1xuICAvKlxuICBHZW5lcmF0ZXMgYSBmYWRlaW4vZmFkZW91dCByYW1wIGZvciBzb3VuZFxuICAqL1xuXG4gIHZhciBydm9sdW1lID0gMS4wO1xuICB2YXIgZmFkZWluID0gTWF0aC5taW4oU0FNUExFX1JBVEUgKiAwLjAwMiwgMC4xICogZG90bGVuZ3RoKTtcbiAgdmFyIGZhZGVvdXQgPSBsZW5ndGggLSBmYWRlaW47XG4gIGlmIChwb3MgPCBmYWRlaW4pIHtcbiAgICBydm9sdW1lID0gcG9zIC8gZmFkZWluO1xuICB9IGVsc2UgaWYgKHBvcyA+IGZhZGVvdXQpIHtcbiAgICBydm9sdW1lID0gKGxlbmd0aCAtIHBvcykgLyBmYWRlaW47XG4gIH1cblxuICBydm9sdW1lID0gTWF0aC5zaW4oTWF0aC5QSSAqIHJ2b2x1bWUgLyAyKTtcbiAgcnZvbHVtZSAqPSBydm9sdW1lO1xuXG4gIHJldHVybiBydm9sdW1lO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZV9mbG9hdF93YXZlKGZyZXEsIHZvbHVtZSwgZHVyYXRpb24sIGRvdGR1cmF0aW9uKVxue1xuICB2YXIgc2R1cmF0aW9uID0gTWF0aC5mbG9vcihTQU1QTEVfUkFURSAqIGR1cmF0aW9uKTtcbiAgdmFyIHNkb3RkdXJhdGlvbiA9IE1hdGguZmxvb3IoU0FNUExFX1JBVEUgKiBkb3RkdXJhdGlvbik7XG4gIHZhciBzYW1wbGVzID0gYS5jdHguY3JlYXRlQnVmZmVyKDEsIHNkdXJhdGlvbiwgU0FNUExFX1JBVEUpO1xuICB2YXIgcyA9IHNhbXBsZXMuZ2V0Q2hhbm5lbERhdGEoMCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZHVyYXRpb247ICsraSkge1xuICAgIHNbaV0gPSBNYXRoLnNpbihmcmVxICogKGkgLyBTQU1QTEVfUkFURSkgKiBNYXRoLlBJICogMikgXG4gICAgICAqIHZvbHVtZSAqIHJhbXAoaSwgc2R1cmF0aW9uLCBzZG90ZHVyYXRpb24pO1xuICB9XG5cbiAgcmV0dXJuIHNhbXBsZXM7XG59XG5cbmZ1bmN0aW9uIGNhc3RfYWxwaGFiZXQoaW5wdXQpXG57XG4gIC8qXG4gIEZpbHRlcnMgYSB0ZXh0IG1lc3NhZ2UgZm9yIE1vcnNlIGVuY29kaW5nLlxuICBUaGUgaW5wdXQgc2hvdWxkIGJlIFVuaWNvZGUuXG4gIENoYXJhY3RlcnMgdGhhdCBoYXZlIG5vIE1vcnNlIHN5bWJvbCBhcmUgcmVtb3ZlZC5cblxuICBTb21lIExhdGluIGNoYXJhY3RlcnMgbGlrZSBcIsOpXCIgYXJlIGNvbnZlcnRlZCB0byB0aGVcbiAgbm9uLWFjY2VudGVkIHZlcnNpb24gKFwiZVwiKSB0byBtaXRpZ2F0ZSB0aGUgbG9zcy4gU2VlXG4gIG1vZHVsZS5ub25hc2NpaSB0dXBsZSBmb3IgZGV0YWlscy5cbiAgKi9cblxuICBpbnB1dCA9IGlucHV0LnRvVXBwZXJDYXNlKCk7XG4gIHZhciBvdXRwdXQgPSBcIlwiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGMgPSBpbnB1dFtpXTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5vbmFzY2lpLmxlbmd0aDsgKytqKSB7XG4gICAgICB2YXIgY2hhcnMgPSBub25hc2NpaVtqXVswXTtcbiAgICAgIHZhciByZXBsYWNlbWVudCA9IG5vbmFzY2lpW2pdWzFdO1xuICAgICAgaWYgKGNoYXJzLmluZGV4T2YoYykgIT0gLTEpIHtcbiAgICAgICAgYyA9IHJlcGxhY2VtZW50O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvZGVbY10pIHtcbiAgICAgIG91dHB1dCArPSBjO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxudmFyIGNmZyA9IHt9O1xuY2ZnWycuJ10gPSAxLjA7XG5cbmZ1bmN0aW9uIG1ha2VfYXVkaW9fc2FtcGxlcygpXG57XG4gIC8qXG4gIFByZXBhcmVzIGF1ZGlvIHNhbXBsZXMuXG4gICovXG5cbiAgdmFyIGRvdF9kdXJhdGlvbiA9IGNmZ1snRkFSTlNfRE9UX0xFTkdUSCddICogY2ZnWycuJ107XG4gIHZhciBkYXNoX2R1cmF0aW9uID0gY2ZnWydGQVJOU19ET1RfTEVOR1RIJ10gKiBjZmdbJy0nXTtcbiAgdmFyIGludGVyYml0X2R1cmF0aW9uID0gY2ZnWydGQVJOU19ET1RfTEVOR1RIJ10gKiBjZmdbJ2knXTtcbiAgdmFyIHNwYWNlX2R1cmF0aW9uID0gY2ZnWydXUE1fRE9UX0xFTkdUSCddICogY2ZnWycgJ107XG4gIHZhciBpbnRlcndvcmRfZHVyYXRpb24gPSBjZmdbJ1dQTV9ET1RfTEVOR1RIJ10gKiBjZmdbJ3cnXTtcblxuICB2YXIgZXJyX2RvdF9kdXJhdGlvbiA9ICAwLjA1ICogY2ZnWycuJ107XG4gIHZhciBlcnJfZGFzaF9kdXJhdGlvbiA9IDAuMDUgKiBjZmdbJy0nXTtcblxuICBjZmdbJ3NhbXBsZS4nXSA9IGdlbmVyYXRlX2Zsb2F0X3dhdmUoY2ZnWydmcmVxJ10sIGNmZ1sndm9sdW1lJ10sIGRvdF9kdXJhdGlvbiwgZG90X2R1cmF0aW9uKTtcbiAgY2ZnWydzYW1wbGUtJ10gPSBnZW5lcmF0ZV9mbG9hdF93YXZlKGNmZ1snZnJlcSddLCBjZmdbJ3ZvbHVtZSddLCBkYXNoX2R1cmF0aW9uLCBkb3RfZHVyYXRpb24pO1xuICBjZmdbJ3NhbXBsZWUnXSA9IGdlbmVyYXRlX2Zsb2F0X3dhdmUoY2ZnWydmcmVxJ10gLyAxLjQsIGNmZ1sndm9sdW1lJ10sIGVycl9kb3RfZHVyYXRpb24sIGVycl9kb3RfZHVyYXRpb24pO1xuICBjZmdbJ3NhbXBsZWYnXSA9IGdlbmVyYXRlX2Zsb2F0X3dhdmUoY2ZnWydmcmVxJ10gLyAxLjQsIGNmZ1sndm9sdW1lJ10sIGVycl9kYXNoX2R1cmF0aW9uLCBlcnJfZG90X2R1cmF0aW9uKTtcblxuICBjZmdbJ2R1cmF0aW9uLiddID0gZG90X2R1cmF0aW9uO1xuICBjZmdbJ2R1cmF0aW9uLSddID0gZGFzaF9kdXJhdGlvbjtcbiAgY2ZnWydkdXJhdGlvbmUnXSA9IGVycl9kb3RfZHVyYXRpb247XG4gIGNmZ1snZHVyYXRpb25mJ10gPSBlcnJfZGFzaF9kdXJhdGlvbjtcbiAgY2ZnWydkdXJhdGlvbmknXSA9IGludGVyYml0X2R1cmF0aW9uO1xuICBjZmdbJ2R1cmF0aW9uICddID0gc3BhY2VfZHVyYXRpb247XG4gIGNmZ1snZHVyYXRpb253J10gPSBpbnRlcndvcmRfZHVyYXRpb247XG59XG5cbmZ1bmN0aW9uIGNvbmZpZyhmcmVxLCB2b2x1bWUsIHdwbSwgZmFybnMsIGRhc2gsIGludGVyYml0LCBpbnRlcnN5bWJvbCwgaW50ZXJ3b3JkKVxue1xuICAvKlxuICBDb25maWd1cmUgTW9yc2UgY29kZSBzb3VuZCBhbmQgcmh5dGhtLlxuXG4gIGZyZXE6IGJlZXAgZnJlcXVlbmN5LCBpbiBIei4gRGVmYXVsdCA4MDBIelxuXG4gIHZvbHVtZTogdm9sdW1lIGJldHdlZW4gMC4wIGFuZCAxLjAuIERlZmF1bHQ6IDAuMjVcblxuICB3cG06IHNwZWVkIGluIHdvcmRzIHBlciBtaW51dGUuIERlZmF1bHQ6IDIwLjBcblxuICAgICBEb3Qgc291bmQgbGVuZ3RoIHdpbGwgYmUgbWFkZSA9IDEuNDIgLyB3cG0sXG4gICAgIHNvIGUuZy4gMjAgV1BNIHRyYW5zbGF0ZXMgdG8gYSBkb3Qgb2YgfjcwbXMsXG4gICAgIGFuZCBhbGwgdGhlIHJlc3Qgd2lsbCBiZSBwcm9wb3J0aW9uYWwgdG8gdGhpcy5cblxuICAgICAgICBmYXJuczogRmFuc3dvcnRoIGNvbXByZXNzaW9uLCBleHByZXNzZWQgaW4gd3BtXG5cbiAgICAgUmVndWxhdGVzIHRoZSBzaWduYWxsaW5nIHNwZWVkLiBJZiBoaXRoZXIgdGhhbiB3cG0sXG4gICAgICAgICAgICAgdGhlIHNpZ25hbGxpbmcgd2lsbCBiZSBwbGF5ZWQgaW4gJ2Zhcm5zJyBzcGVlZCBidXRcbiAgICAgICAgICAgICB0aGUgaW50ZXJzeW1ib2wgc3BhY2UgaXMgcHJvcG9ydGlvbmFsIHRvICd3cG0nLlxuXG4gIGRhc2g6IGRhc2ggc291bmQgbGVuZ3RoLCBpbiBkb3RzLiBEZWZhdWx0OiAzIHRpbWVzIGEgZG90LlxuXG4gIGludGVyYml0OiBzaWxlbmNlIGJldHdlZW4gTW9yc2UgZGl0cyBhbmQgZGF0cywgaW4gZG90cy4gRGVmYXVsdDogMC42IGRvdHMuXG5cbiAgaW50ZXJzeW1ib2w6IHNpbGVuY2UgYmV0d2VlbiB0d28gbGV0dGVycywgaW4gZG90cy4gRGVmYXVsdDogMiBkb3RzLlxuXG4gIGludGVyd29yZDogc2lsZW5jZSBiZXR3ZWVuIHR3byB3b3JkcyAoc3BhY2UpLCBpbiBkb3RzLiBEZWZhdWx0OiAzIGRvdHNcbiAgKi9cblxuICBmYXJucyA9IE1hdGgubWF4KHdwbSwgKGZhcm5zID8gZmFybnMgOiB3cG0pKTtcblxuICBjZmdbJ2NvbXBlbnNhdGlvbiddID0gMTtcblxuICBjZmdbJ1dQTSddID0gd3BtO1xuICBjZmdbJ0ZBUk5TJ10gPSBmYXJucztcbiAgY2ZnWydXUE1fRE9UX0xFTkdUSCddID0gMS40MiAvIHdwbSAvIGNmZ1snY29tcGVuc2F0aW9uJ107XG4gIGNmZ1snRkFSTlNfRE9UX0xFTkdUSCddID0gMS40MiAvIGZhcm5zIC8gY2ZnWydjb21wZW5zYXRpb24nXTtcbiAgY2ZnWyctJ10gPSBkYXNoO1xuICBjZmdbJ2knXSA9IGludGVyYml0O1xuICBjZmdbJyAnXSA9IGludGVyc3ltYm9sO1xuICBjZmdbJ3cnXSA9IGludGVyd29yZDtcbiAgY2ZnWydmcmVxJ10gPSBmcmVxO1xuICBjZmdbJ3ZvbHVtZSddID0gdm9sdW1lO1xuXG4gIG1ha2VfYXVkaW9fc2FtcGxlcygpO1xufVxuXG5mdW5jdGlvbiBlbmNvZGVfbW9yc2UoaW5wdXQpXG57XG4gIC8vIENvZXJjZSB0aGUgbWVzc2FnZSBpbnRvIHRoZSBzdXBwb3J0ZWQgYWxwaGFiZXQuXG4gIC8vIFNlZSBcIm5vbmFzY2lpXCIgdHVwbGUuXG4gIGlucHV0ID0gY2FzdF9hbHBoYWJldChpbnB1dCk7XG4gIHZhciBvdXRwdXQgPSBcIlwiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGMgPSBpbnB1dFtpXTtcbiAgICB2YXIgayA9IGNvZGVbY107XG4gICAgaWYgKCEgaykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIG91dHB1dCArPSBrO1xuICAgIGlmIChrICE9ICcgJykge1xuICAgICAgb3V0cHV0ICs9ICcgJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFtpbnB1dCwgb3V0cHV0XTtcbn1cblxuZnVuY3Rpb24gZ2VuX3RpbWVsaW5lKGJpdHMpXG57XG4gIGEudGltZWxpbmUgPSBbXTtcbiAgdmFyIHRpbWVzdGFtcCA9IDA7XG4gIHZhciBsYXN0Yml0ID0gXCIjXCI7XG4gIHZhciBpbnRlcndvcmQgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGJpdHMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYml0ID0gYml0c1tpXTtcbiAgICBpZiAoYml0ID09IFwiXFxuXCIpIHtcbiAgICAgIGJpdCA9IFwiIFwiO1xuICAgIH1cbiAgICBpZiAobGFzdGJpdCA9PSBcIi5cIiB8fCBsYXN0Yml0ID09IFwiLVwiIHx8IGxhc3RiaXQgPT0gXCJlXCIgfHwgbGFzdGJpdCA9PSBcImZcIikge1xuICAgICAgdGltZXN0YW1wICs9IGNmZ1snZHVyYXRpb24nICsgJ2knXTtcbiAgICB9XG5cbiAgICBpZiAoY2ZnWydzYW1wbGUnICsgYml0XSkge1xuICAgICAgYS50aW1lbGluZS5wdXNoKFtjZmdbJ3NhbXBsZScgKyBiaXRdLCB0aW1lc3RhbXAsIGNmZ1snZHVyYXRpb24nICsgYml0XV0pO1xuICAgIH1cblxuICAgIGlmIChiaXQgPT0gJyAnICYmIGxhc3RiaXQgPT0gJyAnKSB7XG4gICAgICAvLyBqdXN0IGFkZCBpbnRlci13b3JkXG4gICAgICBpZiAoIWludGVyd29yZCkge1xuICAgICAgICB0aW1lc3RhbXAgKz0gY2ZnWydkdXJhdGlvbncnXTtcbiAgICAgICAgaW50ZXJ3b3JkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGltZXN0YW1wICs9IGNmZ1snZHVyYXRpb24nICsgYml0XTtcbiAgICAgIGludGVyd29yZCA9IGZhbHNlO1xuICAgIH1cbiAgICBsYXN0Yml0ID0gYml0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNjaGVkdWxlKClcbntcbiAgdmFyIG5vdyA9IGEuY3R4LmN1cnJlbnRUaW1lO1xuICAvLyBzY2hlZHVsZSB1cCB0byAxIHNlY29uZCBhaGVhZCBjdXJyZW50IHRpbWVcbiAgdmFyIHNjaF9saW1pdCA9IG5vdyArIDE7XG4gIHZhciBsYXN0X25vdGVfZmluaXNoZXNfYXQgPSBub3c7XG5cbiAgd2hpbGUgKGEudGltZWxpbmVfcG9zIDwgYS50aW1lbGluZS5sZW5ndGgpIHtcbiAgICB2YXIgc2FtcGxlID0gYS50aW1lbGluZVthLnRpbWVsaW5lX3Bvc11bMF07XG4gICAgdmFyIHRpbWVzdGFtcCA9IGEudGltZWxpbmVbYS50aW1lbGluZV9wb3NdWzFdICsgYS5jdXJyZW50VGltZTA7XG4gICAgdmFyIGR1cmF0aW9uID0gYS50aW1lbGluZVthLnRpbWVsaW5lX3Bvc11bMl07XG5cbiAgICBpZiAodGltZXN0YW1wID4gc2NoX2xpbWl0KSB7XG4gICAgICAvLyBvaywgd2UgaGF2ZSBzY2hlZHVsZWQgZW5vdWdoXG4gICAgICBzZXRUaW1lb3V0KHNjaGVkdWxlLCAyNTApO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAodGltZXN0YW1wIDwgbm93KSB7XG4gICAgICAvLyB3ZSBhcmUgbGF0ZSEgdHJ5IHRvIGNvbXBlbnNhdGUgdGhhdCBzbyBhdCBsZWFzdCB3ZSBhdm9pZFxuICAgICAgLy8gYWxsIHNhbXBsZXMgbW91bnRpbmcgdG9nZXRoZXIgaW1tZWRpYXRlbHlcbiAgICAgIHZhciBkZWxheSA9IG5vdyAtIHRpbWVzdGFtcCArIDAuMjtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ29ycmVjdGl2ZSBkZWxheSBcIiArIGRlbGF5KTtcbiAgICAgIGEuY3VycmVudFRpbWUwICs9IGRlbGF5O1xuICAgICAgdGltZXN0YW1wICs9IGRlbGF5O1xuICAgIH1cblxuICAgIHZhciBub2RlID0gYS5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgbm9kZS5idWZmZXIgPSBzYW1wbGU7XG4gICAgbm9kZS5jb25uZWN0KGEuY3R4LmRlc3RpbmF0aW9uKTtcbiAgICBub2RlLnN0YXJ0ID8gbm9kZS5zdGFydCh0aW1lc3RhbXApIDogbm9kZS5ub3RlT24odGltZXN0YW1wKTtcbiAgICArK2EudGltZWxpbmVfcG9zO1xuICAgIC8vIGNvbnNvbGUubG9nKHRpbWVzdGFtcCwgc2NoX2xpbWl0KTtcblxuICAgIGxhc3Rfbm90ZV9maW5pc2hlc19hdCA9IHRpbWVzdGFtcCArIGR1cmF0aW9uO1xuICB9XG5cbiAgLy8gZW5kIG9mIHRpbWVsaW5lXG4gIGEucGxheWluZyA9IGZhbHNlO1xuICBhLnRpbWVsaW5lID0gW107XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGlmIChhLmVuZF9jYikge1xuICAgICAgdmFyIGNiID0gYS5lbmRfY2I7XG4gICAgICBhLmVuZF9jYiA9IG51bGw7XG4gICAgICBjYigpO1xuICAgIH1cbiAgfSwgMTAwMCAqIChsYXN0X25vdGVfZmluaXNoZXNfYXQgLSBub3cpKTtcbn1cblxuZnVuY3Rpb24gc3RhcnRfc2NoZWR1bGUoZW5kX2NiKVxue1xuICBhLmN1cnJlbnRUaW1lMCA9IGEuY3R4LmN1cnJlbnRUaW1lICsgMC4yO1xuICBhLnRpbWVsaW5lX3BvcyA9IDA7XG4gIGEucGxheWluZyA9IHRydWU7XG4gIGEuZW5kX2NiID0gZW5kX2NiO1xuICBzY2hlZHVsZSgpO1xufVxuXG5mdW5jdGlvbiBiYWRfYnJvd3NlcigpXG57XG4gIGFsZXJ0KFwiWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgQXVkaW8gQVBJIChIVE1MNSkuXFxuUGxlYXNlIHVzZSBhIGNvbXBhdGlibGUgYnJvd3NlciBlLmcuIENocm9tZSB3aXRoIEF1ZGlvIEFQSSBlbmFibGVkIGluIHBhZ2UgYWJvdXQ6ZmxhZ3NcXG5cXG5Nb3JzZSBlbmNvZGluZyB0byB0ZXh0IGNhbiBzdGlsbCBiZSB1c2VkLlwiKTtcbn1cblxuZnVuY3Rpb24gc2V0dXAoKVxue1xuICBpZiAoYXVkaW9fc3RhdHVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCEgd2luZG93LkF1ZGlvQ29udGV4dCkge1xuICAgIGlmICghIHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpIHtcbiAgICAgIGF1ZGlvX3N0YXR1cyA9IDI7XG4gICAgICBiYWRfYnJvd3NlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgICB3aW5kb3cuQXVkaW9Ob2RlID0gd2luZG93LndlYmtpdEF1ZGlvTm9kZTtcbiAgfVxuXG4gIGEuY3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuXG4gIGF1ZGlvX3N0YXR1cyA9IDE7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2VweHgvbW9yc2UuanMiLCJpbXBvcnQgY29weTIgZnJvbSAnLi9saWIvZXB4eC9jb3B5Mi5qcyc7XG5pbXBvcnQgcGl0Y2hkZXRlY3QgZnJvbSAnLi9saWIvY3dpbHNvL3BpdGNoZGV0ZWN0LmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBwaXRjaGRldGVjdC50b2dnbGVMaXZlSW5wdXQoKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIENvbm5lY3QgcGl0Y2hkZXRlY3QgdG8gY29weTJcblxudmFyIGxhc3RfdG9uZSA9IC0xO1xuXG5leHBvcnQgZnVuY3Rpb24gYW5hbHl6ZXIodG9uZSkge1xuICAvLyBXZSBcImxvc3QgdGhlIHNpZ25hbFwiXG4gIGlmICggdG9uZSA9PSAtMSApIHtcbiAgICBzbShmYWxzZSk7XG4gIH1cblxuICAvLyBOZXZlciBtaW5kIGlmIHRoZSB0b25lIGlzIHRvbyBsb3cgb3IgdG9vIGhpZ2hcbiAgaWYgKCB0b25lIDwgNDAwIHx8IHRvbmUgPiAxMTAwICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKHRvbmUpO1xuICBzbSh0cnVlKTtcbn1cblxuXG4vLyBUYWtlbiBmcm9tIGNvcHkuanNcbi8vIGluaXRpYWwgZXN0aW1hdGVzXG52YXIgd3BtID0gMjA7XG5cbnZhciBkb3QgPSAxNDIwIC8gd3BtO1xudmFyIGludGVyZG90ID0gMS41ICogZG90O1xuXG52YXIgbGFzdF9ldmVudCA9IG51bGw7XG52YXIgbGFzdF9ldmVudF9pc19PTiA9IGZhbHNlO1xuXG52YXIgYXV0b19vZmZfdGltZXIgPSBudWxsO1xuXG5mdW5jdGlvbiBzbShpc19PTilcbntcbiAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgaWYgKCEgbGFzdF9ldmVudCkge1xuICAgIGxhc3RfZXZlbnQgPSBub3c7XG4gICAgbGFzdF9ldmVudF9pc19PTiA9IGlzX09OO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChsYXN0X2V2ZW50X2lzX09OID09PSBpc19PTikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBlX3RpbWUgPSBub3cuZ2V0VGltZSgpIC0gbGFzdF9ldmVudC5nZXRUaW1lKCk7XG4gIGVfdGltZSA9IE1hdGgubWluKGVfdGltZSwgMTAwMCk7XG4gIHZhciBlX2lzT04gPSBsYXN0X2V2ZW50X2lzX09OO1xuXG4gIGxhc3RfZXZlbnQgPSBub3c7XG4gIGxhc3RfZXZlbnRfaXNfT04gPSBpc19PTjtcblxuICBpZiAoZV9pc09OKSB7XG4gICAgaWYgKGF1dG9fb2ZmX3RpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQoYXV0b19vZmZfdGltZXIpO1xuICAgICAgYXV0b19vZmZfdGltZXIgPSBudWxsO1xuICAgIH1cbiAgICBhdXRvX29mZl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgYXV0b19vZmZfdGltZXIgPSBudWxsO1xuICAgICAgY29weTIub2ZmX2ludGVycHJldCgxMDAwLCB0cnVlKTtcbiAgICB9LCAxMDAwKTtcbiAgICBjb3B5Mi5vbl9pbnRlcnByZXQoZV90aW1lKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoYXV0b19vZmZfdGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dChhdXRvX29mZl90aW1lcik7XG4gICAgICBhdXRvX29mZl90aW1lciA9IG51bGw7XG4gICAgfVxuICAgIGNvcHkyLm9mZl9pbnRlcnByZXQoZV90aW1lLCBlX3RpbWUgPj0gMTAwMCk7XG4gIH1cblxuICAvLyBjb25zb2xlLmxvZyhiaXRzKTtcbiAgdmFyIHdwbSA9IDE0MjAgLyAoKGRvdCArIGludGVyZG90KSAvIDIpO1xuICB2YXIgZmFybnMgPSAxNDIwIC8gZG90O1xuICBjb25zb2xlLmxvZyhcIlwiICsgTWF0aC5yb3VuZCh3cG0pICsgXCIgd3BtIFwiICsgTWF0aC5yb3VuZChmYXJucykgKyBcIiBmYXJuc1wiKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbnB1dC5qcyIsIi8vIExvYWQgc3R5bGluZ1xuaW1wb3J0ICcuL3N0eWxlc2hlZXRzL2luZGV4LnNjc3MnO1xuXG4vLyBMb2FkIGphdmFzY3JpcHRzXG5pbXBvcnQgKiBhcyBjaGF0cm9vbSBmcm9tICcuL2NoYXRyb29tLmpzJztcbmltcG9ydCAqIGFzIG91dHB1dCBmcm9tICcuL291dHB1dC5qcyc7XG5pbXBvcnQgKiBhcyBpbnB1dCBmcm9tICcuL2lucHV0LmpzJztcbmltcG9ydCAqIGFzIHJ1bnRpbWUgZnJvbSAnc2VydmljZXdvcmtlci13ZWJwYWNrLXBsdWdpbi9saWIvcnVudGltZSc7XG5cbi8vIFN0YXJ0IGV4ZWN1dGlvblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgb3V0cHV0LnNldHVwKCk7XG4gIGNoYXRyb29tLnJlbmRlckxvZygpO1xuICBpbnB1dC5zZXR1cCgpICYmIGNoYXRyb29tLnNob3dGbGFzaE1lc3NhZ2UoXCJMaXN0ZW5pbmcgZm9yIG1vcnNlIHNpZ25hbHMuLi5cIiwgXCJpbmZvXCIpO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV4dC1pbnB1dFwiKS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB7aWYgKGUua2V5Q29kZSA9PSAxMykgb3V0cHV0LnNlbmRNZXNzYWdlKCl9KTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZW5kLWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb3V0cHV0LnNlbmRNZXNzYWdlKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbGVhclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hhdHJvb20uY2xlYXJNZXNzYWdlcyk7XG59KTtcblxuLy8gU2VydmljZSB3b3JrZXIgc2V0dXBcbmlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG5cbiAgLy8gVGhpcyBpcyB0aGUgY2FsbGJhY2sgdGhhdCB0aGUgc2VydmljZSB3b3JrZXIgY2FuIGRvIG9uIHVzXG4gIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBldmVudCA9PiB7XG4gICAgc3dpdGNoIChldmVudC5kYXRhLmFjdGlvbikge1xuICAgICAgY2FzZSAnbmV3X3ZlcnNpb24nOlxuICAgICAgICBsZXQgZWxlbWVudCA9IGNoYXRyb29tLnNob3dGbGFzaE1lc3NhZ2UoXCJUaGVyZSBpcyBhIG5ldyB2ZXJzaW9uIGF2YWlsYWJsZSEgQ2xpY2sgaGVyZSB0byByZWxvYWQgdGhlIGFwcFwiLCBcIm5vdGljZSBjbGlja2FibGVcIik7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGxvY2F0aW9uLnJlbG9hZCgpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcblxuICAvLyBIZXJlIHdlIHJlZ2lzdGVyIHRoZSBzZXJ2aWNlIHdvcmtlclxuICBjb25zdCByZWdpc3RyYXRpb24gPSBydW50aW1lLnJlZ2lzdGVyKCk7XG59XG5cbi8vIERvbmVcbmNvbnNvbGUubG9nKFwiUmVhZHkhXCIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vaW5kZXguc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9pbmRleC5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL2luZGV4LnNjc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlc2hlZXRzL2luZGV4LnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiQGNoYXJzZXQgXFxcIlVURi04XFxcIjtcXG5odG1sLCBib2R5LCAubWVzc2FnZXMsIC5pbnB1dCB7XFxuICBtYXJnaW46IDBweCBhdXRvO1xcbiAgcGFkZGluZzogMHB4O1xcbiAgZm9udC1mYW1pbHk6IFRhaG9tYSwgQXJpYWwsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDEzcHg7IH1cXG5cXG5ib2R5IHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDIwdncgNjR2dyAxNnZ3O1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBjYWxjKDEwMHZoIC0gNDBweCkgNDBweDtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6IFxcXCJuYXZiYXIgY2hhdHJvb20gY2hhdHJvb21cXFwiIFxcXCJuYXZiYXIgdGV4dGlucHV0IHNlbmRcXFwiO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IH1cXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xcbiAgICBib2R5IHtcXG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDgwdncgMjB2dztcXG4gICAgICBncmlkLXRlbXBsYXRlLXJvd3M6IDQwcHggY2FsYygxMDB2aCAtIDgwcHgpIDQwcHg7XFxuICAgICAgZ3JpZC10ZW1wbGF0ZS1hcmVhczogXFxcIm5hdmJhciBuYXZiYXJcXFwiIFxcXCJjaGF0cm9vbSBjaGF0cm9vbVxcXCIgXFxcInRleHRpbnB1dCBzZW5kXFxcIjsgfSB9XFxuICBib2R5IC5uYXZiYXIge1xcbiAgICBncmlkLWFyZWE6IG5hdmJhcjsgfVxcbiAgYm9keSAubWVzc2FnZXMge1xcbiAgICBncmlkLWFyZWE6IGNoYXRyb29tOyB9XFxuICBib2R5IHRleHRhcmVhIHtcXG4gICAgZ3JpZC1hcmVhOiB0ZXh0aW5wdXQ7IH1cXG4gIGJvZHkgYnV0dG9uIHtcXG4gICAgZ3JpZC1hcmVhOiBzZW5kOyB9XFxuXFxuLm5hdmJhciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7IH1cXG4gIC5uYXZiYXIgaDEge1xcbiAgICBmb250LXNpemU6IDEuOGVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDsgfVxcbiAgQG1lZGlhIChtaW4td2lkdGg6IDc2OXB4KSB7XFxuICAgIC5uYXZiYXIge1xcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XFxuICAgICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgI2RkZDsgfVxcbiAgICAgIC5uYXZiYXIgaDEge1xcbiAgICAgICAgbWFyZ2luOiAyZW0gMTBweDsgfVxcbiAgICAgIC5uYXZiYXIgYnV0dG9uIHtcXG4gICAgICAgIHBhZGRpbmc6IDFlbTtcXG4gICAgICAgIG1hcmdpbjogNXB4IDEwcHg7IH0gfVxcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XFxuICAgIC5uYXZiYXIge1xcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7IH1cXG4gICAgICAubmF2YmFyIGgxLCAubmF2YmFyIGJ1dHRvbiB7XFxuICAgICAgICBmbGV4LWdyb3c6IDE7IH1cXG4gICAgICAubmF2YmFyIGgxIHtcXG4gICAgICAgIGxpbmUtaGVpZ2h0OiA0MHB4OyB9XFxuICAgICAgLm5hdmJhciBidXR0b24ge1xcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDA7IH0gfVxcblxcbi5tZXNzYWdlcyB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBwYWRkaW5nOiAxZW0gMS41ZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIG92ZXJmbG93LXk6IHNjcm9sbDtcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkOyB9XFxuICAubWVzc2FnZXMgLnRoZWlycywgLm1lc3NhZ2VzIC5taW5lIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBib3JkZXI6IDBweDtcXG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xcbiAgICBtaW4td2lkdGg6IDE1JTtcXG4gICAgbWF4LXdpZHRoOiA3MCU7XFxuICAgIHBhZGRpbmc6IDFlbTtcXG4gICAgYm9yZGVyLXJhZGl1czogMTBweDsgfVxcbiAgICAubWVzc2FnZXMgLnRoZWlyczpmaXJzdC1sZXR0ZXIsIC5tZXNzYWdlcyAubWluZTpmaXJzdC1sZXR0ZXIge1xcbiAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IH1cXG4gICAgLm1lc3NhZ2VzIC50aGVpcnM6YmVmb3JlLCAubWVzc2FnZXMgLm1pbmU6YmVmb3JlIHtcXG4gICAgICBjb250ZW50OiAnJztcXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgdG9wOiAtMTVweDtcXG4gICAgICBoZWlnaHQ6IDA7XFxuICAgICAgd2lkdGg6IDA7XFxuICAgICAgYm9yZGVyOiAxNXB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlWig0NWRlZyk7IH1cXG4gIC5tZXNzYWdlcyAubWluZSB7XFxuICAgIG1hcmdpbjogMWVtIDAgMCBhdXRvO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2RlY2NkOyB9XFxuICAgIC5tZXNzYWdlcyAubWluZTpiZWZvcmUge1xcbiAgICAgIHJpZ2h0OiAtNXB4O1xcbiAgICAgIGJvcmRlci1yaWdodDogMTVweCBzb2xpZCAjY2RlY2NkOyB9XFxuICAgIC5tZXNzYWdlcyAubWluZSArIC5taW5lIHtcXG4gICAgICBtYXJnaW4tdG9wOiAwLjNlbTsgfVxcbiAgICAgIC5tZXNzYWdlcyAubWluZSArIC5taW5lOmJlZm9yZSB7XFxuICAgICAgICBkaXNwbGF5OiBub25lOyB9XFxuICAubWVzc2FnZXMgLnRoZWlycyB7XFxuICAgIG1hcmdpbjogMWVtIGF1dG8gMCAwO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTdlN2ZmOyB9XFxuICAgIC5tZXNzYWdlcyAudGhlaXJzOmJlZm9yZSB7XFxuICAgICAgbGVmdDogLTVweDtcXG4gICAgICBib3JkZXItYm90dG9tOiAxNXB4IHNvbGlkICNlN2U3ZmY7IH1cXG4gICAgLm1lc3NhZ2VzIC50aGVpcnMgKyAudGhlaXJzIHtcXG4gICAgICBtYXJnaW4tdG9wOiAwLjNlbTsgfVxcbiAgICAgIC5tZXNzYWdlcyAudGhlaXJzICsgLnRoZWlyczpiZWZvcmUge1xcbiAgICAgICAgZGlzcGxheTogbm9uZTsgfVxcbiAgLm1lc3NhZ2VzIC50eXBpbmc6YWZ0ZXIge1xcbiAgICBjb250ZW50OiAnXFxcXDIwMjYnOyB9XFxuICAubWVzc2FnZXMgLmZsYXNoIHtcXG4gICAgbWFyZ2luOiAxZW0gMCAwIDA7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgZm9udC1zaXplOiAwLjhlbTtcXG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xcbiAgICBsaW5lLWhlaWdodDogM2VtO1xcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4OyB9XFxuICAgIC5tZXNzYWdlcyAuZmxhc2guaW5mbyB7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2U3ZTdmZjsgfVxcbiAgICAubWVzc2FnZXMgLmZsYXNoLm5vdGljZSB7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2VmZWM4OTsgfVxcbiAgICAubWVzc2FnZXMgLmZsYXNoLmNsaWNrYWJsZSB7XFxuICAgICAgY3Vyc29yOiBwb2ludGVyOyB9XFxuXFxudGV4dGFyZWEsIGJ1dHRvbiB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgbWFyZ2luOiA1cHg7IH1cXG5cXG50ZXh0YXJlYSB7XFxuICBmb250LXNpemU6IDIwcHg7XFxuICBtYXJnaW4tcmlnaHQ6IDBweDtcXG4gIGJvcmRlcjogMHB4OyB9XFxuXFxuYnV0dG9uIHtcXG4gIGZvbnQtc2l6ZTogMWVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VlZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XFxuICBjdXJzb3I6IHBvaW50ZXI7IH1cXG4gIGJ1dHRvbjpob3ZlciB7XFxuICAgIGJvcmRlci1jb2xvcjogI2NjYztcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIhLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9zdHlsZXNoZWV0cy9pbmRleC5zY3NzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRFbGVtZW50ID0gKGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbyA9IHt9O1xuXG5cdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHZhciBzdHlsZVRhcmdldCA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0Ly8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblx0XHRcdGlmIChzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG5cdFx0XHRcdFx0Ly8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1lbW9bc2VsZWN0b3JdID0gc3R5bGVUYXJnZXQ7XG5cdFx0fVxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24pIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJvYmplY3RcIiAmJiBvcHRpb25zLmluc2VydEF0LmJlZm9yZSkge1xuXHRcdHZhciBuZXh0U2libGluZyA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvICsgXCIgXCIgKyBvcHRpb25zLmluc2VydEF0LmJlZm9yZSk7XG5cdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbmV4dFNpYmxpbmcpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIltTdHlsZSBMb2FkZXJdXFxuXFxuIEludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnICgnb3B0aW9ucy5pbnNlcnRBdCcpIGZvdW5kLlxcbiBNdXN0IGJlICd0b3AnLCAnYm90dG9tJywgb3IgT2JqZWN0LlxcbiAoaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIjaW5zZXJ0YXQpXFxuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudCAoc3R5bGUpIHtcblx0aWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0c3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG5cblx0dmFyIGlkeCA9IHN0eWxlc0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZSk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhZGRBdHRycyhzdHlsZSwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZSk7XG5cblx0cmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhZGRBdHRycyhsaW5rLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmspO1xuXG5cdHJldHVybiBsaW5rO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRycyAoZWwsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlIChvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlLCB1cGRhdGUsIHJlbW92ZSwgcmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgcmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cblx0ICAgIGlmIChyZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cblx0XHRzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cblx0fSBlbHNlIGlmIChcblx0XHRvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIlxuXHQpIHtcblx0XHRzdHlsZSA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblxuXHRcdFx0aWYoc3R5bGUuaHJlZikgVVJMLnJldm9rZU9iamVjdFVSTChzdHlsZS5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlIChuZXdPYmopIHtcblx0XHRpZiAobmV3T2JqKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG5ld09iai5jc3MgPT09IG9iai5jc3MgJiZcblx0XHRcdFx0bmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiZcblx0XHRcdFx0bmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcFxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnIChzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlLmNoaWxkTm9kZXM7XG5cblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcgKHN0eWxlLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZS5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcblx0XHR9XG5cblx0XHRzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rIChsaW5rLCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qXG5cdFx0SWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdFx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0XHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0XHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpIHtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZiAoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGluay5ocmVmO1xuXG5cdGxpbmsuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKSBVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgKiBhcyBjaGF0cm9vbSBmcm9tICcuL2NoYXRyb29tLmpzJztcbmltcG9ydCBtb3JzZSBmcm9tICcuL2xpYi9lcHh4L21vcnNlLmpzJztcblxuLy8gTW9yc2UgZ2VuZXJhdGlvbiBzZXR0aW5nczpcbnZhciB0b25lID0gNjAwO1xudmFyIHZvbHVtZSA9IDUwO1xudmFyIHdwbSA9IDIwO1xudmFyIGZhcm5zID0gMjA7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgbW9yc2Uuc2V0dXAoKTtcbiAgbW9yc2UuY29uZmlnKHRvbmUsIHZvbHVtZSAvIDEwMCwgd3BtLCBmYXJucywgMywgMC42LCAyLCAzKTtcbn1cblxuZnVuY3Rpb24gcGxheUFzTW9yc2UobWVzc2FnZSwgY2FsbGJhY2spIHtcbiAgdmFyIGlucHV0LCBvdXRwdXQ7XG4gIFtpbnB1dCwgb3V0cHV0XSA9IG1vcnNlLmVuY29kZV9tb3JzZShtZXNzYWdlKTtcbiAgY29uc29sZS5sb2coXCJTZW5kaW5nIHRoaXMgY29kZTogXCIrb3V0cHV0KTtcbiAgbW9yc2UuZ2VuX3RpbWVsaW5lKG91dHB1dCk7XG4gIG1vcnNlLnN0YXJ0X3NjaGVkdWxlKGNhbGxiYWNrKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRNZXNzYWdlKCkge1xuICBjaGF0cm9vbS5zdGFydFNlbmRpbmcoKTtcbiAgdmFyIG1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRleHQtaW5wdXRcIikudmFsdWUudG9Mb3dlckNhc2UoKTtcblxuICBjaGF0cm9vbS5zaG93TWVzc2FnZShtZXNzYWdlLCBcIm1pbmVcIik7XG5cbiAgcGxheUFzTW9yc2UobWVzc2FnZSwgZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXh0LWlucHV0XCIpLnZhbHVlID0gXCJcIjtcbiAgICBjaGF0cm9vbS5zdG9wU2VuZGluZygpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV4dC1pbnB1dFwiKS5mb2N1cygpO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9vdXRwdXQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgb25faW50ZXJwcmV0OiBvbl9pbnRlcnByZXQsXG4gIG9mZl9pbnRlcnByZXQ6IG9mZl9pbnRlcnByZXQsXG4gIHBhcnNlX21vcnNlOiBwYXJzZV9tb3JzZVxufVxuXG52YXIgY2hhdHJvb20gPSByZXF1aXJlKCcuLi8uLi9jaGF0cm9vbS5qcycpO1xudmFyIG1vcnNlID0gcmVxdWlyZSgnLi9tb3JzZS5qcycpO1xuXG4vLyBUYWtlbiBmcm9tIGh0dHBzOi8vZXB4eC5jby9tb3JzZS9jb3B5Lmh0bWxcblxuLy8gaW5pdGlhbCBlc3RpbWF0ZXNcbnZhciB3cG0gPSAyMDtcblxudmFyIGRvdCA9IDE0MjAgLyB3cG07XG52YXIgZG90ZGV2ID0gMDtcblxudmFyIGludGVyZG90ID0gMS41ICogZG90O1xudmFyIGludGVyZG90ZGV2ID0gMDtcblxudmFyIGRvdF9wcm9wb3J0aW9uID0gMC41O1xudmFyIGludGVyZG90X3Byb3BvcnRpb24gPSAwLjc1O1xuXG52YXIgZG90X3Byb3BvcnRpb25fd2VpZ2h0ID0gMC4wNTtcbnZhciBkb3RfYWRqX3dlaWdodCA9IDAuMTtcbnZhciBpbnRlcmRvdF9wcm9wb3J0aW9uX3dlaWdodCA9IDAuMDU7XG52YXIgaW50ZXJkb3RfYWRqX3dlaWdodCA9IDAuMTtcblxudmFyIGtleWVsZW1lbnQ7XG52YXIgdGV4dDtcbnZhciBpdGV4dDtcbnZhciBlc3RpbWF0ZTtcbnZhciBiaXRzID0gXCJcIjsgLy8gZ29lcyBpbnRvIHRleHRcbnZhciBwYXJzZWRfbW9yc2UgPSBcIlwiOyAvLyBnb2VzIGludG8gaXRleHRcbnZhciBwYXJzZWRfbW9yc2VfYW50ID0gXCJcIjsgLy8gZ29lcyBpbnRvIGl0ZXh0IChwYXN0IHNlbnRlbmNlcylcblxuZnVuY3Rpb24gb25faW50ZXJwcmV0KHRpbWUpXG57XG4gIHZhciBpc19kb3QgPSAwO1xuICBpZiAodGltZSA+IChkb3QgKiAzICsgZG90ZGV2KSkge1xuICAgIC8vIGRlZmluaXRpdmVseSBkYXNoXG4gICAgYml0cyArPSBcIi1cIjtcbiAgICBpc19kb3QgPSAtMTtcbiAgfSBlbHNlIGlmICh0aW1lID4gKGRvdCAqIDEuOSArIGRvdGRldikpIHtcbiAgICAvLyB0YWtlIGFzIGRhc2hcbiAgICBiaXRzICs9XCItXCI7XG4gIH0gZWxzZSBpZiAodGltZSA8IGRvdCkge1xuICAgIC8vIGRlZmluaXRpdmVseSBkb3RcbiAgICBpc19kb3QgPSAyO1xuICAgIGJpdHMgKz0gXCIuXCI7XG4gIH0gZWxzZSB7XG4gICAgLy8gdGFrZSBhcyBkb3RcbiAgICBpc19kb3QgPSAxO1xuICAgIGJpdHMgKz0gXCIuXCI7XG4gIH1cblxuICBjb25zb2xlLmxvZyhcIk9OIHRpbWUgXCIgKyBNYXRoLnJvdW5kKHRpbWUpKTtcblxuICAvLyBtb3ZpbmcgYXZlcmFnZSBvZiBkb3QvZGFzaCBwcm9wb3J0aW9uXG4gIGRvdF9wcm9wb3J0aW9uID0gKDEgLSBkb3RfcHJvcG9ydGlvbl93ZWlnaHQpICogZG90X3Byb3BvcnRpb24gK1xuICAgICAgIGRvdF9wcm9wb3J0aW9uX3dlaWdodCAqICgoaXNfZG90ID4gMCkgPyAxIDogMCk7XG4gIC8vIGNvbnNvbGUubG9nKFwiUHJvcG9ydGlvbiBvZiBkb3RzOiBcIiArIE1hdGgucm91bmQoZG90X3Byb3BvcnRpb24gKiAxMDApICsgXCIlXCIpO1xuXG4gIHZhciB3ZWlnaHQgPSBkb3RfYWRqX3dlaWdodDtcbiAgaWYgKGlzX2RvdCA+PSAyKSB7XG4gICAgLy8gZG90IGlzIGNlcnRhaW5seSBzaG9ydGVyIHRoYW4gY3VycmVudCB3cG0gZXN0aW1hdGlvblxuICB9IGVsc2UgaWYgKGlzX2RvdCA8IDApIHtcbiAgICAvLyBkYXNoIGlzIGNlcnRhaW5seSBsb25nZXIgdGhhbiBjdXJyZW50IHdwbSBlc3RpbWF0aW9uXG4gICAgdGltZSAvPSAzO1xuICB9IGVsc2Uge1xuICAgIC8vIGNhbGlicmF0ZSB3ZWlnaHQgYXMgcHJvcG9ydGlvbiBkb3QvZGFzaCBkZXZpYXRlcyBmcm9tIDUwJVxuICAgIHdlaWdodCAqPSAoMiAqIE1hdGguYWJzKGRvdF9wcm9wb3J0aW9uIC0gMC41KSk7XG4gICAgaWYgKGRvdF9wcm9wb3J0aW9uID4gMC41KSB7XG4gICAgICAvLyB0b28gbWFueSBkb3RzOyBjb25zaWRlciB0aGF0IGB0aW1lYCBpcyBtb3N0IHByb2JhYmx5IGEgZGFzaFxuICAgICAgLy8gY29udmVydCBkYXNoIHRpbWUgdG8gZG90IHRpbWVcbiAgICAgIHRpbWUgLz0gMztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdG9vIG1hbnkgZGFzaGVzOyBjb25zaWRlciB0aGF0IGB0aW1lYCBpcyBtb3N0IHByb2JhYmx5IGEgZG90IFxuICAgIH1cbiAgfVxuICBkb3QgPSAoMS4wIC0gd2VpZ2h0KSAqIGRvdCArIHdlaWdodCAqIHRpbWU7XG4gIGRvdGRldiA9ICgxLjAgLSB3ZWlnaHQpICogZG90ZGV2ICsgd2VpZ2h0ICogTWF0aC5hYnMoZG90IC0gdGltZSk7XG4gIGNvbnNvbGUubG9nKFwiZG90IHRpbWUgXCIgKyBNYXRoLnJvdW5kKGRvdCkgKyBcIiBcIiArIE1hdGgucm91bmQoZG90ZGV2KSk7XG59XG5cbmZ1bmN0aW9uIG9mZl9pbnRlcnByZXQodGltZSwgdG8pXG57XG4gIHZhciBpc19pbnRlcmRvdCA9IDA7XG5cbiAgaWYgKHRvKSB7XG4gICAgLy8gdGltZW91dFxuICAgIHBhcnNlX21vcnNlKDIpOyAvLyBpbnRlci1zZW50ZW5jZVxuICAgIGlzX2ludGVyZG90ID0gLTI7XG4gIH0gZWxzZSBpZiAodGltZSA+IChpbnRlcmRvdCAqIDMuNSkpIHtcbiAgICAvLyBwcm9iYWJseSBpbnRlci13b3JkXG4gICAgaXNfaW50ZXJkb3QgPSAtMjtcbiAgICBwYXJzZV9tb3JzZSgxKTtcbiAgfSBlbHNlIGlmICh0aW1lID4gKGludGVyZG90ICogMiArIGludGVyZG90ZGV2KSkge1xuICAgIC8vIGNlcnRhaW5seSBpbnRlci1sZXR0ZXJcbiAgICBpc19pbnRlcmRvdCA9IC0xO1xuICAgIHBhcnNlX21vcnNlKDApO1xuICB9IGVsc2UgaWYgKHRpbWUgPiAoaW50ZXJkb3QgKiAxLjUgKyBpbnRlcmRvdGRldikpIHtcbiAgICAvLyB0YWtlIGFzIGludGVyLWxldHRlclxuICAgIHBhcnNlX21vcnNlKDApO1xuICB9IGVsc2UgaWYgKHRpbWUgPCBpbnRlcmRvdCkge1xuICAgIC8vIGRlZmluaXRpdmVseSBpbnRlci1kb3RcbiAgICBpc19pbnRlcmRvdCA9IDI7XG4gIH0gZWxzZSB7XG4gICAgLy8gdGFrZSBhcyBpbnRlci1kb3RcbiAgICBpc19pbnRlcmRvdCA9IDE7XG4gIH1cblxuICBjb25zb2xlLmxvZyhcIk9GRiB0aW1lIFwiICsgKHRvID8gXCJ0b1wiIDogTWF0aC5yb3VuZCh0aW1lKSkpO1xuXG4gIGlmICh0bykge1xuICAgIC8vIGRvIG5vdCB0YWtlIHRpbWVvdXQgaW50byBhY2NvdW50IGZvciBtb3ZpbmcgYXZnc1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIG1vdmluZyBhdmVyYWdlIG9mICdzcGFjZXMnXG4gIGludGVyZG90X3Byb3BvcnRpb24gPSAoMSAtIGludGVyZG90X3Byb3BvcnRpb25fd2VpZ2h0KSAqIGludGVyZG90X3Byb3BvcnRpb24gK1xuICAgICAgaW50ZXJkb3RfcHJvcG9ydGlvbl93ZWlnaHQgKiAoKGlzX2ludGVyZG90ID4gMCkgPyAxIDogMCk7XG4gIC8vIGNvbnNvbGUubG9nKFwiUHJvcG9ydGlvbiBvZiBpbnRlcmRvdDogXCIgKyBNYXRoLnJvdW5kKGludGVyZG90X3Byb3BvcnRpb24gKiAxMDApICsgXCIlXCIpO1xuXG4gIHZhciB3ZWlnaHQgPSBpbnRlcmRvdF9hZGpfd2VpZ2h0O1xuICBpZiAoaXNfaW50ZXJkb3QgPj0gMikge1xuICAgIC8vIGludGVyZG90IGlzIGNlcnRhaW5seSBzaG9ydGVyIHRoYW4gY3VycmVudCB3cG0gZXN0aW1hdGlvblxuICB9IGVsc2UgaWYgKGlzX2ludGVyZG90IDwgMCkge1xuICAgIC8vIGludGVyZG90IGlzIGNlcnRhaW5seSBsb25nZXIgdGhhbiBjdXJyZW50IHdwbSBlc3RpbWF0aW9uXG4gICAgdGltZSAvPSAyLjU7XG4gIH0gZWxzZSB7XG4gICAgLy8gc2NhbGUgd2VpZ2h0IGFzIHByb3BvcnRpb24gaW50ZXJkb3QvaW50ZXJsZXR0ZXIgZGV2aWF0ZXMgZnJvbSA3NSVcbiAgICB3ZWlnaHQgKj0gKDQgKiBNYXRoLm1pbigwLjI1LCBNYXRoLmFicyhpbnRlcmRvdF9wcm9wb3J0aW9uIC0gMC43NSkpKTtcbiAgICBpZiAoaW50ZXJkb3RfcHJvcG9ydGlvbiA+IDAuNzUpIHtcbiAgICAgIC8vIHRvbyBtYW55IGludGVyZG90czsgY29uc2lkZXIgdGhhdCBgdGltZWAgaXMgbW9zdCBwcm9iYWJseSBpbnRlci1sZXR0ZXJcbiAgICAgIC8vIGNvbnZlcnQgaW50ZXItbGV0dGVyIHRpbWUgdG8gaW50ZXJkb3QgdGltZVxuICAgICAgdGltZSAvPSAyLjU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRvbyBtYW55IGRhc2hlczsgY29uc2lkZXIgdGhhdCBgdGltZWAgaXMgbW9zdCBwcm9iYWJseSBhIGRvdCBcbiAgICB9XG4gIH1cbiAgaW50ZXJkb3QgPSAoMS4wIC0gd2VpZ2h0KSAqIGludGVyZG90ICsgd2VpZ2h0ICogdGltZTtcbiAgaW50ZXJkb3RkZXYgPSAoMS4wIC0gd2VpZ2h0KSAqIGludGVyZG90ZGV2ICsgd2VpZ2h0ICogTWF0aC5hYnMoaW50ZXJkb3QgLSB0aW1lKTtcbiAgY29uc29sZS5sb2coXCJpbnRlcmRvdCB0aW1lIFwiICsgTWF0aC5yb3VuZChpbnRlcmRvdCkgKyBcIiBcIiArIE1hdGgucm91bmQoaW50ZXJkb3RkZXYpKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VfbW9yc2UocGF1c2UpXG57XG4gIGNvbnNvbGUubG9nKFwiUGFyc2luZyBcIiArIGJpdHMpO1xuICBpZiAoYml0cy5sZW5ndGggPD0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjID0gXCIjXCI7XG4gIGZvciAodmFyIGsgaW4gbW9yc2UuY29kZV90YWJsZSgpKSB7XG4gICAgaWYgKG1vcnNlLmNvZGVfdGFibGUoKVtrXSA9PT0gYml0cykge1xuICAgICAgYyA9IGs7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcGFyc2VkX21vcnNlICs9IGM7XG4gIGJpdHMgPSBcIlwiO1xuXG4gIGNoYXRyb29tLnNob3dDaGFyYWN0ZXIoYy50b0xvd2VyQ2FzZSgpLCBcInRoZWlyc1wiKTtcblxuICBpZiAocGF1c2UgPj0gMikge1xuICAgIC8vIGludGVyLXNlbnRlbmNlXG4gICAgcGFyc2VkX21vcnNlX2FudCA9IHBhcnNlZF9tb3JzZSArIFwiPGJyPlwiICsgcGFyc2VkX21vcnNlX2FudDtcbiAgICAvLyBzaG93TWVzc2FnZShwYXJzZWRfbW9yc2UudG9Mb3dlckNhc2UoKSwgXCJ0aGVpcnNcIik7XG4gICAgY2hhdHJvb20uY2xvc2VNZXNzYWdlKFwidGhlaXJzXCIpO1xuICAgIHBhcnNlZF9tb3JzZSA9IFwiXCI7XG4gIH0gZWxzZSBpZiAocGF1c2UgPj0gMSkge1xuICAgIC8vIGludGVyLXdvcmRcbiAgICBwYXJzZWRfbW9yc2UgKz0gXCIgXCI7XG4gICAgY2hhdHJvb20uc2hvd0NoYXJhY3RlcihcIiBcIiwgXCJ0aGVpcnNcIik7XG4gIH1cblxuICAvLyB0ZXh0LmlubmVySFRNTCA9IGJpdHM7XG4gIC8vIGl0ZXh0LmlubmVySFRNTCA9IHBhcnNlZF9tb3JzZSArIFwiPGJyPlwiICsgcGFyc2VkX21vcnNlX2FudDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZXB4eC9jb3B5Mi5qcyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICB0b2dnbGVMaXZlSW5wdXQ6IHRvZ2dsZUxpdmVJbnB1dFxufVxuXG52YXIgaW5wdXQgPSByZXF1aXJlKCcuLi8uLi9pbnB1dC5qcycpO1xuXG4vKlxuVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5Db3B5cmlnaHQgKGMpIDIwMTQgQ2hyaXMgV2lsc29uXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiovXG5cbndpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cbnZhciBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7O1xudmFyIGlzUGxheWluZyA9IGZhbHNlO1xudmFyIHNvdXJjZU5vZGUgPSBudWxsO1xudmFyIGFuYWx5c2VyID0gbnVsbDtcbnZhciB0aGVCdWZmZXIgPSBudWxsO1xudmFyIERFQlVHQ0FOVkFTID0gbnVsbDtcbnZhciBtZWRpYVN0cmVhbVNvdXJjZSA9IG51bGw7XG52YXIgZGV0ZWN0b3JFbGVtLCBcbiAgY2FudmFzRWxlbSxcbiAgd2F2ZUNhbnZhcyxcbiAgcGl0Y2hFbGVtLFxuICBub3RlRWxlbSxcbiAgZGV0dW5lRWxlbSxcbiAgZGV0dW5lQW1vdW50O1xuXG4vLyB3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyAgIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbi8vICAgTUFYX1NJWkUgPSBNYXRoLm1heCg0LE1hdGguZmxvb3IoYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUvNTAwMCkpOyAgLy8gY29ycmVzcG9uZHMgdG8gYSA1a0h6IHNpZ25hbFxuLy8gICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuLy8gICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgXCIuLi9zb3VuZHMvd2hpc3RsaW5nMy5vZ2dcIiwgdHJ1ZSk7XG4vLyAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuLy8gICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuLy8gICAgIGF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEoIHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKGJ1ZmZlcikgeyBcbi8vICAgICAgICAgdGhlQnVmZmVyID0gYnVmZmVyO1xuLy8gICAgIH0gKTtcbi8vICAgfVxuLy8gICByZXF1ZXN0LnNlbmQoKTtcblxuLy8gICBkZXRlY3RvckVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJkZXRlY3RvclwiICk7XG4vLyAgIGNhbnZhc0VsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJvdXRwdXRcIiApO1xuLy8gICBERUJVR0NBTlZBUyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcIndhdmVmb3JtXCIgKTtcbi8vICAgaWYgKERFQlVHQ0FOVkFTKSB7XG4vLyAgICAgd2F2ZUNhbnZhcyA9IERFQlVHQ0FOVkFTLmdldENvbnRleHQoXCIyZFwiKTtcbi8vICAgICB3YXZlQ2FudmFzLnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xuLy8gICAgIHdhdmVDYW52YXMubGluZVdpZHRoID0gMTtcbi8vICAgfVxuLy8gICBwaXRjaEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJwaXRjaFwiICk7XG4vLyAgIG5vdGVFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwibm90ZVwiICk7XG4vLyAgIGRldHVuZUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJkZXR1bmVcIiApO1xuLy8gICBkZXR1bmVBbW91bnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJkZXR1bmVfYW10XCIgKTtcblxuLy8gICBkZXRlY3RvckVsZW0ub25kcmFnZW50ZXIgPSBmdW5jdGlvbiAoKSB7IFxuLy8gICAgIHRoaXMuY2xhc3NMaXN0LmFkZChcImRyb3B0YXJnZXRcIik7IFxuLy8gICAgIHJldHVybiBmYWxzZTsgfTtcbi8vICAgZGV0ZWN0b3JFbGVtLm9uZHJhZ2xlYXZlID0gZnVuY3Rpb24gKCkgeyB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wdGFyZ2V0XCIpOyByZXR1cm4gZmFsc2U7IH07XG4vLyAgIGRldGVjdG9yRWxlbS5vbmRyb3AgPSBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKFwiZHJvcHRhcmdldFwiKTtcbi8vICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICB0aGVCdWZmZXIgPSBudWxsO1xuXG4vLyAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbi8vICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbi8vICAgICAgICAgYXVkaW9Db250ZXh0LmRlY29kZUF1ZGlvRGF0YSggZXZlbnQudGFyZ2V0LnJlc3VsdCwgZnVuY3Rpb24oYnVmZmVyKSB7XG4vLyAgICAgICAgICAgdGhlQnVmZmVyID0gYnVmZmVyO1xuLy8gICAgICAgICB9LCBmdW5jdGlvbigpe2FsZXJ0KFwiZXJyb3IgbG9hZGluZyFcIik7fSApOyBcblxuLy8gICAgICAgfTtcbi8vICAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgICAgICAgIGFsZXJ0KFwiRXJyb3I6IFwiICsgcmVhZGVyLmVycm9yICk7XG4vLyAgICAgfTtcbi8vICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihlLmRhdGFUcmFuc2Zlci5maWxlc1swXSk7XG4vLyAgICAgICByZXR1cm4gZmFsc2U7XG4vLyAgIH07XG5cblxuXG4vLyB9XG5cbmZ1bmN0aW9uIGVycm9yKCkge1xuICAgIGFsZXJ0KCdTdHJlYW0gZ2VuZXJhdGlvbiBmYWlsZWQuJyk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJNZWRpYShkaWN0aW9uYXJ5LCBjYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSBcbiAgICAgICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8XG4gICAgICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fFxuICAgICAgICAgIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWE7XG4gICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoZGljdGlvbmFyeSwgY2FsbGJhY2ssIGVycm9yKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGFsZXJ0KCdnZXRVc2VyTWVkaWEgdGhyZXcgZXhjZXB0aW9uIDonICsgZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnb3RTdHJlYW0oc3RyZWFtKSB7XG4gICAgLy8gQ3JlYXRlIGFuIEF1ZGlvTm9kZSBmcm9tIHRoZSBzdHJlYW0uXG4gICAgbWVkaWFTdHJlYW1Tb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Uoc3RyZWFtKTtcblxuICAgIC8vIENvbm5lY3QgaXQgdG8gdGhlIGRlc3RpbmF0aW9uLlxuICAgIGFuYWx5c2VyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUFuYWx5c2VyKCk7XG4gICAgYW5hbHlzZXIuZmZ0U2l6ZSA9IDIwNDg7XG4gICAgbWVkaWFTdHJlYW1Tb3VyY2UuY29ubmVjdCggYW5hbHlzZXIgKTtcbiAgICB1cGRhdGVQaXRjaCgpO1xufVxuXG5mdW5jdGlvbiB0b2dnbGVPc2NpbGxhdG9yKCkge1xuICAgIGlmIChpc1BsYXlpbmcpIHtcbiAgICAgICAgLy9zdG9wIHBsYXlpbmcgYW5kIHJldHVyblxuICAgICAgICBzb3VyY2VOb2RlLnN0b3AoIDAgKTtcbiAgICAgICAgc291cmNlTm9kZSA9IG51bGw7XG4gICAgICAgIGFuYWx5c2VyID0gbnVsbDtcbiAgICAgICAgaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWU7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSggcmFmSUQgKTtcbiAgICAgICAgcmV0dXJuIFwicGxheSBvc2NpbGxhdG9yXCI7XG4gICAgfVxuICAgIHNvdXJjZU5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXG4gICAgYW5hbHlzZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcbiAgICBhbmFseXNlci5mZnRTaXplID0gMjA0ODtcbiAgICBzb3VyY2VOb2RlLmNvbm5lY3QoIGFuYWx5c2VyICk7XG4gICAgYW5hbHlzZXIuY29ubmVjdCggYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uICk7XG4gICAgc291cmNlTm9kZS5zdGFydCgwKTtcbiAgICBpc1BsYXlpbmcgPSB0cnVlO1xuICAgIGlzTGl2ZUlucHV0ID0gZmFsc2U7XG4gICAgdXBkYXRlUGl0Y2goKTtcblxuICAgIHJldHVybiBcInN0b3BcIjtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlTGl2ZUlucHV0KCkge1xuICAgIGlmIChpc1BsYXlpbmcpIHtcbiAgICAgICAgLy9zdG9wIHBsYXlpbmcgYW5kIHJldHVyblxuICAgICAgICBzb3VyY2VOb2RlLnN0b3AoIDAgKTtcbiAgICAgICAgc291cmNlTm9kZSA9IG51bGw7XG4gICAgICAgIGFuYWx5c2VyID0gbnVsbDtcbiAgICAgICAgaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWU7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSggcmFmSUQgKTtcbiAgICB9XG4gICAgZ2V0VXNlck1lZGlhKFxuICAgICAge1xuICAgICAgICAgICAgXCJhdWRpb1wiOiB7XG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImdvb2dFY2hvQ2FuY2VsbGF0aW9uXCI6IFwiZmFsc2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJnb29nQXV0b0dhaW5Db250cm9sXCI6IFwiZmFsc2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJnb29nTm9pc2VTdXBwcmVzc2lvblwiOiBcImZhbHNlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZ29vZ0hpZ2hwYXNzRmlsdGVyXCI6IFwiZmFsc2VcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJvcHRpb25hbFwiOiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSwgZ290U3RyZWFtKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlUGxheWJhY2soKSB7XG4gICAgaWYgKGlzUGxheWluZykge1xuICAgICAgICAvL3N0b3AgcGxheWluZyBhbmQgcmV0dXJuXG4gICAgICAgIHNvdXJjZU5vZGUuc3RvcCggMCApO1xuICAgICAgICBzb3VyY2VOb2RlID0gbnVsbDtcbiAgICAgICAgYW5hbHlzZXIgPSBudWxsO1xuICAgICAgICBpc1BsYXlpbmcgPSBmYWxzZTtcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKCByYWZJRCApO1xuICAgICAgICByZXR1cm4gXCJzdGFydFwiO1xuICAgIH1cblxuICAgIHNvdXJjZU5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgc291cmNlTm9kZS5idWZmZXIgPSB0aGVCdWZmZXI7XG4gICAgc291cmNlTm9kZS5sb29wID0gdHJ1ZTtcblxuICAgIGFuYWx5c2VyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUFuYWx5c2VyKCk7XG4gICAgYW5hbHlzZXIuZmZ0U2l6ZSA9IDIwNDg7XG4gICAgc291cmNlTm9kZS5jb25uZWN0KCBhbmFseXNlciApO1xuICAgIGFuYWx5c2VyLmNvbm5lY3QoIGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbiApO1xuICAgIHNvdXJjZU5vZGUuc3RhcnQoIDAgKTtcbiAgICBpc1BsYXlpbmcgPSB0cnVlO1xuICAgIGlzTGl2ZUlucHV0ID0gZmFsc2U7XG4gICAgdXBkYXRlUGl0Y2goKTtcblxuICAgIHJldHVybiBcInN0b3BcIjtcbn1cblxudmFyIHJhZklEID0gbnVsbDtcbnZhciB0cmFja3MgPSBudWxsO1xudmFyIGJ1ZmxlbiA9IDEwMjQ7XG52YXIgYnVmID0gbmV3IEZsb2F0MzJBcnJheSggYnVmbGVuICk7XG5cbnZhciBub3RlU3RyaW5ncyA9IFtcIkNcIiwgXCJDI1wiLCBcIkRcIiwgXCJEI1wiLCBcIkVcIiwgXCJGXCIsIFwiRiNcIiwgXCJHXCIsIFwiRyNcIiwgXCJBXCIsIFwiQSNcIiwgXCJCXCJdO1xuXG5mdW5jdGlvbiBub3RlRnJvbVBpdGNoKCBmcmVxdWVuY3kgKSB7XG4gIHZhciBub3RlTnVtID0gMTIgKiAoTWF0aC5sb2coIGZyZXF1ZW5jeSAvIDQ0MCApL01hdGgubG9nKDIpICk7XG4gIHJldHVybiBNYXRoLnJvdW5kKCBub3RlTnVtICkgKyA2OTtcbn1cblxuZnVuY3Rpb24gZnJlcXVlbmN5RnJvbU5vdGVOdW1iZXIoIG5vdGUgKSB7XG4gIHJldHVybiA0NDAgKiBNYXRoLnBvdygyLChub3RlLTY5KS8xMik7XG59XG5cbmZ1bmN0aW9uIGNlbnRzT2ZmRnJvbVBpdGNoKCBmcmVxdWVuY3ksIG5vdGUgKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKCAxMjAwICogTWF0aC5sb2coIGZyZXF1ZW5jeSAvIGZyZXF1ZW5jeUZyb21Ob3RlTnVtYmVyKCBub3RlICkpL01hdGgubG9nKDIpICk7XG59XG5cbi8vIHRoaXMgaXMgYSBmbG9hdCB2ZXJzaW9uIG9mIHRoZSBhbGdvcml0aG0gYmVsb3cgLSBidXQgaXQncyBub3QgY3VycmVudGx5IHVzZWQuXG4vKlxuZnVuY3Rpb24gYXV0b0NvcnJlbGF0ZUZsb2F0KCBidWYsIHNhbXBsZVJhdGUgKSB7XG4gIHZhciBNSU5fU0FNUExFUyA9IDQ7ICAvLyBjb3JyZXNwb25kcyB0byBhbiAxMWtIeiBzaWduYWxcbiAgdmFyIE1BWF9TQU1QTEVTID0gMTAwMDsgLy8gY29ycmVzcG9uZHMgdG8gYSA0NEh6IHNpZ25hbFxuICB2YXIgU0laRSA9IDEwMDA7XG4gIHZhciBiZXN0X29mZnNldCA9IC0xO1xuICB2YXIgYmVzdF9jb3JyZWxhdGlvbiA9IDA7XG4gIHZhciBybXMgPSAwO1xuICBpZiAoYnVmLmxlbmd0aCA8IChTSVpFICsgTUFYX1NBTVBMRVMgLSBNSU5fU0FNUExFUykpXG4gICAgcmV0dXJuIC0xOyAgLy8gTm90IGVub3VnaCBkYXRhXG4gIGZvciAodmFyIGk9MDtpPFNJWkU7aSsrKVxuICAgIHJtcyArPSBidWZbaV0qYnVmW2ldO1xuICBybXMgPSBNYXRoLnNxcnQocm1zL1NJWkUpO1xuICBmb3IgKHZhciBvZmZzZXQgPSBNSU5fU0FNUExFUzsgb2Zmc2V0IDw9IE1BWF9TQU1QTEVTOyBvZmZzZXQrKykge1xuICAgIHZhciBjb3JyZWxhdGlvbiA9IDA7XG4gICAgZm9yICh2YXIgaT0wOyBpPFNJWkU7IGkrKykge1xuICAgICAgY29ycmVsYXRpb24gKz0gTWF0aC5hYnMoYnVmW2ldLWJ1ZltpK29mZnNldF0pO1xuICAgIH1cbiAgICBjb3JyZWxhdGlvbiA9IDEgLSAoY29ycmVsYXRpb24vU0laRSk7XG4gICAgaWYgKGNvcnJlbGF0aW9uID4gYmVzdF9jb3JyZWxhdGlvbikge1xuICAgICAgYmVzdF9jb3JyZWxhdGlvbiA9IGNvcnJlbGF0aW9uO1xuICAgICAgYmVzdF9vZmZzZXQgPSBvZmZzZXQ7XG4gICAgfVxuICB9XG4gIGlmICgocm1zPjAuMSkmJihiZXN0X2NvcnJlbGF0aW9uID4gMC4xKSkge1xuICAgIGNvbnNvbGUubG9nKFwiZiA9IFwiICsgc2FtcGxlUmF0ZS9iZXN0X29mZnNldCArIFwiSHogKHJtczogXCIgKyBybXMgKyBcIiBjb25maWRlbmNlOiBcIiArIGJlc3RfY29ycmVsYXRpb24gKyBcIilcIik7XG4gIH1cbi8vICB2YXIgYmVzdF9mcmVxdWVuY3kgPSBzYW1wbGVSYXRlL2Jlc3Rfb2Zmc2V0O1xufVxuKi9cblxudmFyIE1JTl9TQU1QTEVTID0gMDsgIC8vIHdpbGwgYmUgaW5pdGlhbGl6ZWQgd2hlbiBBdWRpb0NvbnRleHQgaXMgY3JlYXRlZC5cbnZhciBHT09EX0VOT1VHSF9DT1JSRUxBVElPTiA9IDAuOTsgLy8gdGhpcyBpcyB0aGUgXCJiYXJcIiBmb3IgaG93IGNsb3NlIGEgY29ycmVsYXRpb24gbmVlZHMgdG8gYmVcblxuZnVuY3Rpb24gYXV0b0NvcnJlbGF0ZSggYnVmLCBzYW1wbGVSYXRlICkge1xuICB2YXIgU0laRSA9IGJ1Zi5sZW5ndGg7XG4gIHZhciBNQVhfU0FNUExFUyA9IE1hdGguZmxvb3IoU0laRS8yKTtcbiAgdmFyIGJlc3Rfb2Zmc2V0ID0gLTE7XG4gIHZhciBiZXN0X2NvcnJlbGF0aW9uID0gMDtcbiAgdmFyIHJtcyA9IDA7XG4gIHZhciBmb3VuZEdvb2RDb3JyZWxhdGlvbiA9IGZhbHNlO1xuICB2YXIgY29ycmVsYXRpb25zID0gbmV3IEFycmF5KE1BWF9TQU1QTEVTKTtcblxuICBmb3IgKHZhciBpPTA7aTxTSVpFO2krKykge1xuICAgIHZhciB2YWwgPSBidWZbaV07XG4gICAgcm1zICs9IHZhbCp2YWw7XG4gIH1cbiAgcm1zID0gTWF0aC5zcXJ0KHJtcy9TSVpFKTtcbiAgaWYgKHJtczwwLjAxKSAvLyBub3QgZW5vdWdoIHNpZ25hbFxuICAgIHJldHVybiAtMTtcblxuICB2YXIgbGFzdENvcnJlbGF0aW9uPTE7XG4gIGZvciAodmFyIG9mZnNldCA9IE1JTl9TQU1QTEVTOyBvZmZzZXQgPCBNQVhfU0FNUExFUzsgb2Zmc2V0KyspIHtcbiAgICB2YXIgY29ycmVsYXRpb24gPSAwO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPE1BWF9TQU1QTEVTOyBpKyspIHtcbiAgICAgIGNvcnJlbGF0aW9uICs9IE1hdGguYWJzKChidWZbaV0pLShidWZbaStvZmZzZXRdKSk7XG4gICAgfVxuICAgIGNvcnJlbGF0aW9uID0gMSAtIChjb3JyZWxhdGlvbi9NQVhfU0FNUExFUyk7XG4gICAgY29ycmVsYXRpb25zW29mZnNldF0gPSBjb3JyZWxhdGlvbjsgLy8gc3RvcmUgaXQsIGZvciB0aGUgdHdlYWtpbmcgd2UgbmVlZCB0byBkbyBiZWxvdy5cbiAgICBpZiAoKGNvcnJlbGF0aW9uPkdPT0RfRU5PVUdIX0NPUlJFTEFUSU9OKSAmJiAoY29ycmVsYXRpb24gPiBsYXN0Q29ycmVsYXRpb24pKSB7XG4gICAgICBmb3VuZEdvb2RDb3JyZWxhdGlvbiA9IHRydWU7XG4gICAgICBpZiAoY29ycmVsYXRpb24gPiBiZXN0X2NvcnJlbGF0aW9uKSB7XG4gICAgICAgIGJlc3RfY29ycmVsYXRpb24gPSBjb3JyZWxhdGlvbjtcbiAgICAgICAgYmVzdF9vZmZzZXQgPSBvZmZzZXQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmb3VuZEdvb2RDb3JyZWxhdGlvbikge1xuICAgICAgLy8gc2hvcnQtY2lyY3VpdCAtIHdlIGZvdW5kIGEgZ29vZCBjb3JyZWxhdGlvbiwgdGhlbiBhIGJhZCBvbmUsIHNvIHdlJ2QganVzdCBiZSBzZWVpbmcgY29waWVzIGZyb20gaGVyZS5cbiAgICAgIC8vIE5vdyB3ZSBuZWVkIHRvIHR3ZWFrIHRoZSBvZmZzZXQgLSBieSBpbnRlcnBvbGF0aW5nIGJldHdlZW4gdGhlIHZhbHVlcyB0byB0aGUgbGVmdCBhbmQgcmlnaHQgb2YgdGhlXG4gICAgICAvLyBiZXN0IG9mZnNldCwgYW5kIHNoaWZ0aW5nIGl0IGEgYml0LiAgVGhpcyBpcyBjb21wbGV4LCBhbmQgSEFDS1kgaW4gdGhpcyBjb2RlIChoYXBweSB0byB0YWtlIFBScyEpIC1cbiAgICAgIC8vIHdlIG5lZWQgdG8gZG8gYSBjdXJ2ZSBmaXQgb24gY29ycmVsYXRpb25zW10gYXJvdW5kIGJlc3Rfb2Zmc2V0IGluIG9yZGVyIHRvIGJldHRlciBkZXRlcm1pbmUgcHJlY2lzZVxuICAgICAgLy8gKGFudGktYWxpYXNlZCkgb2Zmc2V0LlxuXG4gICAgICAvLyB3ZSBrbm93IGJlc3Rfb2Zmc2V0ID49MSwgXG4gICAgICAvLyBzaW5jZSBmb3VuZEdvb2RDb3JyZWxhdGlvbiBjYW5ub3QgZ28gdG8gdHJ1ZSB1bnRpbCB0aGUgc2Vjb25kIHBhc3MgKG9mZnNldD0xKSwgYW5kIFxuICAgICAgLy8gd2UgY2FuJ3QgZHJvcCBpbnRvIHRoaXMgY2xhdXNlIHVudGlsIHRoZSBmb2xsb3dpbmcgcGFzcyAoZWxzZSBpZikuXG4gICAgICB2YXIgc2hpZnQgPSAoY29ycmVsYXRpb25zW2Jlc3Rfb2Zmc2V0KzFdIC0gY29ycmVsYXRpb25zW2Jlc3Rfb2Zmc2V0LTFdKS9jb3JyZWxhdGlvbnNbYmVzdF9vZmZzZXRdOyAgXG4gICAgICByZXR1cm4gc2FtcGxlUmF0ZS8oYmVzdF9vZmZzZXQrKDgqc2hpZnQpKTtcbiAgICB9XG4gICAgbGFzdENvcnJlbGF0aW9uID0gY29ycmVsYXRpb247XG4gIH1cbiAgaWYgKGJlc3RfY29ycmVsYXRpb24gPiAwLjAxKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJmID0gXCIgKyBzYW1wbGVSYXRlL2Jlc3Rfb2Zmc2V0ICsgXCJIeiAocm1zOiBcIiArIHJtcyArIFwiIGNvbmZpZGVuY2U6IFwiICsgYmVzdF9jb3JyZWxhdGlvbiArIFwiKVwiKVxuICAgIHJldHVybiBzYW1wbGVSYXRlL2Jlc3Rfb2Zmc2V0O1xuICB9XG4gIHJldHVybiAtMTtcbi8vICB2YXIgYmVzdF9mcmVxdWVuY3kgPSBzYW1wbGVSYXRlL2Jlc3Rfb2Zmc2V0O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQaXRjaCggdGltZSApIHtcbiAgdmFyIGN5Y2xlcyA9IG5ldyBBcnJheTtcbiAgYW5hbHlzZXIuZ2V0RmxvYXRUaW1lRG9tYWluRGF0YSggYnVmICk7XG4gIHZhciBhYyA9IGF1dG9Db3JyZWxhdGUoIGJ1ZiwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUgKTtcbiAgLy8gVE9ETzogUGFpbnQgY29uZmlkZW5jZSBtZXRlciBvbiBjYW52YXNFbGVtIGhlcmUuXG5cbiAgaWYgKERFQlVHQ0FOVkFTKSB7ICAvLyBUaGlzIGRyYXdzIHRoZSBjdXJyZW50IHdhdmVmb3JtLCB1c2VmdWwgZm9yIGRlYnVnZ2luZ1xuICAgIHdhdmVDYW52YXMuY2xlYXJSZWN0KDAsMCw1MTIsMjU2KTtcbiAgICB3YXZlQ2FudmFzLnN0cm9rZVN0eWxlID0gXCJyZWRcIjtcbiAgICB3YXZlQ2FudmFzLmJlZ2luUGF0aCgpO1xuICAgIHdhdmVDYW52YXMubW92ZVRvKDAsMCk7XG4gICAgd2F2ZUNhbnZhcy5saW5lVG8oMCwyNTYpO1xuICAgIHdhdmVDYW52YXMubW92ZVRvKDEyOCwwKTtcbiAgICB3YXZlQ2FudmFzLmxpbmVUbygxMjgsMjU2KTtcbiAgICB3YXZlQ2FudmFzLm1vdmVUbygyNTYsMCk7XG4gICAgd2F2ZUNhbnZhcy5saW5lVG8oMjU2LDI1Nik7XG4gICAgd2F2ZUNhbnZhcy5tb3ZlVG8oMzg0LDApO1xuICAgIHdhdmVDYW52YXMubGluZVRvKDM4NCwyNTYpO1xuICAgIHdhdmVDYW52YXMubW92ZVRvKDUxMiwwKTtcbiAgICB3YXZlQ2FudmFzLmxpbmVUbyg1MTIsMjU2KTtcbiAgICB3YXZlQ2FudmFzLnN0cm9rZSgpO1xuICAgIHdhdmVDYW52YXMuc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XG4gICAgd2F2ZUNhbnZhcy5iZWdpblBhdGgoKTtcbiAgICB3YXZlQ2FudmFzLm1vdmVUbygwLGJ1ZlswXSk7XG4gICAgZm9yICh2YXIgaT0xO2k8NTEyO2krKykge1xuICAgICAgd2F2ZUNhbnZhcy5saW5lVG8oaSwxMjgrKGJ1ZltpXSoxMjgpKTtcbiAgICB9XG4gICAgd2F2ZUNhbnZhcy5zdHJva2UoKTtcbiAgfVxuXG4gIGlucHV0LmFuYWx5emVyKGFjKTtcblxuICAvLyBpZiAoYWMgPT0gLTEpIHtcbiAgLy8gICBkZXRlY3RvckVsZW0uY2xhc3NOYW1lID0gXCJ2YWd1ZVwiO1xuICAvLyAgIHBpdGNoRWxlbS5pbm5lclRleHQgPSBcIi0tXCI7XG4gIC8vICAgbm90ZUVsZW0uaW5uZXJUZXh0ID0gXCItXCI7XG4gIC8vICAgZGV0dW5lRWxlbS5jbGFzc05hbWUgPSBcIlwiO1xuICAvLyAgIGRldHVuZUFtb3VudC5pbm5lclRleHQgPSBcIi0tXCI7XG4gIC8vIH0gZWxzZSB7XG4gIC8vICAgZGV0ZWN0b3JFbGVtLmNsYXNzTmFtZSA9IFwiY29uZmlkZW50XCI7XG4gIC8vICAgcGl0Y2ggPSBhYztcbiAgLy8gICBwaXRjaEVsZW0uaW5uZXJUZXh0ID0gTWF0aC5yb3VuZCggcGl0Y2ggKSA7XG4gIC8vICAgdmFyIG5vdGUgPSAgbm90ZUZyb21QaXRjaCggcGl0Y2ggKTtcbiAgLy8gICBub3RlRWxlbS5pbm5lckhUTUwgPSBub3RlU3RyaW5nc1tub3RlJTEyXTtcbiAgLy8gICB2YXIgZGV0dW5lID0gY2VudHNPZmZGcm9tUGl0Y2goIHBpdGNoLCBub3RlICk7XG4gIC8vICAgaWYgKGRldHVuZSA9PSAwICkge1xuICAvLyAgICAgZGV0dW5lRWxlbS5jbGFzc05hbWUgPSBcIlwiO1xuICAvLyAgICAgZGV0dW5lQW1vdW50LmlubmVySFRNTCA9IFwiLS1cIjtcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgaWYgKGRldHVuZSA8IDApXG4gIC8vICAgICAgIGRldHVuZUVsZW0uY2xhc3NOYW1lID0gXCJmbGF0XCI7XG4gIC8vICAgICBlbHNlXG4gIC8vICAgICAgIGRldHVuZUVsZW0uY2xhc3NOYW1lID0gXCJzaGFycFwiO1xuICAvLyAgICAgZGV0dW5lQW1vdW50LmlubmVySFRNTCA9IE1hdGguYWJzKCBkZXR1bmUgKTtcbiAgLy8gICB9XG4gIC8vIH1cblxuICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gIHJhZklEID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggdXBkYXRlUGl0Y2ggKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvY3dpbHNvL3BpdGNoZGV0ZWN0LmpzIiwidmFyIHNlcnZpY2VXb3JrZXJPcHRpb24gPSB7XCJzY3JpcHRVUkxcIjpcIi9zdy5qc1wifTtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuLyogZXNsaW50LWRpc2FibGUgZmxvd3R5cGUvcmVxdWlyZS12YWxpZC1maWxlLWFubm90YXRpb24gKi9cbi8qIGdsb2JhbCBzZXJ2aWNlV29ya2VyT3B0aW9uICovXG5cbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlcikge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHNlcnZpY2VXb3JrZXJPcHRpb24uc2NyaXB0VVJMLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3NlcnZpY2V3b3JrZXItd2VicGFjay1wbHVnaW4vbGliL3J1bnRpbWUuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=