import * as chatroom from './chatroom.js';
import morse from './lib/epxx/morse.js';

// Morse generation settings:
var tone = 600;
var volume = 50;
var wpm = 20;
var farns = 20;

export function setup() {
  morse.setup();
  morse.config(tone, volume / 100, wpm, farns, 3, 0.6, 2, 3);
}

function playAsMorse(message, callback) {
  var input, output;
  [input, output] = morse.encode_morse(message);
  console.log("Sending this code: "+output);
  morse.gen_timeline(output);
  morse.start_schedule(callback);
}

export function sendMessage() {
  chatroom.startSending();
  var message = document.getElementById("text-input").value.toLowerCase();

  chatroom.showMessage(message, "mine");

  playAsMorse(message, function() {
    document.getElementById("text-input").value = "";
    chatroom.stopSending();
    document.getElementById("text-input").focus();
  });
}
