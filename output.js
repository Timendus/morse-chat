// Morse generation settings:
var tone = 600;
var volume = 50;
var wpm = 20;
var farns = 20;


var startSending = function() {
  document.getElementById("text-input").disabled = true;
  document.getElementById("send-button").disabled = true;
  document.getElementById("send-button").innerText = "Sending...";
}

var stopSending = function() {
  document.getElementById("text-input").disabled = false;
  document.getElementById("send-button").disabled = false;
  document.getElementById("send-button").innerText = "Send";
}


var log = [];

var storeMessage = function(message, owner) {
  log.push({message: message, owner: owner});
  localStorage.setItem('morse_log', JSON.stringify(log));
}

var renderLog = function() {
  log = JSON.parse(localStorage.getItem('morse_log')) || [];
  for ( i in log ) {
    entry = log[i];
    showMessage(entry.message, entry.owner);
  }
}


var showMessage = function(message, owner) {
  messageNode = document.createElement("div");
  messageNode.className = owner;
  messageNode.innerText = message;
  document.getElementById("messages").appendChild(messageNode);
  document.getElementById("messages").scrollTop = 100000;
}

var newestMessage = function(owner) {
  theirMessages = document.getElementsByClassName(owner);
  return theirMessages[theirMessages.length-1]
}

var openMessage = false;

var showCharacter = function(character, owner) {
  if (!openMessage) {
    showMessage("", "theirs typing");
    openMessage = true;
  }
  newestMessage(owner).innerText += character;
}

var closeMessage = function(owner) {
  openMessage = false;
  newestMessage(owner).classList.remove("typing");
  storeMessage(newestMessage(owner).innerText, owner);
}

var clearMessages = function() {
  // Erase log
  localStorage.removeItem('morse_log');
  log = [];
  // Clean up DOM
  messages = document.getElementById("messages");
  while ( messages.children.length > 1 ) {
    messages.removeChild(messages.lastChild);
  }
}


var playAsMorse = function(message, callback) {
  [input, output] = encode_morse(message);
  console.log("Sending this code: "+output);
  gen_timeline(output);
  start_schedule(callback);
}

var sendMessage = function() {
  startSending();
  message = document.getElementById("text-input").value.toLowerCase();

  storeMessage(message, "mine");
  showMessage(message, "mine");

  playAsMorse(message, function() {
    document.getElementById("text-input").value = "";
    stopSending();
    document.getElementById("text-input").focus();
  });
}


window.addEventListener('load', function() {

  setup();
  config(tone, volume / 100, wpm, farns, 3, 0.6, 2, 3);
  renderLog();

  document.getElementById("text-input").addEventListener("keyup", function(e) {
    if (e.keyCode == 13) {
      sendMessage();
    }
  });

  document.getElementById("send-button").addEventListener("click", sendMessage);

  document.getElementById("clear").addEventListener("click", clearMessages);

});
