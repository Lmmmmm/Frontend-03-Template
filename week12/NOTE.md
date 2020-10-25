# 1. proxy的基本用法

Proxy是一种强大但是危险的功能，在业务中可能很少出现。因此proxy一般是为底层库而设计的

Proxy 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）

我们可以看下下面这个object

```jsx
let object = {
	a: 1,
  b: 2
}
```

我们没法在访问a或b的中间添加监听事件。因此object其实就是一个不可observe的单纯的数据存储，也是JS最底层的机制。

proxy就可以帮助我们监听object（可以理解为把object包裹起来 ）

proxy的第一个参数是object，第二个参数是config对象，config对象里面就包含了所有我们要对po对象去做的钩子

我们使用下面代码块的object的时候并不会触发Proxy，只有当我们使用po的时候才执行proxy对象的行为。我们可以理解为po是一个特殊的对象，po上面所有的行为都是可以被重新指定的。

```jsx
// 使用proxy代理一个对象
let obj = {
  a: 1,
  b: 2,
}

let proxy = new Proxy(obj, {
  // 拦截获取属性 obje.xx
  get(obj, prop) {
    console.log('get:', obj, prop);
  },
  // 拦截设置属性 obje.xx = xxx
  set(obj, prop, val) {
    console.log('set:', obj, prop, val);
  }
});

proxy.a; // 1.html:18 get: {a: 1, b: 2} a
proxy.a = 3; // set: {a: 1, b: 2} a 3
```

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c5da6c4a-3fe0-4cf4-b057-52e6c0506bf3/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c5da6c4a-3fe0-4cf4-b057-52e6c0506bf3/Untitled.png)

Proxy拦截器还包含has, deleteProperty, OwnKeys, apply, construct等。

[MDN文档地址]:

[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

# 2. 模仿reactive实现原理

## 实现一

我们接下来尝试把对象做一个简单的包装。这里我们尝试模仿vue的reactive的实现原理。

```jsx
  let object = {
    a: 1,
    b: 2,
  };

  let po = reactive(object);

// reactive 函数定义 将Proxy封装
  function reactive(object) {
    return new Proxy(object, {
      //设置一个最简单的钩子
      set(obj, prop, val) {
        obj[prop] = val;
        console.log(obj, prop, val);
        return obj[prop];
      },
      get(obj, prop) {
        console.log(obj, prop);
        return obj[prop];
      },
    });
  }

//po.x = 99 -> object: {a: 1, b: 2, x: 99}
//po.a = 40 -> object: {a: 40, b: 2, x: 99}
```

我们通过调用reactive函数实现proxy，我们就可以通过reactive函数来添加或者改变原本object的值。

## 实现二：

接下来我们再继续加入一些真正的reactive，让事件变得可以监听。

我们知道监听的话使用addEventListener就可以实现，但是在vue里面是使用了`effect`，里面回调一个函数。

因此 : 增加监听函数`effect`

- 定义`callbacks`数组存放所有`effect`中的回调函数
- 在`Proxy`中set拦截器中执行`callbacks`

```jsx
let p1 = reactive({
  a: 1,
  b: 2
});
// * 定义`callbacks`数组存放所有`effect`中的回调函数
let callbacks = [];

function reactive(object) {
  return new Proxy(object, {
    get(obj, prop) {
      return obj[prop];
    },
    set(obj, prop, val) {
      obj[prop] = val;
      // 执行保存的回调函数
      for (let call of callbacks) {
        call && call();
      }
      return obj[prop];
    }
  });
}

function effect(callback) {
  // 将回调函数保存
  callbacks.push(callback);
}

effect(() => {
  console.log('effect');
});

p1.a = 10; // effect 10
```

> 在p1进行赋值时候会执行effect中的回调函数

## 实现三：

将`effect`和`reactive`建立关联

- 定义`usedReactiveties` 数组存放需要监听的对象和属性信息
- 在`Proxy`中`set`拦截器中将对象和属性加入数组`usedReactiveties`中
- 在`Proxy`中`get`拦截器中从收集对象`usedReactiveties`中找到当前对象的监听函数`callback`函数并执行
- 在`effect`中执行一次callback将触发`usedReactiveties`的收集
- `usedReactiveties`的收集完成后将回调函数`callback`加入绑定到收集对象中

```jsx
let callbacks = new Map();
// 定义`usedReactiveties` 数组存放需要监听的对象和属性信息
let usedReactiveties = [];
let p1 = reactive({
  a: 1,
  b: 2,
});

function reactive(object) {
  return new Proxy(object, {
    get(obj, prop) {
      // 在`Proxy`中`set`拦截器中将对象和属性加入数组`usedReactiveties`中
      usedReactiveties.push([obj, prop]);
      return obj[prop];
    },
    set(obj, prop, val) {
      obj[prop] = val;

      if (callbacks.get(obj)) {
        if (callbacks.get(obj).get(prop)) {
          // 在`Proxy`中`get`拦截器中从收集对象`usedReactiveties`中找到当前对象的监听函数`callback`函数并执行
          for (let call of callbacks.get(obj).get(prop)) {
            call && call();
          }
        }
      }

      return obj[prop];
    }
  });
}

function effect(callback) {
  usedReactiveties = [];
  // 在`effect`中执行一次callback将触发`usedReactiveties`的收集
  callback();

  for(let reactive of usedReactiveties) {
    // 空状态处理
    if (!callbacks.has(reactive[0])) {
      callbacks.set(reactive[0], new Map());
    }
    if (!callbacks.get(reactive[0]).has(reactive[1])) {
      callbacks.get(reactive[0]).set(reactive[1], []);
    }
    // `usedReactiveties`的收集完成后将回调函数`callback`加入绑定到收集对象中
    callbacks.get(reactive[0]).get(reactive[1]).push(callback);
  }
}

effect(() => {
  console.log('effect', p1.a);
});
```

当对象有多层属性的时候obj.xx.xx上面实现代码并不能触发effect函数，接下来我们就需要实现对象深度监听

## 实现四：

在`Proxy get`拦截器中增加一层判断，当属性为对象`Object`则直接返回一个新的`Proxy`

```jsx
get(obj, prop) {
  usedReactiveties.push([obj, prop]);
  if (typeof obj[prop] === 'object') {
    return reactive(obj[prop]);
  }
  return obj[prop];
},
```

同时再增加一层proxy缓存，在创建proxy之前查看是否有缓存有则使用缓存

```jsx
let reactivties = new Map();

function reactive(object) {
  // 判断是否有缓存proxy
  if (reactivties.has(object)) {
    return reactivties.get(object);
  }
  let proxy = new Proxy(object, {
    get(obj, prop) {
      usedReactiveties.push([obj, prop]);
      if (typeof obj[prop] === 'object') {
        return reactive(obj[prop]);
      }
      return obj[prop];
    },
    set(obj, prop, val) {
      obj[prop] = val;

      if (callbacks.get(obj)) {
        if (callbacks.get(obj).get(prop)) {
          // 执行保存的回调函数
          for (let call of callbacks.get(obj).get(prop)) {
            call && call();
          }
        }
      }

      return obj[prop];
    }
  });
  
  // 缓存当前proxy
  reactivties.set(object, proxy);

  return proxy;
}
```

完整代码：

```jsx
let obj = {
  a: 1,
  b: 2,
}

let callbacks = new Map();
let reactivties = new Map();
let usedReactiveties = [];
let p1 = reactive(obj);

function reactive(object) {
  if (reactivties.has(object)) {
    return reactivties.get(object);
  }
  let proxy = new Proxy(object, {
    get(obj, prop) {
      usedReactiveties.push([obj, prop]);
      if (typeof obj[prop] === 'object') {
        return reactive(obj[prop]);
      }
      return obj[prop];
    },
    set(obj, prop, val) {
      obj[prop] = val;

      if (callbacks.get(obj)) {
        if (callbacks.get(obj).get(prop)) {
          // 执行保存的回调函数
          for (let call of callbacks.get(obj).get(prop)) {
            call && call();
          }
        }
      }

      return obj[prop];
    }
  });
  
  reactivties.set(object, proxy);

  return proxy;
}

function effect(callback) {
  // 将回调函数保存
  // callbacks.push(callback);
  usedReactiveties = [];
  callback();

  for(let reactive of usedReactiveties) {
    if (!callbacks.has(reactive[0])) {
      callbacks.set(reactive[0], new Map());
    }
    if (!callbacks.get(reactive[0]).has(reactive[1])) {
      callbacks.get(reactive[0]).set(reactive[1], []);
    }
    callbacks.get(reactive[0]).get(reactive[1]).push(callback);
  }
}

effect(() => {
  console.log('effect', p1.a);
  console.log('effect', p1.b);
});
```

# 3. reactive应用场景-双向绑定

使用input进行双向绑定

```jsx
<input type="text" id="r" value="">
<script>
  
  let callbacks = new Map();
  let reactivities = new Map();
  let usedReactivities = [];

  let p1 = reactive({
    val: 10
  });

  effect(() => {
    // val发生变化时自动设置input值
    document.getElementById('r').value = p1.val;
  })

  function reactive(object) {
    if (reactivities.has(object)) {
      return reactivities.get(object);
    }
    let proxy = new Proxy(object, {
      get(obj, prop) {
        usedReactivities.push([obj, prop]);
        if (typeof obj[prop] === 'object') {
          return reactive(obj[prop]);
        }
        return obj[prop];
      },
      set(obj, prop, val) {
        obj[prop] = val;

        if (callbacks.get(obj)) {
          if (callbacks.get(obj).get(prop)) {
            // 执行保存的回调函数
            for (let call of callbacks.get(obj).get(prop)) {
              call && call();
            }
          }
        }

        return obj[prop];
      }
    });
    
    reactivities.set(object, proxy);

    return proxy;
  }

  function effect(callback) {
    // 将回调函数保存
    // callbacks.push(callback);
    usedReactivities = [];
    callback();

    for(let reactive of usedReactivities) {
      if (!callbacks.has(reactive[0])) {
        callbacks.set(reactive[0], new Map());
      }
      if (!callbacks.get(reactive[0]).has(reactive[1])) {
        callbacks.get(reactive[0]).set(reactive[1], []);
      }
      callbacks.get(reactive[0]).get(reactive[1]).push(callback);
    }
  }

</script>
```

这样我们就可以通过在console改变p1.val 的值来改变input框内的值。

## 利用双向绑定制作RGB调色板

```jsx
<div>
    红: <input type="range" id="r" value="" min="0" max="255">
  </div>
  <div>
    绿: <input type="range" id="g" value="" min="0" max="255">
  </div>
  <div>
    蓝: <input type="range" id="b" value="" min="0" max="255">
  </div>
  <div style="width: 100px; height: 100px;border-radius: 50%;" id='color'></div>
  <style>
    input{
    }
  </style>
  <script>
    
    let callbacks = new Map();
    let reactivties = new Map();
    let usedReactiveties = [];
  
    let p1 = reactive({
      r: 0,
      g: 0,
      b: 0,
    });
  
    const $ = (el) => {
      return document.querySelector(el);
    }
  
    effect(() => {
      $('#r').value = p1.r;
    });
    effect(() => {
      $('#g').value = p1.g;
    });
    effect(() => {
      $('#b').value = p1.b;
    });
  
    $('#r').addEventListener('input', event => p1.r = event.target.value);
    $('#g').addEventListener('input', event => p1.g = event.target.value);
    $('#b').addEventListener('input', event => p1.b = event.target.value);
  
    effect(() => {
      $('#color').style.backgroundColor = `rgb(${p1.r}, ${p1.g}, ${p1.b})`;
    });
  
    function reactive(object) {
      if (reactivties.has(object)) {
        return reactivties.get(object);
      }
      let proxy = new Proxy(object, {
        get(obj, prop) {
          usedReactiveties.push([obj, prop]);
          if (typeof obj[prop] === 'object') {
            return reactive(obj[prop]);
          }
          return obj[prop];
        },
        set(obj, prop, val) {
          obj[prop] = val;
  
          if (callbacks.get(obj)) {
            if (callbacks.get(obj).get(prop)) {
              // 执行保存的回调函数
              for (let call of callbacks.get(obj).get(prop)) {
                call && call();
              }
            }
          }
  
          return obj[prop];
        }
      });
      
      reactivties.set(object, proxy);
  
      return proxy;
    }
  
    function effect(callback) {
      // 将回调函数保存
      // callbacks.push(callback);
      usedReactiveties = [];
      callback();
  
      for(let reactive of usedReactiveties) {
        if (!callbacks.has(reactive[0])) {
          callbacks.set(reactive[0], new Map());
        }
        if (!callbacks.get(reactive[0]).has(reactive[1])) {
          callbacks.get(reactive[0]).set(reactive[1], []);
        }
        callbacks.get(reactive[0]).get(reactive[1]).push(callback);
      }
    }
  
  </script>
```

# 4. 使用Range实现DOM精确操作

## 基本拖拽

这是一个使用Range和CSSOM做的一个综合练习。

div拖拽实现：

- 监听`mousedown`事件，
- 在监听事件`mousedown`中绑定`document`的`mousemove`和`mouseup`事件，
- `mouseup`中移除监听函数，
- `mousemove`中处理div移动逻辑
- 确保第二次位置正确，我们需要记录初始位置 `baseX baseY`
- 在`up`中保存上一次的位置信息`baseX baseY`
- 在drag`mousedown`事件中记录 按下位置，并在移动中`move`计算出位置偏移加上初始位置得出最终移动位置

```jsx
<div id="drag" style="vertical-align: middle;width: 50px;height: 50px;display: inline-block;background: pink;"></div>
<script>
let baseX = 0, baseY = 0;

drag.addEventListener('mousedown', event => {
  let startX = event.clientX, startY = event.clientY;

  // 移动div
  const move = event => {
    drag.style.transform = `translateX(${baseX + event.clientX - startX}px) translateY(${baseY + event.clientY - startY}px)`;
  }

  // 移除监听
  const up = event => {
    baseX = baseX + event.clientX - startX;
    baseY = baseY + event.clientY - startY;
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
  }

  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);

});
</script>
```

## 正常流里的拖拽

实现将`div`插入到任意的文本位置中

- 定义存放range数据数组`ranges`
- 将所有文本内容添加到`ranges`数组中
- 在`move`函数中获取到距离div中近的`range`，并将`range`插入到该位置中