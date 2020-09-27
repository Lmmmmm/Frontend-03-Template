# 广度优先搜索

JavaScript 的数组就是一个天然的队列，也是一个天然的栈。JS 的数组是有`shift`, `unshift`和`push`, `pop`两组方法的。

关于这几个操作的用法：

- shift 是删除第一个元素
- unshift 是向数组的开头添加一个或更多元素，并返回新的长度
- push 是将一个或多个元素添加到数组的末尾，并返回该数组的新长度
- pop()方法从数组中删除最后一个元素，并返回该元素的值。

因此我们可以分为下面几个使用方法来把数组变成队列或者栈

- 如果我们同时使用 push 和 shift，那就变成队列（FIFO）
- 如果我们同时使用 pop 和 unshift，那就变成队列
- 如果我们同时使用 pop 和 push，那就变成栈（LIFO）
- 虽然说 shift 和 unshift 同时使用也会变成栈，但是由于性能方面的考虑一般不使用

# 通过异步编程可视化寻路算法

我们上面编写好了寻路算法 但是还有两个问题没有解决：

- 算法本身过程没办法特别清晰地去理解（本堂课解决）
- 没有找到路径，只知道是否能够到达目的地（下堂课解决）

因此，为了确保我们找到的路径是正确的，我们做以下几个步骤：

1. 让调试方便，我们引入可视化，走过的路径变为绿色，并且添加 async 和 await 来观察。
2. 加入 sleep 函数，这样在页面上变为绿色时，有个延迟过程，方便观察。

这里稍微解释一下为什么需要用异步

- 使用异步 async，awiat 之后会等待异步方法执行完成，更好看出来搜索的优先顺序。
- 添加 sleep 方便观察。

# 处理路径问题

1. 为了找到路径，需要存储上一个节点的值。
2. 到达终点后，比终点开始沿着上一个节点，反复下去到起点，也就是路径。

# 启发式搜索（一）

之前的搜索方案并不是最好方案。

启发式寻路：用一个函数去判断这些点扩展的优先级，沿着优先级的方向走。

这样的结果，在计算机领域中叫 A*，A* 是 A 的一种特例。

我们来看个例子：

```jsx
class Sorted {
  constructor(data, compare) {
    this.data = data.slice();
    this.compare = compare || ((a, b) => a - b);
  }
  //take的时候拿出一个最小的
  take() {
    if (!this.data.length) return; //return null的话以后null也会参与compare
    let min = this.data[0];
    let minIndex = 0;

    for (let i = 1; i < this.data.length; i++) {
      if (this.compare(this.data[i], min) < 0) {
        min = this.data[i];
        minIndex = i;
      }
    }
    //如果使用splice去删除数组中的元素的话会导致该位置后面的元素都要往前移一位，复杂度是O(n)
    //因此这里是把最后一位和当前位的元素互换位置然后使用一次pop，这样就是O(1)的复杂度。这样做的理由是该数组本身就是无序的
    this.data[minIndex] = this.data[this.data.length - 1];
    this.data.pop();
    return min;
  }
  give(v) {
    this.data.push(v);
  }
}
```

这段代码运行结果如下：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e4843e03-930b-4c8f-a65b-5da406bc2daf/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e4843e03-930b-4c8f-a65b-5da406bc2daf/Untitled.png)

就这样我们可以使用构造函数来创建 compare 来进行比较，这一步非常的关键。
