module.exports = {
  on_interpret: on_interpret,
  off_interpret: off_interpret,
  parse_morse: parse_morse
}

var chatroom = require('../../chatroom.js');
var morse = require('./morse.js');

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

function on_interpret(time)
{
  var is_dot = 0;
  if (time > (dot * 3 + dotdev)) {
    // definitively dash
    bits += "-";
    is_dot = -1;
  } else if (time > (dot * 1.9 + dotdev)) {
    // take as dash
    bits +="-";
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
  dot_proportion = (1 - dot_proportion_weight) * dot_proportion +
       dot_proportion_weight * ((is_dot > 0) ? 1 : 0);
  // console.log("Proportion of dots: " + Math.round(dot_proportion * 100) + "%");

  var weight = dot_adj_weight;
  if (is_dot >= 2) {
    // dot is certainly shorter than current wpm estimation
  } else if (is_dot < 0) {
    // dash is certainly longer than current wpm estimation
    time /= 3;
  } else {
    // calibrate weight as proportion dot/dash deviates from 50%
    weight *= (2 * Math.abs(dot_proportion - 0.5));
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

function off_interpret(time, to)
{
  var is_interdot = 0;

  if (to) {
    // timeout
    parse_morse(2); // inter-sentence
    is_interdot = -2;
  } else if (time > (interdot * 3.5)) {
    // probably inter-word
    is_interdot = -2;
    parse_morse(1);
  } else if (time > (interdot * 2 + interdotdev)) {
    // certainly inter-letter
    is_interdot = -1;
    parse_morse(0);
  } else if (time > (interdot * 1.5 + interdotdev)) {
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
  interdot_proportion = (1 - interdot_proportion_weight) * interdot_proportion +
      interdot_proportion_weight * ((is_interdot > 0) ? 1 : 0);
  // console.log("Proportion of interdot: " + Math.round(interdot_proportion * 100) + "%");

  var weight = interdot_adj_weight;
  if (is_interdot >= 2) {
    // interdot is certainly shorter than current wpm estimation
  } else if (is_interdot < 0) {
    // interdot is certainly longer than current wpm estimation
    time /= 2.5;
  } else {
    // scale weight as proportion interdot/interletter deviates from 75%
    weight *= (4 * Math.min(0.25, Math.abs(interdot_proportion - 0.75)));
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

function parse_morse(pause)
{
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
