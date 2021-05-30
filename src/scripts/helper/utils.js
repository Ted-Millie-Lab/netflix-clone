export function isFunction (value) {
  return typeof value === 'function'
}

export function isNumber (value) {
  return typeof value === 'number' && !isNaN(value)
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

// From: https://medium.com/@TCAS3/debounce-deep-dive-javascript-es6-e6f8d983b7a1
export function debounce (fn, time) {
  let timeout

  return function () {
    const functionCall = () => fn.apply(this, arguments)

    clearTimeout(timeout)
    timeout = setTimeout(functionCall, time)
  }
}

export function throttle (fn, delay) {
  var allowSample = true;

  return function(e) {
    if (allowSample) {
      allowSample = false;
      setTimeout(function() { allowSample = true; }, delay);
      fn(e);
    }
  };
}

export function addStyle (element, value) {
  if (isNumber(element.length)) {
    Array.from(element).forEach(
      elem => addStyle(elem.style, value)
    )

    return
  }

  Object.assign(element.style, value)
}

export function emptyStyle (element) {
  if (isNumber(element.length)) {
    Array.from(element).forEach(
      elem => emptyStyle(elem)
    )

    return
  }

  element.setAttribute('style', '')
}

export function addClass (element, value) {
  if (isNumber(element.length)) {
    Array.from(element).forEach(
      elem => addClass(elem, value)
    )

    return
  }

  element.classList.add(value)
}

export function removeClass (element, value) {
  if (isNumber(element.length)) {
    Array.from(element).forEach(
      elem => removeClass(elem, value)
    )

    return
  }

  element.classList.remove(value)
}

export function hasClass (element, value) {
  return element.classList.contains(value)
}