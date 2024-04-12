function UUID7Connection() {
  console.log("UUID7.js is connected");
}

function hex(number, len) {
  return number.toString(16).padStart(len, '0');
}

function random(bits) {
  // IEEE-754 mantissa: 52 bits
  if (bits > 52) { bits = 52 };
  // `Math.random()` is not cryptographically secure
  return Math.floor(Math.random() * Math.pow(2, bits));
}

export default function uuid7() {

  let uuid = "";

  // generate time chars
  let milli = (new Date()).getTime();
  let time = hex(milli, 12);

  // cat time and random chars
  uuid += time.substring(0, 8);
  uuid += "-";
  uuid += time.substring(8, 12);
  uuid += "-";
  uuid += hex(random(16), 4);
  uuid += "-";
  uuid += hex(random(16), 4);
  uuid += "-";
  uuid += hex(random(48), 12);

  // version and variant
  uuid = uuid.split('');
  // version at 13th digit:
  uuid[14] = '7';
  // variant at 17th digit (has to be 8,9,a or b):
  uuid[19] = ['8', '9', 'a', 'b'][random(2)];
  uuid = uuid.join('');

  return uuid;
}

export function extractTimeFromUUIDv7(uuid) {
  const cleanedUUID = uuid.replace(/-/g, '');
  const timeInHex = cleanedUUID.substring(0, 12);
  const timeInDecimal = parseInt(timeInHex, 16);
  const date = new Date(timeInDecimal);
  return date;
}
