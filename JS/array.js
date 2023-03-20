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

arr.myForEach((val) => {
  console.log('[forEach] val', val)
})

console.log('[reduce] val', routes.myReduce((prev, cur) => {
  prev[cur.path] = cur.component
  return prev  
}, {}))

console.log('[map] val', arr.myMap((val) => val * 2))
console.log('[filter] val', arr.myFilter(item => item % 2 !== 0))
