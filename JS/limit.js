/* 防抖函数和节流函数是为了限制高频操作的一种方式 */


// 防抖函数：等操作完成后才执行
function debounce (fn, delay) {
  if (typeof fn !== 'function') {
    throw new Error('firt param must be funciton')
  }

  let timer = null

  return function () {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

// 节流函数：初始化执行 中断一定时间后 恢复执行
// 1. 定时器方案
function throttleTimer(fn, wait) {
  let timer = null

  return function () {
    if (timer) return

    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, wait)
  }
}

// 2.时间戳方案
function throttle(fn, wait) {
  let pre = 0

  return function () {
    let now = Date.now()
    if (now - pre >= wait) {
      fn.apply(this, arguments)
      pre = Date.now()
    }
  }
}