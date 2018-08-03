"use strict";

function toBytesInt32 (num) {
    return [     
         (num & 0x000000ff),
         (num & 0x0000ff00) >> 8,
         (num & 0x00ff0000) >> 16,
         (num & 0xff000000) >> 24
    ];
}

function toBytesInt16 (num) {
    return [
         (num & 0x00ff),
         (num & 0xff00) >> 8
    ];
}

function bytesToString (bs) {
  return bs.map((x,i)=>{return String.fromCharCode(x)}).join("");
}

function makeHeader(data_size, channels, sample_rate, bytes_per_sample) {
  var header = "RIFF";
  header += bytesToString(toBytesInt32(data_size + 36));
  header += "WAVE";
  header += "fmt ";
  header += bytesToString(toBytesInt32(16));
  header += bytesToString(toBytesInt16(1)); // PCM
  header += bytesToString(toBytesInt16(channels));
  header += bytesToString(toBytesInt32(sample_rate));
  header += bytesToString(toBytesInt32(sample_rate * bytes_per_sample * channels));
  header += bytesToString(toBytesInt16(channels * bytes_per_sample));
  header += bytesToString(toBytesInt16(bytes_per_sample * 8));
  header += "data";
  header += bytesToString(toBytesInt32(data_size));
  return header;
}

var bytes_per_sample = 1;
var channels = 1;
var sample_rate = 16000;
var seconds = 60;

var header = makeHeader(seconds * sample_rate * bytes_per_sample, channels, sample_rate, bytes_per_sample);

var freq = 440;

var data = Array(seconds*sample_rate*bytes_per_sample);

for (var i = 0; i < seconds*sample_rate; ++i)
  data[i] = (Math.sin(i / sample_rate * (Math.PI * 2) * freq) + 1) * 127;

var base64_data = btoa(header + bytesToString(data))

document.getElementById("player").src = "data:audio/wav;base64,"+base64_data

function escape (str) {
  return str.replace(/[^\x20-\x7E]/g, function (c) {
    return "\\x" + c.charCodeAt(0).toString(16).padStart(2, '0');
  });
}

console.log(escape(header));