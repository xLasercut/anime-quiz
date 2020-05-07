const debounce = (f: Function, delay: number): Function => {
  let inDebounce: any
  return function (this: ThisParameterType<Function>) {
    clearTimeout(inDebounce)
    inDebounce = setTimeout((): void => {
      f.apply(this, arguments)
    }, delay)
  }
}


const throttle = (func: Function, limit: number): Function => {
  let inThrottle = false
  return function (this: ThisParameterType<Function>) {
    if (!inThrottle) {
      func.apply(this, arguments)
      inThrottle = true
      setTimeout((): void => {
        inThrottle = false
      }, limit)
    }
  }
}

export {debounce, throttle}
