(function (root) {
  // 通过构造函数构建：函数也是对象可以挂在静态方法
  const _ = function (data) {
    if (!(this instanceof _)) {
      return new _(data)
    }

    // 保存构造函数参数
    this.data = data
  }

  // 处理链式调用实例返回
  function wrapperChain (instance, funResult) {
    if (instance.start_chain) {
      instance.data = funResult // 存储链式操作的上一个结果
      return instance
    }

    return funResult
  }

  // 去重
  _.unique = function (arr, callback) {
    let result = []

    arr.forEach(val => {
      const curVal = typeof callback === 'function' ? callback(val) : val

      if (!result.includes(curVal)) {
        result.push(curVal)
      }
    })

    return result
  }
  
  // 过滤操作
  _.filterArr = function (arr, callback) {
    const res = []
    arr.forEach((val, index) => {
      if (callback && callback(val, index)) {
        res.push(val)
      }
    })
    return res
  }

  // 开启链式操作
  _.chain = function (data) {
    const instance = new _(data)
    instance.start_chain = true
    return instance
  }

  // 结束操作
  _.end = function () {
    this.start_chain = false
    return this.data
  }

  // 混入实例调用的方法
  _.mixin = function (target) {
    Object.keys(target).forEach((key) => {
      const func = target[key]
      _.prototype[key] = function () {
        // 这边增加一个处理层 判断是否是开启链式调用的实例
        return wrapperChain(this, func.call(this, this.data, ...arguments))
      }
    })
  }

  _.mixin(_) // 合并静态方法到实例方法
  root._ = _
})(this)