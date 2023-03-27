function Container (options) {
  const stacks = []
  const _options = createInitOptions(options)
  let _isLock = false
  console.log('[init] options', _options)

  const self = {
    add () {
      const args = [...arguments]
      args.forEach(arg => {
        if (typeof arg === 'function' && !has(stacks, arg)) {
          stacks.push(arg)
        } else if (Array.isArray(arg)) {
          arg.forEach(fn => self.add(fn))
        } else {
          throw new Error('add params must be funciton')
        }
      })
    },
    triger (params) {
      const [context, data] = params
      for (let i = 0; i < stacks.length; i++) {
        const fnRes = stacks[i].apply(context, data)
        // 开启停止监听配置后 并且返回false就停止执行
        if (_options.enableStopMonitor && fnRes === false) {
          break
        }
      }
    },
    beforeStart (context, data) {
      let curData = [context, data]
      let isExec = self.beforeStart.isExec
      // 这边根据当前是否开启执行一次参数处理执行状态
      self.beforeStart.isExec = !(_options.enabelOnceExec && isExec)

      return {
        isExec: self.beforeStart.isExec,
        data: curData
      }
    },
    start () {
      const { isExec, data } = self.beforeStart(this, arguments)
      isExec && self.triger(data)
    }
  }

  return self
}

function has (arr, fn) {
  return arr.indexOf(fn) > -1
}


function createInitOptions (options) {
  const result = {
    enableStopMonitor: false, // 开启函数执行停止舰艇
    enabelOnceExec: false, // 是否执行一次
  }

  if (typeof options === 'string') {
    const matches = options.match(/\S+/g)

    matches.forEach(key => {
      result[key] = true
    })
  } else if (toString.call(options) === '[object Object]'){
    Object.assign(result, options)
  }

  return result
}


// new Promise()
class MyPromise {
  constructor (fn) {
    this.state = 'pending'
    this.value = undefined
    this.fullStacks = []
    this.failStacks = []

    fn.call(null, this.resolve.bind(this), this.reject.bind(this))
  }

  resolve (data) {
    // console.log('[promise] resolve data', data)
    if (this.state === 'pending') {
      this.state = 'fullied'
      this.value = data
      this.fullStacks.forEach(cb => cb())
    }
  }

  reject (err) {
    console.log('[promise] reject error', err)
    if (this.state === 'pending') {
      this.state = 'failed'
      this.value = err
      this.failStacks.forEach(cb => cb())
    }
  }

  catch (errorFn) {
    return this.then(null, errorFn)
  }

  then (successFn, errorFn) {
    // console.log('[promise] then  state:',  this.state, 'value', this.value)
    const nowSuccessFn = toString.call(successFn) === '[object Function]' ? successFn : val => val
    const nowErrorFn = toString.call(errorFn) === '[object Function]' ? errorFn : err => { throw err }

    return new MyPromise((resolve, reject) => {
      if (this.state === 'pending') {
        this.fullStacks.push(() => {
          try {
            const res = nowSuccessFn(this.value)
            if (res && res.then && toString.call(res.then) === '[object Function]') {
              res.then(val => {
                resolve(val)
              }, err => {
                reject(err)
              })
            } else {
              resolve(res)
            }
          } catch (err) {
            reject(err)
          }
        })
  
        this.failStacks.push(() => {
          try {
            nowErrorFn(this.value)
          } catch (err) {
            reject(err)
          }
        })
      }
  
      if (this.state === 'fullied') {
        const res = nowSuccessFn(this.value)
        resolve(res)
      }
  
      if (this.state === 'failed') {
        const err = nowErrorFn(this.value)
        reject(err)
      }
    })
  }
}