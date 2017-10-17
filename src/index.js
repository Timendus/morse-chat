// Load styling
import './stylesheets/index.scss';

// Load javascripts
import * as chatroom from './chatroom.js';
import * as output from './output.js';
import * as input from './input.js';

// Start execution
window.addEventListener('load', function() {
  output.setup();
  chatroom.renderLog();
  input.setup();

  document.getElementById("text-input").addEventListener("keyup", e => {if (e.keyCode == 13) output.sendMessage()});
  document.getElementById("send-button").addEventListener("click", output.sendMessage);
  document.getElementById("clear").addEventListener("click", chatroom.clearMessages);
});

// Done
console.log("Ready!");
