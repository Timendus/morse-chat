// Load styling
import './styling.scss';

// Load javascripts
// import './lib/epxx/morse.js';
// import './lib/epxx/copy2.js';
// import './lib/cwilso/pitchdetect.js';
// import './output.js';
// import './input.js';

import chatroom from './chatroom.js';
import output from './output.js';
import input from './input.js';

window.addEventListener('load', function() {

  output.setup();
  chatroom.renderLog();

  document.getElementById("text-input").addEventListener("keyup", function(e) {
    if (e.keyCode == 13) {
      output.sendMessage();
    }
  });

  document.getElementById("send-button").addEventListener("click", output.sendMessage);
  document.getElementById("clear").addEventListener("click", chatroom.clearMessages);

  // Start listening for Morse code
  input.setup();

});

// Done
console.log("Ready!");
