# 1. CSS语法的研究

CSS的标准相对于HTML、JavaScript而言比较散，并不是集中在一份官方文档中，这就需要一点线索去寻找（整理前端知识体系脑图的时候就觉得CSS的文档不是很好找）。

以语法为线索，可以查到CSS2.1的一些文档，[CSS2.1](https://www.w3.org/TR/CSS21/grammar.html#q25.0)，[css-syntax-3](https://www.w3.org/TR/css-syntax-3)。当然，CSS2.1的语法稍微旧了点。

[Grammar of CSS 2.1](https://www.w3.org/TR/CSS21/grammar.html%23q25.0)

关于一些产生式

- * : 0 or more
- +: 1 or more
- ?: 0 or 1
- |: separates alternatives(or)
- []: grouping

```css
stylesheet
  : [ CHARSET_SYM STRING ';' ]?
    [S|CDO|CDC]* [ import [ CDO S* | CDC S* ]* ]*
    [ [ ruleset | media | page ] [ CDO S* | CDC S* ]* ]*
  ;
```

## 总体结构

- @charset
- @import
- rules(可重复)
    - @media
    - @page
    - rule

最开始允许的是`charset`，也就是@charset的结构，`charset`要不然没有，要不然就一个。

然后是`import`，`import`可以是多个的，但它必须是在`charset`之后的其他规则的最前面。

接下来是支持一个长列表，列表里面三种结构`ruleset`, `media`和`page`。其他的都是空白符。

`CDO`和`CDC`代表的是HTML注释的起点和重点。这是因为早年的css为了让html里面不要把css文本显示出来，所以允许你在这个地方用HTML注释把css的内容给他变成HTML注释，这样旧的浏览器就会把css文本理解成HTML注释。（新的浏览器则是直接把css文本理解为css规则）

关于列表里的三种结构`ruleset`, `media`和`page`。

`ruleset`就是普通的css规则（一个选择器后面跟一堆东西）

`page`用来打印一些东西

# 2. CSS @规则的研究

- @charset : [https://www.w3.org/TR/css-syntax-3/](https://www.w3.org/TR/css-syntax-3/) 
用于声明css的字符集
- @import :[https://www.w3.org/TR/css-cascade-4/](https://www.w3.org/TR/css-cascade-4/)
- * @media :[https://www.w3.org/TR/css3-conditional/](https://www.w3.org/TR/css3-conditional/)
不在media query而是conditional标准里，这个标准引用了media query，规定了media后面的一些查询规则
- @page : [https://www.w3.org/TR/css-page-3/](https://www.w3.org/TR/css-page-3/)
分页媒体，也就是打印机
- @counter-style :[https://www.w3.org/TR/css-counter-styles-3](https://www.w3.org/TR/css-counter-styles-3)
平时写列表时会有counter，也就是列表前面的小黑点或者小叔子
- * @keyframes :[https://www.w3.org/TR/css-animations-1/](https://www.w3.org/TR/css-animations-1/)
定义动画用的
- * @fontface :[https://www.w3.org/TR/css-fonts-3/](https://www.w3.org/TR/css-fonts-3/)
包含web font功能，用于定义一切字体
- @supports :[https://www.w3.org/TR/css3-conditional/](https://www.w3.org/TR/css3-conditional/)用来检查某些css功能是否存在，很多时候会有兼容问题
- @namespace :[https://www.w3.org/TR/css-namespaces-3/](https://www.w3.org/TR/css-namespaces-3/)
不常用。在HTML里面除了HTML命名空间，还引入了SVG MathML这样其他的命名空间的标记的标签。这也是一个完备性的考量。

# 3. CSS规则的结构

我们会采用另一个分类的方式

- 选择器
    - [https://www.w3.org/TR/selectors-3/](https://www.w3.org/TR/selectors-3/)
    - [https://www.w3.org/TR/selectors-4/](https://www.w3.org/TR/selectors-4/)
- 声明
    - Key
        - Properties
        - Variables: [https://www.w3.org/TR/css-variables/](https://www.w3.org/TR/css-variables/)
    - Value
        - [https://www.w3.org/TR/css-values-4/](https://www.w3.org/TR/css-values-4/)

css规则是由parser分成`selector`和`declaration`部分。其中声明是以kv对的形式存在。

`selector`有两个标准，实现和状态比较好的是selector的level3。

`Key`的`Variables`标准里引入了新的`key`值，它是以双减号开头的。

`value`除了包含一些正常的值，还包含了一些函数类型的值。不同类型的属性要求不同类型的`value`。

## 选择器的level3的产生式

```css
selectors_group
  : selector [ COMMA S* selector ]*
  ;
selector
  : simple_selector_sequence [ combinator simple_selector_sequence ]*
  ;
combinator
  /* combinators can be surrounded by whitespace */
  : PLUS S* | GREATER S* | TILDE S* | S+
  ;
simple_selector_sequence
  : [ type_selector | universal ]
    [ HASH | class | attrib | pseudo | negation ]*
  | [ HASH | class | attrib | pseudo | negation ]+
  ;
```

上面的是css3选择器产生式的根元素。我们可以看到`selectors_group`是由逗号`COMMA`分隔的一个或者多个`selector`构成的。而`selector`又是由`simple_selector_sequence`组成的。而`simple_selector_sequence`是用`combinator`相连接。

`combinator`是由加法，大于号，波浪线还有空格组成。

`simple_selector_sequence` 是由类型选择器或者是星号(`universal`)，然后可以是带井号的`HASH`，带点号的`class`，带方括号的`attrib`，以单冒号或者双冒号开头的伪类和伪元素选择器`pseudo`，以:NOT开头的带not的选择器`negation` 这些种类选择器中的一个或者多个

## Key的level3声明

`key`的`Properties`我们会在后面跟选择器一起说，这里我们先讲`variable`。

```css
/* Example 1 */
:root {
  --main-color: #06c;
  --accent-color: #006;
}
/* The rest of the CSS file */
#foo h1 {
  color: var(--main-color);
}

/* Example 2*/
:root {
  --main-color: #c06;
  --accent-background: linear-gradient(to top, var(--main-color), white);
}

/* Example 3*/
.component .header {
  color: var(--header-color, blue);
}
.component .text {
  color: var(--text-color, black);
}
/* Example 4 */
.foo {
  --side: margin-top;
  var(--side): 20px;
}
```

声明一个双减号开头的变量，然后我们就可以在它的子元素里面使用这个变量。它是可以作用于任何一个地方，包括和函数进行嵌套。

我们也可以对变量设置默认值，当我们找不到变量时就会使用这个变量值，用法如Example3.

同样的，我们不仅仅可以对`value`进行变量储存，我们也可以对`key`使用变量，用法如Example4。

## Value的level4声明

虽然`level4`标准还是属于working draft状态，但是它的实现状态非常好。

它提供了一些基本函数，有最大最小和剪切裁切等函数，其中最重要的是指定了`calc`，`calc`函数是可以进行一些简单的计算。

同时还增加了一个`Attribute Reference`，它可以让css的值跟元素上的某个属性值相绑定

# 4. 收集标准

我们了解了整个css的构造，但是整个css其实是散落在各个标准中的，为了得到比较完整的列表，我们在[W3C](https://www.w3.org/TR/)里面进行爬虫搜索。

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aee60563-581e-48db-a93a-33990ed4b103/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aee60563-581e-48db-a93a-33990ed4b103/Untitled.png)

代码如下：

```jsx
Array.prototype.slice.call(document.querySelector("#container").children).filter(e => e.getAttribute("data-tag").match(/css/)).map(e => ({name:e.children[1].innerText, url:e.children[1].children[0].href}))
```

把这些值保存在standards里，利用创建iframe的方式不停去读取一些信息。

过程：

1. 首先我们把父元素，就是container的children，也就是所有的list转成一个数组
2. 把所有带css tag的元素过滤出来（这里不能用相等，因为css可能是有多个标签的）
3. 做一个映射，根据DOM的结构把它的标题文本和URL取出来

# 5. 总结

- CSS语法
- at-rule
- selector
- variables
- value
- 实验

CSS的标准相对于HTML、JavaScript而言比较散，并不是集中在一份官方文档中，这就需要一点线索去寻找（整理前端知识体系脑图的时候就觉得CSS的文档不是很好找）。

以语法为线索，可以查到CSS2.1的一些文档，[CSS2.1](https://www.w3.org/TR/CSS21/grammar.html#q25.0)，[css-syntax-3](https://www.w3.org/TR/css-syntax-3)。当然，CSS2.1的语法稍微旧了点。

# 1. 选择器语法

- 简单选择器
    - * (通用选择器)
    - div svg|a (type selector，也就是它选择的是我们元素的tagName属性。)
    通常都是我们直接去写tagName，但是因为HTML其实是有命名空间的，这主要有三个，分别是HTML，SVG，MathML。如果我们要选SVG或者MathML里面特定的元素的话就必须要用到单竖线，单竖线是命名空间分隔符。（HTML一般是用冒号作为分隔符）
    - .cls（可以用空格作为分隔符）
    - #id
    - [attr=value]（囊括了class属性选择器和id选择器）
    =前面可以加波浪线表示像class一样，可以支持拿空格分隔的值的序列。如果在前面加单竖线就表示这个属性以这个值开头。
    - :hover（伪类）
    它主要是一些元素的特殊状态，多半来自于交互。或者是带函数的伪类选择器
    - ::before（伪元素选择器）
    用单冒号也算对，它是选中一些原本不存在的元素。
- 复合选择器(compound selector)
    - <简单选择器><简单选择器><简单选择器>
    - *或者div必须写在最前面
- 复杂选择器
    - <复合选择器><sp><复合选择器>（表示的是子孙选择器，当前元素必须有空格左边的父级or更高级的节点）
    - <复合选择器>">"<复合选择器>（表示的是父子选择器，必须是它的直接上级父元素）
    - <复合选择器>"~"<复合选择器>（表示的是邻接关系）
    - <复合选择器>"+"<复合选择器>（表示的是邻接关系）
    - <复合选择器>"||"<复合选择器>（selector level4才有，做表格的时候这个可以表示选中某一个列）

    其实复杂选择器还可以用逗号连接来构成一个选择器列表，但因为逗号相当于是两个选择器，并且逗号之间是或的关系，所以不算它为复杂选择器

# 2. 选择器的优先级

[CSS计算](https://www.notion.so/CSS-c0760363f10a4cc2919e095f759b1600)

具体计算方式是用一个四元组，内联样式、id选择器、类选择器（**包括普通的.class、属性选择器和伪类选择器**）、类型选择器（**包括tagName和伪元素选择器**）优先级依次递减。

由于选择器列表是用逗号分割的，因此我们不把他视为一个完整的选择器

**通配选择符（*）关系选择符（combinators）（+, >, ~, ' ', ||）和 否定伪类（:not()）对优先级没有影响。（但是，在 :not() 内部声明的选择器会影响优先级）。**

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d869202b-f159-43fd-911d-ef6ff8b05f31/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d869202b-f159-43fd-911d-ef6ff8b05f31/Untitled.png)

如图所示，为了节约内存N可以取一个256的整次幂。
`#id div.a#id{ //....}` 优先级为[0,2,1,1]
在选择器的标准里，我们会用N进制来表示，因此`[0,2,1,1]`是一个巨大无比的进制里面的4位
`Specificity = 0 * N^3 + 2 * N^2 + 1 * N^1 * 1` 取N=1000000   S =2000001000001

这边我们做几个练习

- div#a.b .c[id=x]  [0,1,3,1]
- #a:not(#b) [0,2,0,0]
- *.a [0,0,1,0]
- div.a [0,0,1,1]

# 3. 伪类

- 链接/行为
    - :any-link（匹配所有超链接）
    - :link :visited
    - :hover（鼠标挪上去以后的状态）
    - :active（激活）
    - :focus（焦点在的状况）
    - :target（链接到当前的目标，是给作为锚点的a标签使用）
- 树结构
    - :empty
    - :nth-child() （表示这个元素是父元素的第几个child）
    - :nth-last-child()
    - :first-child :last-child :only-child
- 逻辑型
    - :not伪类
    - :where :has （还在开发中）

其他伪类选择器参考[伪类选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes)

**重点：不要写太复杂的选择器，对自己好，对浏览器工程师也好~**

# 4. 伪元素

- ::before
- ::after
- ::first-inline
- ::first-letter

`before`和`after`分别表示在元素的内容的前后插入一个伪元素，一旦有了before或者after的属性，declaration里面就可以写一个叫做`content`的属性，它可以像一个真正的DOM元素一样可以去生成盒，参与渲染排版。

因此我们可以理解为伪元素就是通过选择器向界面上添加了一个不存在的元素。

first-inline和first-letter的机制又稍微不太一样，这个两个东西原本就存在于content。分别代表选中第一行和第一个字母。所以这两个相当于是把文字之类的东西给括起来。

我们看几个例子

```jsx
<div>
<::before />
content content content content
content content content content
content content content content
content content content content
content content content content
content content content content
<::after />
</div>
```

带`before`这样的伪元素的选择器给它实际选中的元素前面增加了元素，我们只需要通过它的`content`属性为他添加文本内容即可。所以我们可以任意指定它的`display`，不管是显示成`inline`还是`inline-block`都没问题。

我们在实现一些组件的时候也会常常使用这种不污染DOM树但是能实际创造视觉效果的方式来给页面进行修饰性的这样的内容

```jsx
<div>
<::first-letter>c</::first-letter> content content content content
content content content content
content content content content
content content content content
content content content content
content content content content
</div>
```

first-letter可以实现像报纸那样第一个字特别大的样式，而且比JS实现更稳定。

first-line实际上是针对排版之后的line，这个源码里的first line不是同一个东西，这样就有可能开发的机子没问题，但到了用户的浏览器上实现的时候确实另一个样子。因此我们尽量保持first-line的语义正确，不要做多余的事情。

### first-letter和first-line的可用属性

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8495f91c-fb32-4ca8-ab40-edf5479989b6/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8495f91c-fb32-4ca8-ab40-edf5479989b6/Untitled.png)

### 思考：为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？

::first-line 描述的是第一格式化行， 且要求同继承元素处于同一个流中，float会使元素脱离文档流从而导致重新排版，因此不能设置float属性
