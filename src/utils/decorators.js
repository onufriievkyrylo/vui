export const throttle = (fn, wait) => {
  let last = -Infinity
  let timeout = null
  return function (...args) {
    const now = Date.now()
    if (now < last + wait) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        last = now
        fn.apply(this, args)
      }, wait)
    } else {
      last = now
      fn.apply(this, args)
    }
  }
}

export const debounce = (fn, wait) => {
  let timeout = null
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), wait)
  }
}
