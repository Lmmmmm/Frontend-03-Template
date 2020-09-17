[vertical-align](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)

# JavaScript 的异步机制

- callback
- [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [async/await](https://developer.mozilla.org/zh-CN/docs/learn/JavaScript/%E5%BC%82%E6%AD%A5/Async_await)

我们通过一个红绿灯问题来进一步的了解异步

问题：一个路口的红绿灯，会按照绿灯亮 10 秒，黄灯亮 2 秒，红灯亮 5 秒的顺序无限循环，请编写 JS 代码来控制这个红绿灯。

代码如下：

```html
<style>
  div {
    background-color: grey;
    display: inline-block;
    margin: 30px;
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }
  .green.light {
    background-color: green;
  }
  .yellow.light {
    background-color: yellow;
  }
  .red.light {
    background-color: red;
  }
</style>

<div class="green"></div>
<div class="yellow"></div>
<div class="red"></div>

<button id="next">next</button>
<script>
  function green() {
    var lights = document.getElementsByTagName("div");
    for (var i = 0; i < 3; i++) lights[i].classList.remove("light");
    document.getElementsByClassName("green")[0].classList.add("light");
  }
  function red() {
    var lights = document.getElementsByTagName("div");
    for (var i = 0; i < 3; i++) lights[i].classList.remove("light");
    document.getElementsByClassName("red")[0].classList.add("light");
  }
  function yellow() {
    var lights = document.getElementsByTagName("div");
    for (var i = 0; i < 3; i++) lights[i].classList.remove("light");
    document.getElementsByClassName("yellow")[0].classList.add("light");
  }
  /* method 1: callback
  function go() {
    green();
    setTimeout(function () {
      yellow();
      setTimeout(function () {
        red();
        setTimeout(function () {
          go();
        }, 5000);
      }, 2000);
    }, 10000);
  }
  */

  function sleep(t) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, t);
    });
  }
  /* method 2: promise
  //promise可以在里面return promise，这样就可以在后面继续加then，用链式表达式代替了前面的回调式
  function go() {
    green();
    sleep(1000)
      .then(() => {
        yellow();
        return sleep(200);
      })
      .then(() => {
        red();
        return sleep(500);
      })
      .then(go);
  }
  */

  // method 3: async await
  //异步的好处就是可以应付各种情况，比如我想把
  function happen(element, eventName) {
    return new Promise((resolve, reject) => {
      element.addEventListener(eventName, resolve, { once: true });
    });
  }

  async function go() {
    while (true) {
      green();
      await sleep(1000); //auto
      //await happen(document.getElementById("next")，"click"); //Manual
      yellow();
      await sleep(200);
      //await happen(document.getElementById("next")，"click");
      red();
      await sleep(500);
      //await happen(document.getElementById("next")，"click");
    }
  }
</script>
```

# generator 与异步

- generator 模拟 async/await
- async generator

## generator 模拟 async/await

async/await 是 generator 的语法糖，没有 async 的时候我们都是用 generator 来进行异步处理

yield 关键字用来暂停和恢复一个生成器函数。早年就是用 yield 来代替 async/await。

```jsx
function* go() {
  while (true) {
    green();
    yield sleep(1000);
    yellow();
    yield sleep(1000);
    red();
    yield sleep(1000);
  }
}
//需要一个逻辑去跑generator函数
function run(iterator) {
  let { value, done } = iterator.next(); //每次跑一个
  if (done) return; //运行到最后return
  if (value instanceof Promise)
    value.then(() => {
      run(iterator);
    });
}

function co(generator) {
  return function () {
    return run(genrator());
  };
}
go = co(go);
```

## async generator

我们做一个每秒输出`i+1`的 demo：

```jsx
function sleep(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t);
  });
}

async function* counter() {
  let i = 0;
  while (true) {
    await sleep(1000);
    yield i++;
  }
}

(async function () {
  for await (let v of counter()) {
    console.log(v);
  }
})();
```

几个要点：

- `function*` 这种声明方式(function 关键字后跟一个星号）会定义一个生成器函数 (generator function)，它返回一个 `Generator` 对象。
- `counter`函数里面没有`break`，这种情况一般会在表盘，操作系统里面会出现。
- `(async function(){ xxx})()`这样写可以不用命名函数并且立即运行
