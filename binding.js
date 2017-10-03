// Morse generation settings:
var tone = 700;
var volume = 50;
var wpm = 30;
var farns = 30;

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

var showMessage = function(message, owner) {
  messageNode = document.createElement("div");
  messageNode.className = owner;
  messageNode.innerText = message;
  document.getElementById("messages").appendChild(messageNode);
  document.getElementById("messages").scrollTop = 100000;
}

var playAsMorse = function(message, callback) {
  [input, output] = encode_morse(message);
  gen_timeline(output);
  start_schedule(callback);
}

var sendMessage = function() {
  startSending();
  message = document.getElementById("text-input").value;

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

  document.getElementById("text-input").addEventListener("keyup", function(e) {
    if (e.keyCode == 13) {
      sendMessage();
    }
  });

  document.getElementById("send-button").addEventListener("click", sendMessage);

});
