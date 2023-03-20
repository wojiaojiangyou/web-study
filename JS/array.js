const arr = [1,2,3]
const routes = [
  {
    path: '/',
    component: 'hello'
  },
  {
    path: '/test',
    component: 'test'
  }
]

// forEach实现
Array.prototype.myForEach = function (callback) {
  if (typeof callback !== 'function') {
    throw new Error('param must be funciton')
  }

  const len = this.length

  for (let i = 0; i < len; i++) {
    callback.call(this, this[i], i, this)
  }
}

// map实现
Array.prototype.myMap = function (callback) {
  if (typeof callback !== 'function') {
    throw new Error('param must be funciton')
  }

  const len = this.length
  const arr = []

  for (let i = 0; i < len; i++) {
    const item = callback.call(this, this[i], i, this)
    // 如果为对象值需要解除引用关系
    if (typeof item === 'object') {
      item.push(Object.create(item))
    } else {
      arr.push(item)
    }
  }

  return arr
}

// reduce实现
Array.prototype.myReduce = function (callback, init) {
  if (typeof callback !== 'function') {
    throw new Error('param must be funciton')
  }

  const len = this.length
  let i = 0
  let prev = init
  // 如果没有初始值 默认取数组第一个元素
  if (init === undefined) {
    prev = this[0]
    i = 1
  }

  for (i; i < len; i++) {
    prev = callback.call(this, prev, this[i], i, this)
  }

  return prev
}

// filter实现
Array.prototype.myFilter = function (callback) {
  if (typeof callback !== 'function') {
    throw new Error('param must be function')
  }

  const len = this.length
  const arr = []

  for (let i = 0; i < len; i++) {
    if (callback.call(this, this[i], i, this)) {
      arr.push(this[i])
    }
  }

  return arr
}

/**
 * 函数柯里化实现：bind
 * 主要为了解决固定某一个参数的场景 避免重复传入参数
 */
Array.prototype.myBind = function (instance) {
  // 判定当前调用的bind方法必须是个函数 否则无法调用
  if (typeof this !== 'function') {
    throw new Error('only use function object method')
  }
  const _this = this
  const _args = [].slice(arguments, 1)

  return function () {
    // 拼接bind参数和返回后函数调用的参数
    const curArgs = _args.concat([].slice(arguments))
    // 更改调用this
    _this.apply(instance, curArgs)
  }
}

arr.myForEach((val) => {
  console.log('[forEach] val', val)
})

console.log('[reduce] val', routes.myReduce((prev, cur) => {
  prev[cur.path] = cur.component
  return prev  
}, {}))

console.log('[map] val', arr.myMap((val) => val * 2))
console.log('[filter] val', arr.myFilter(item => item % 2 !== 0))


const obj = {
  key: 'name',
  print (val) {
    console.log('[bind] print:', val)
  }
}

function printObject (val) {
  this.print(this.key + ':' + val)
}

const bindFunc = printObject.bind(obj)
bindFunc('zhangsan')