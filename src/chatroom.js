module.exports = {
  startSending: startSending,
  stopSending: stopSending,
  renderLog: renderLog,
  showMessage: showMessage,
  showCharacter: showCharacter,
  closeMessage: closeMessage,
  clearMessages: clearMessages
}

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
  log.push({message: message, owner: owner});
  localStorage.setItem('morse_log', JSON.stringify(log));
}

function renderLog() {
  log = JSON.parse(localStorage.getItem('morse_log')) || [];
  for ( i in log ) {
    entry = log[i];
    showMessage(entry.message, entry.owner);
  }
}


function showMessage(message, owner) {
  storeMessage(message, owner);
  renderMessage(message, owner);
}

function renderMessage(message, owner) {
  messageNode = document.createElement("div");
  messageNode.className = owner;
  messageNode.innerText = message;
  document.getElementById("messages").appendChild(messageNode);
  document.getElementById("messages").scrollTop = 100000;
}

function newestMessage(owner) {
  theirMessages = document.getElementsByClassName(owner);
  return theirMessages[theirMessages.length-1]
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
  messages = document.getElementById("messages");
  while ( messages.children.length > 1 ) {
    messages.removeChild(messages.lastChild);
  }
}
