export function isFunction (value) {
  return typeof value === 'function'
}

export function randomItem (arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// from: https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
export function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

// From: https://stackoverflow.com/questions/202605/repeat-string-javascript
export function repeat (pattern, count) {
  if (count < 1) return '';
  var result = '';
  while (count > 1) {
    if (count & 1) result += pattern;
    count >>= 1, pattern += pattern;
  }
  return result + pattern;
}