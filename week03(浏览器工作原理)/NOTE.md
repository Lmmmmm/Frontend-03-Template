# 学习笔记
前提：使用npm install cs

## 收集CSS规则

- 遇到style标签时，我们把css规则保存起来
- 这里我们调用css parser来分析css规则
- 必须要仔细研究此库css规则的格式（也就是代码中ast的结构）

CSS Computing就是指将CSS规则添加到DOM树中。 需要对CSS进行词法分析和语法分析，其中的编译原理知识略过，改用npm install css，其作用为将css转为AST（抽象语法树）。

 进一步降低处理的复杂程度，不考虑link标签，只考虑style标签；不考虑style标签里面的import写法（涉及到网络请求和异步处理），只考虑内联的css写法。

一条css rule主要由selectors，declarations组成。selectors是一个list：body div img, #myid会通过逗号分隔，变成两个selectors。

## 添加调用

- 创建一个元素以后，立刻计算css
- 一个重要的假设：在compute css的时候，css rules已经收集完毕。
- 在真实浏览器中，可能遇到写在body中的style标签，需要重新计算CSS，这里我们忽略这种情况。

CSS设计里面的潜规则：尽量保证大部分的选择器在进入startTag的时候就会被判断。 

## 获取父元素序列

为什么要获取父元素序列呢？选择器大多都和父元素相关？因为这里要实现[descendant combinator](https://www.w3.org/TR/selectors/#descendant-combinators)。

所以：

- 在computeCSS中，我们必须知道所有元素的父节点才能判断元素与规则是否匹配
- 我们从上一步骤的stack，可以获取本元素的所有祖先元素。
- 因为我们首先获取的是“当前元素”，所以我们进行匹配的顺序是从内到外。

例如：选择器div div #myid中的第一个div不知道匹配哪个元素，但是#myid一定要判断是否匹配当前元素。

## 选择器与元素的匹配

选择器其实是有一个层级结构的，最外层是选择器列表（css parser已经帮我们做了拆分），选择器列表里面的是复杂选择器，

复杂选择器是由空格分隔而成的多个复合选择器。复合原则选择器又是由紧连着的一堆简单选择器构成的。

复杂选择器是根据亲代关系来选择元素，复合选择器是针对一个元素本身的属性和特征的一个判断。

关于3种简单选择器和元素的匹配，分别是ID选择器(#)，class选择器(.)，tagName选择器(div)。 其中class选择器是元素中有单一class的情况，元素中有多个class的情况未去实现。

对于选择器与元素的匹配的代码的总结：

- 选择器也要从当前元素往外排列
- 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列
- 根据选择器的类型和元素属性，计算是否与当前元素匹配
- 这里仅仅实现了三个基本选择器，实际的浏览器中要处理复合选择器

### 作业（可选）：实现复合选择器，实现支持空格的 Class 选择器

```jsx
//思路：把空格用split处理并且进行逐一比较
function match(element, selector) {
  ...
  if (selector.charAt(0) === '#') {
   ...
  } else if (selector.charAt(0) === '.') {
    let attr = element.attributes.filter((attr) => attr.name === 'class')[0]
    if (attr) {
      let classes = attr.value.split(' ')
      for (let class of classes) {
        if (class === selector.replace('.', '')) {
          return true
        }
      }
      return false
    }
  } else {
    ...
  }
  return false
}
```

## 生成computed属性

这一步具体来说就是把declarations从css rules里拿出来并一条一条地作用在computed属性上即可

- 一旦选择器匹配上了，就应用选择器到元素上，形成computedStyle

## specificity的计算逻辑

specificity是专指程度（通常理解的优先级）。专指程度：ID selector> class selector> tagName selector。

specificity用一个四元组来表示，第一位是inline位置，第二位是id位置，第三位是class位置，最后一位是tagName位置。specificity采用从左比较到右的非进位制比较。

 例如，复杂选择器`div div #id`的specificity是`[0, 1, 0, 2]`；另有一个复杂选择器`div #my #id`的specificity是`[0, 2, 0, 1]`。 这两个复杂器我们从左往右比较会发现第二位上面是1，而下面是2。所以如果这两个选择器有相同属性的话，下面会覆盖掉上面的。也就是下面的优先级更高。

总结：

1. CSS规则根据specificity和后来优先规则覆盖
2. specificity是个四元组，越左边权重越高
3. 一个CSS规则的specificity根据包含的简单选择器相加而成

# 代码的一些修改

最后如果正常运行client的话会有bug，无法打印出dom树

```jsx
UnhandledPromiseRejectionWarning: TypeError: Converting circular structure to JSON
--> starting at object with constructor 'Object'
| property 'children' -> object with constructor 'Array'
| index 1 -> object with constructor 'Object'
--- property 'parent' closes the circle
```

因此需要把parser.js里面的emit的函数里的element.parent = top;给注释掉