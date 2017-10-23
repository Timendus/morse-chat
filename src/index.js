// Load styling
import './stylesheets/index.scss';

// Load javascripts
import * as chatroom from './chatroom.js';
import * as output from './output.js';
import * as input from './input.js';
import * as runtime from 'serviceworker-webpack-plugin/lib/runtime';

// Start execution
window.addEventListener('load', function() {
  output.setup();
  chatroom.renderLog();
  input.setup() && chatroom.showFlashMessage("Listening for morse signals...", "info");

  document.getElementById("text-input").addEventListener("keyup", e => {if (e.keyCode == 13) output.sendMessage()});
  document.getElementById("send-button").addEventListener("click", output.sendMessage);
  document.getElementById("clear").addEventListener("click", chatroom.clearMessages);
});

// Service worker setup
if ('serviceWorker' in navigator) {

  // This is the callback that the service worker can do on us
  navigator.serviceWorker.addEventListener('message', event => {
    switch (event.data.action) {
      case 'new_version':
        let element = chatroom.showFlashMessage("There is a new version available! Click here to reload the app", "notice clickable");
        element.addEventListener("click", () => location.reload());
        break;
    }
  });

  // Here we register the service worker
  const registration = runtime.register();
}

// Done
console.log("Ready!");
