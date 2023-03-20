function doubleNum (num) {
  return num * 2
}

function addTen (num) {
  return num + 10
}

function subFive (num) {
  return num - 5
}

/**
 * 函数编程： 函数compose调用，方便一起调用
 * @returns 总数
 */
function compose () {
  const args = [].slice.apply(arguments)
  return function (res) {
    // 循环实现
    // let _res = res
    // for (let i = args.length - 1; i>=0; i--) {
    //   _res = args[i](_res)
    // }
    // return _res


    // JS原生实现
    return args.reduceRight((data, fn) => fn(data), res)
    // return args.reduce((data, fn) => fn(data), res)
  }
}

const result = compose(subFive, addTen, doubleNum)(10)
console.log('[compose] result', result)

/**
 * 函数链式调用
 * 需要借助Promise实现，跟对象返回this不同
 */
Promise.resolve(10)
  .then(doubleNum)
  .then(addTen)
  .then(subFive)
  .then(res => {
  console.log('[compose] promise result', res)
})
