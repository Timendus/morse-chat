var log = [];
var openMessage = false;

export function startSending() {
  document.getElementById("text-input").disabled = true;
  document.getElementById("send-button").disabled = true;
  document.getElementById("send-button").innerText = "Sending...";
}

export function stopSending() {
  document.getElementById("text-input").disabled = false;
  document.getElementById("send-button").disabled = false;
  document.getElementById("send-button").innerText = "Send";
}


function storeMessage(message, owner) {
  log.push({message: message, owner: owner});
  localStorage.setItem('morse_log', JSON.stringify(log));
}

export function renderLog() {
  log = JSON.parse(localStorage.getItem('morse_log')) || [];
  log.forEach(entry => renderMessage(entry.message, entry.owner));
}


export function showMessage(message, owner) {
  storeMessage(message, owner);
  renderMessage(message, owner);
}

function renderMessage(message, owner) {
  var messageNode = document.createElement("div");
  messageNode.className = owner;
  messageNode.innerText = message;
  document.getElementById("messages").appendChild(messageNode);
  document.getElementById("messages").scrollTop = 100000;
}

function newestMessage(owner) {
  var theirMessages = document.getElementsByClassName(owner);
  return theirMessages[theirMessages.length-1]
}


export function showCharacter(character, owner) {
  if (!openMessage) {
    renderMessage("", "theirs typing");
    openMessage = true;
  }
  newestMessage(owner).innerText += character;
}

export function closeMessage(owner) {
  openMessage = false;
  newestMessage(owner).classList.remove("typing");
  storeMessage(newestMessage(owner).innerText, owner);
}

export function clearMessages() {
  // Erase log
  localStorage.removeItem('morse_log');
  log = [];
  // Clean up DOM
  var messages = document.getElementById("messages");
  while ( messages.children.length > 1 ) {
    messages.removeChild(messages.lastChild);
  }
}
