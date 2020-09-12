# 1. HTML 的定义：XML 与 SGML

目前我们先了解一下 HTML 和比较古典的定义方式上的方式

## DTD 与 XML namespace

[http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd](http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)

[http://www.w3.org/1999/xhtml](http://www.w3.org/1999/xhtml)

### DTD

**DTD（文档类型定义）的作用是定义 XML 文档的合法构建模块。**

**它使用一系列的合法元素来定义文档结构。**

在 dtd 里面，我们重点看下 Character mnemonic entities，它主要分为三块

- xhtml-lat1.en
  - 我们讲一下 nbsp(no-break space = no-breaking space, U+00A0)，当我们使用 nbsp 去连接两个词的时候，nbsp 会把它认为是一个词，这样在我们排版的时候就会出现分词的问题。如果我们想页面出现多个空格，还是得优先使用 css 里面的 white-space 属性去控制空格被显示出来。
- xhtml-symbol.ent
  - 没有啥重点，都是一些符号
- xhtml-special.ent
  - special 里面有几个需要记住。分别是 quot（双引号）, amp（&）, lt（小于号 less than）, gt（大于号 great than）。
    因为这些符号直接写在 html 里面是会直接报错的（quot 是写在属性里会报错，amp 直接写在 html 里面会认为是转义的标志，而 lt 和 gt 直接写在 html 里则会被认为是标签开始和结束的符号）

其余的都由于 html5 已经不再支持这种风格的 DTD，都是比较落后。

### XML namespace

在 XML 中，元素名称是由开发者定义的，当两个不同的文档使用相同的元素名时，就会发生命名冲突。

在 html 里面除了`xhtml`的 namespace 还有`MathML`，`SVG`。

# 2. HTML 标签语义

一个 html 文件里面，main 标签只能有一个

<aside> 元素表示一个和其余页面内容几乎无关的部分，被认为是独立于该内容的一部分并且可以被单独的拆分出来而不会使整体受影响。其通常表现为侧边栏或者标注框（call-out boxes）。

我们这里对 www 的 wiki 进行 html 文本设计来更好地理解 html 标签

# 3. HTML 语法

## 合法元素

- Element: <tagname>...</tagname>
- Text: text
- Comment: <!— comments —>
- DocumentType: <!Doctype html>
- ProcessingInstruction: <?a 1?>（理论上是一种预处理的语法，一般是把问号后面的内容交给一些预处理程序去使用，a 1 就是代表把 1 传给 a processor 进行处理）
- CDATA: <![CDATA[ ]]>（一种特殊的语法，它产生的也是文本节点，这里支持的文本不需要考虑转义问题，也是 XML 一路继承过来的信息）

## 字符引用

- &#161;（代表支持数字型的引用&#）
- &amp;（后三者要记住）
- &lt;
- &quot;

# 1. DOM API

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6a80de92-7325-480c-b2c5-2de847199a30/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6a80de92-7325-480c-b2c5-2de847199a30/Untitled.png)

需要注意几个点：

- `Element`并不是只有`HTMLELement`，这个往往是人们会忽略的东西。HTML 里面有三个比较常用的 namespace，分别是`HTML`，`SVG`和`MathML`。这些常用的 namespace 都会产生`Element`的子类。`HTMLElement`的子类的命名通常都是一个标签名。
- CharacterData 里面比较重要的就是 Text

## 导航类操作

介绍完 DOM 的结点家族，我们看下这上面有哪些操作。

这里面最重要的一类就是导航类操作。导航类操作又分为节点的导航和元素的导航。

DOM 树上一类通用的导航操作：

- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling (下一个邻居)
- previousSibling

我们在写 HTML 的时候因为会有回车或者空格，tab。这些会产生很多空白的文本节点。但 DOM 树上严格来说所有的节点都是 node，所以像`nextSibling`，`previousSibling`这样的多半都是空白的文本节点。所以就有了 Element 导航系列：

- parentElement（一定和`parentNode`相等，因为一个非`ElementNode`是不可能有子节点的）
- children
- firstElementChild
- lastElementChild
- nextElementSibling
- previousElementSibling

这些导航类操作能允许我们在 DOM 树上自由移动，这样我们就可以根据节点之间的父子关系和邻接关系来更快的找到一些关键节点。

## 修改操作

当我们通过导航操作找到了节点以后也可以进行一系列的操作。

- appendChild
- insertBefore
- removeChild (这个操作必须在该元素的 parent 上进行)
- replaceChild (=remove + insert)

其中`appendChild`和`insertBefore`为一组，原因的根本是最小化原则，假如有 10 个子节点，`insertBefore`可以插入 10 个位置，那`apppendChild`就可以插第 11 个位置。

因此这两个 API 就足够我们把节点插到任何位置了。

## 高级操作

- compareDocumentPosition 是一个用于比较两个节点中关系的函数
- contains 检查一个节点是否包含另一个节点的函数
- isEqualNode 检查两个节点是否完全相同。(查看 DOM 树的结构)
- isSameNode 检查两个节点是否是同一个节点，实际上在 JS 中可以用"==="
- cloneNode 复制一个节点，如果传入参数 true，则会连同子元素做深拷贝。(适合做 HTML 模板)

# 2. 事件 API

事件 API 的 API 非常简单，但我们要理解事件需要理解**事件的对象模型**。

我们先看一下[addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)，在所有的节点上都可以使用

```jsx
target.addEventListener(type, listener, options);
```

第一个参数对应的是事件的类型，例如 keyboard, keydown, keyup, mousedown, mouseup

第三个参数有两种形态，一种是`true`或者`false`，这种会改变事件的模式 (捕获 or 冒泡)。另一种是`options`，允许你传递更多信息，它包含了`capture` (控制是冒泡还是捕获), `once` (事件是否只相应一次), `passive` (事件是否是一个不会产生副作用的一个事件)。

## Event：冒泡和捕获

> 所谓事件的冒泡和捕获跟监听是没有关系的，不管你是否监听事件，在任何一次事件触发的过程中这两个过程都会发生。

一般来说，我们都是先捕获再冒泡，因为鼠标并不能够提供我们到底点到哪个元素上，这些是需要我们通过浏览器把它计算出来的。

因此我们需要先**从外到内**一层一层去计算到底这个事件发生在哪个元素上，也就是**捕获**过程。

接下来我们已经算出鼠标点到了哪个元素，就要开始**层层向外触发**，让这个元素去响应这个事件，也就是**冒泡**过程。

在`addEventListener`中，如果我们不传入第三个参数的话，那我们得到的应该是一个**冒泡**的事件监听。

我们来举一个例子，代码和界面如下：

```html
<div id="a" style="width: 100%; height: 300px; background: lightblue">
  <div id="b" style="width: 100%; height: 200px; background: pink"></div>
</div>
<script>
  var a = document.getElementById("a");
  var b = document.getElementById("b");
</script>
```

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3b859ec1-6f7d-41c1-a8a0-1dc10a81b2cc/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3b859ec1-6f7d-41c1-a8a0-1dc10a81b2cc/Untitled.png)

我们可以看到，蓝色元素里面套了个粉红色元素。因此外层是蓝色，里层是粉红色。接下来我们做在 chrome 里的 console 里面做下面几个操作并且点击最里层的元素。

```jsx
// part 1
a.addEventListener("click", function () {
  console.log("blue");
});
b.addEventListener("click", function () {
  console.log("pink");
});
// result: pink blue

// part 2
a.addEventListener(
  "click",
  function () {
    console.log("blue1");
  },
  true
);
b.addEventListener(
  "click",
  function () {
    console.log("pink1");
  },
  true
);
// result: blue1 pink pink1 blue

//part 3
a.addEventListener("click", function () {
  console.log("blue2");
});
// result: blue1 pink pink1 blue blue2
```

下面分别解释下各个结果：

1. 由于 addEventListener 默认是冒泡，因此我们在从外到内捕获完后会从内到外开始冒泡。由于外层是蓝色，里层是粉红色，所以答案为 pink blue
2. 添加了捕获之后，我们按照顺序会先输出最外面的 blue1 然后我们到了最里面一层，因此开始按照监听的顺序开始排序，我们一次输出 pink 和 pink1，然后到最外面的 blue
3. 如果同时添加了多个相同类型的监听，那就按代码的顺序输出。

# 3. Range API

上面我们已经说过 DOM API 里面的节点操作和事件类的 API，其中还有两个部分是 iterator 迭代器(没什么实际用途，并且这个 API 设计的风格过于老旧)，Range API。

通过上面的知识点，我们可以知道我们可以对 DOM 树上任意一个节点进行处理（无论是增删改查还是遍历访问），但是很多使用我们需要操作半个节点，或者是操纵批量节点。

Range API 是比节点类的 node API 更能操作 DOM 树的一个万能 API

我们首先了解一下如何创建一个 range，range 是 HTML 文档流里面的有起始点和终止点的一个范围。

range 可以是多个范围，但它一定是一个连续的范围。

**range 的创建方法**如下：

- var range = new Range()
- range.setStart(element, 9)
- range.setEnd(element, 4)
- var range = document.getSelection().getRangeAt(0);

我们再看一下其他**便捷的创建方式**：
这里的很多方式都是为了减少空白符所造成的影响（因为不好数个数）

- range.setStartBefore
- range.setEndBefore
- range.setStartAfter
- range.setEndAfter
- range.selectNode
- range.selectNodeContents

接下来我们创建完之后的操作方式（这里主要介绍两个）

- var fragment = range.extractContents() （取出 range 里的内容，相当于删）
- range.insertNode(document.createTextNode("aaaa")（插入一个新的节点）

我们需要注意第一个`extractContents`里面出来的是一个`fragment`对象，fragment 也是一个 node 的一个子类，它可以去容纳一些元素，并且它在 append 的时候，它自己不会被 append 到 DOM 树上，但是它会把它所有的子节点放上去。

我们可以做一个练习：

```jsx
<div id="a">
  123<span style="background-color: pink">456789</span>0123456789
</div>
<script>
  let range = new Range();
  //选中半个节点，后面会自动补上一个结束标签
  range.setStart(document.getElementById("a").childNodes[1].childNodes[0], 3); //childNodes[1]有一个文本节点，如果我们想在这个文本节点里面去选就得加childNodes[0]
  range.setEnd(document.getElementById("a").childNodes[2], 3); //0123456789的0123
</script>
```

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8160eced-94af-45ec-a344-7f5e208bc09d/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8160eced-94af-45ec-a344-7f5e208bc09d/Untitled.png)

然后我们再来看一个问题：

```jsx
// 把一个元素的所有子元素逆序
1  5
2  4
3  3
4  2
5  1
```

1. 如果我们用 node 节点操作的话，那么我们需要进行 4 次插入操作。
   但这里有两个考点
   (1) DOM 的 collection 是一个 living collection. 你操作取出来的 childNodes 的值是会跟着变化的
   (2) 元素的这些子元素在 insert 的时候是不需要先把它从原来的位置挪掉的，因为我们根据 DOM 树的性质，当你 insert 的时候它会先 remove 下来再 append 到新的树上
2. 使用 range（range 只需要两次 DOM 重排，但是用 node 节点操作的话单单插入就需要对 DOM 进行 4 次操作（对 DOM 的结点操作都会影响 DOM 进行重拍））

```jsx
//构造
<div id="a">
  <span>1</span>
  <p>2</p>
  <a>3</a>
  <div>4</div>
</div>
//method 1: node操作
//(1)
<script>
  let element = document.getElementById("a");
  function reverseChildren(element) {
    //把children nodes变成普通数组（这样就不会有原有的remove insert这些操作）
    let children = Array.prototype.slice.call(element.childNodes);

    for (let child of children) {
      element.removeChild(child);
    }
    //element.innerHTML="";
    children.reverse();

    for (let child of children) {
      element.appendChild(child);
    }
  }
  reverseChildren(element);
</script>

//(2)
<script>
  let element = document.getElementById("a");
  function reverseChildren(element) {
    //直接在living collection上操作
    var l = element.childNodes.length;
    while (l-- > 0) {
      //appendChild一个节点附加到指定父节点的子节点列表的末尾处,如果某个节点已经拥有父节点，在被传递给此方法后，它首先会被移除，再被插入到新的位置。
      element.appendChild(element.childNodes[i]);
    }
  }
  reverseChildren(element);
</script>

//method 2: range操作
<script>
  //进行两次DOM操作
  let element = document.getElementById("a");
  function reverseChildren(element) {
    let range = new Range();
    //第一次DOM操作: 把所有节点拿下来
    range.selectNodeContents(element);

    let fragment = range.extractContents();
    var l = fragment.childNodes.length;
    while (l-- > 0) {
      //appendChild一个节点附加到指定父节点的子节点列表的末尾处,如果某个节点已经拥有父节点，在被传递给此方法后，它首先会被移除，再被插入到新的位置。
      fragment.appendChild(fragment.childNodes[i]);
    }
    element.appendChild(fragment);
  }
  reverseChildren(element);
</script>
```

# 4. CSSOM

这节为止我们对 DOM API 的认识就结束了。而浏览器 API 除了 DOM API 还有其他的 API，因为 DOM API 约等于是 HTML 语言的一个对象化。但是现在所学的语言里还有 CSS，对 CSS 文档的抽象就是 CSSOM。

## CSSOM 的起点 document.styleSheets

css 的一切 API 都需要通过`document.styleSheets`这个属性去访问

在代码里使用 css 有两种用法：

- 使用 style 标签（在标签里面直接去写 css）
- 使用 link 标签（在 href 的 url 里面调用文件）

我们看下下面这段代码：

```html
<style title="Hello">
  a::before {
    color: red;
    content: "Hello";
  }
</style>
<!-- 由于不想创建文件所以用了data url，作用和style标签一样 但是需要注意转义 -->
<link rel="stylesheet" title="x" href="data:text/css,p%7Bcolor:bule%7D" />
<a> world</a>
```

在界面中的呈现如下：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0ecaf118-3f2e-410d-9fcc-ad0895595bf3/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0ecaf118-3f2e-410d-9fcc-ad0895595bf3/Untitled.png)

我们看通过 link 创建的 css，我们访问它并不是用 href，而是 rules。因此我们需要了解一下 rules

## Rules

- document.stylesheet[0].cssRules
- document.stylesheet[0].insertRule("p { color:pink;}", 0)
- document.stylesheet[0].removeRule(0);

`stylesheets`是可以访问一个`cssRule`当做一个类似数组的一个 collection。在这样的一个样式表里对应着一个 style 标签或者是一个 link 标签。每个样式表都有 rules，虽然我们无法直接写进 rule，但我们可以通过`insertRule`和`removeRule`去控制样式表里面的规则。

`insertRule`的写法是传入一段 css 代码，后面是一个位置。并且`insertRule`插入的并不是个 rule 对象而是一个字符串。

关于 rules，它分成 at-rule 和普通 rule。普通 rule 就是`CSSStyleRule`，at-rule 有比较多的名字。因此 CSSOM 对应的就是 CSS 语法。但这里`CSSStyleRule`是一个重点。其他的都是辅助`CSSStyleRule` 的。

- CSSStyleRule
- CSSCharsetRule
- CSSImportRule
- CSSMediaRule
- CSSFontFaceRule
- CSSPageRule
- CSSNamespaceRule
- CSSKeyframesRule
- CSSKeyframeRule
- CSSSupportsRule
- ...

CSSStyleRule

- selectorText String
- style K-V 结构

通过 CSSOM 修改规则比直接修改规则更好，一是可以批量的修改（例如有个 list，我们想统一更换颜色，那就统一加上 class），另外一个是有些伪元素是没有办法直接通过 DOM API 访问的。

比如下面这个代码：

```html
<style title="Hello">
  a::before {
    color: red;
    content: "Hello";
  }
</style>
<!-- 由于不想创建文件所以用了data url，作用和style标签一样 但是需要注意转义 -->
<link rel="stylesheet" title="x" href="data:text/css,p%7Bcolor:bule%7D" />
<a> world</a>
```

我们无法直接访问 Hello 这个伪元素，因此如果我们想更改 Hello 的颜色，就要使用 CSSOM 来进行。

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ef82177e-96c1-4cef-b940-653a71c14538/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ef82177e-96c1-4cef-b940-653a71c14538/Untitled.png)

## CSSOM 的另一个重要的内容 getComputedStyle

- window.getComputedStyle(elt, pseudoElt):
  - elt: 想要取得的元素
  - pseudoElt: 可选 伪元素

我们在上面一个例子可以通过 getComputedStyle 访问到 Hello 的颜色

```jsx
getComputedStyle(document.querySelector("a"), "::before").color;
//"rgb(173, 216, 230)"
```

因此 getComputedStyle 是个非常强大的功能，我们可以通过它去获取元素，比如 transform，元素的拖拽，CSS 动画类似暂停的中间态，这时候我们没办法通过 DOM API 来判断它播到哪了，因为它是一个中间值。

# 5. CSSOM View

我们通过前面的学习知道了 CSSOM 是和 CSS 语言挂钩的，但我们可以知道其实在完成了 layout 之后渲染的图形它也会包含一部分属性。我们可以通过 CSSOM View API 来获取 layout 甚至 render 之后的信息。

CSSOM View 和 CSS 没什么关系，主要和浏览器显示的视图有关。

## window

在浏览器上最顶层的一个东西就是浏览器窗口

- window.innerHeight, window.innerWidth (很重要，代表 HTML 实际上渲染所用的区域)
- window.outerWidth, window.outerHeight (浏览器窗口，包括浏览器的工具栏，例如 inspect)
- window.devicePixelRatio (特别重要，屏幕上的物理像素和代码中的逻辑像素 px 之间的比值，我们在代码里写 1px，但实际上这个像素不一定和机器的物理像素重合)
- window.screen
  - window.screen.width (实际屏幕上的宽)
  - window.screen.height
  - window.screen.availWidth (可以使用的宽，比如手机上会把屏幕上的一部分做成按钮，那么浏览器的大小和可以使用的大小就不一样)
  - window.screen.availHeight

接下来是在创建新窗口时可以使用的 API

- window.open("about:blank", "\_blank", "width=100,height=100,left=100")（标准的 window.open 只有前两个参数，但 CSSOM 的 window API 就有三个参数，我们可以指定打开的窗口的宽高和在屏幕的位置）
- moveTo(x, y) （如果 window 是你自己创建出来的话，可以使用下面 4 个 API 来改变 window 的位置和尺寸）
- moveBy(x, y)
- resizeTo(x, y)
- resizeBy(x, y)

试验代码如下：

```jsx
<button
  id="open"
  onclick="window.w =window.open('about:blank', '_blank',
'width=100,height=100,left=100')"
>
  open window
</button>
<button onclick="w.resizeBy(30,30)">resize</button>
<button onclick="w.moveBy(30,30)">move</button>
```

## Scroll

scroll 分为 scroll 元素和 window 的 scroll

- scrollTop（当前滚动到的位置）
- scrollLeft（当前滚动到的位置）
- scrollWidth（可滚动的最大宽度）
- scrollHeight（可滚动的最大高度）
- scroll(x, y)（滚动到特定位置）
- scrollBy(x, y)（在当前基础上滚动一个差值）
- scrollIntoView() （强制滚动到屏幕的可见区域）
- window
  - scrollX（=scrollTop）
  - scrollY（=scrollLeft）
  - scroll(x, y)
  - scrollBy(x, y)

## 今天的重头戏：layout

- getClientRects()
- getBoundingClientRect()

对于每个 element 可以调用`getClientRects`来获取它生成的所有的盒。`getBoundingClientRect`可以让我们把所有元素生成的盒的包含的区域给取出来（只能取到一个）

我们看下实践的代码和视图：

```jsx
<style>
  .x::before {
    content: "额外 额外 额外 额外 额外 ";
    background-color: pink;
  }
</style>
<div style="width: 100px; height: 400px; overflow: scroll">
  文字<span class="x" style="background-color: lightblue"
    >文字 文字 文字 文字 文字 文字</span
  >
</div>
<script>
  var x = document.getElementsByClassName("x")[0];
</script>
```

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c51898e4-cdf4-4353-a7f9-43549c6b8bee/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c51898e4-cdf4-4353-a7f9-43549c6b8bee/Untitled.png)

我们可以通过视图看到一共生成了 6 个盒（六行，伪元素也是参与生成盒的），我们通过`getClientRects` 可以获得所有的六个盒。而`getBoundingClientRect` 就可以获得圈住所有盒的一个区域。

所以我们可以知道这两个 API 是我们获取浏览器 layout 之后的结果，它能够真实取到所有元素的位置。非常适合类似计算一个元素和他的父元素的差值或者相对位置（用`getBoundingClientRect` 就可以获取边框大小）。

# 6. 其它 API

我们前面已经把 DOM API 和 CSSOM API 两个浏览器最重要的 API，这边我们再介绍剩下的 API。

首先我们要先了解所有 API 的来源

## 标准化组织

- khronos
  - WebGL
- ECMA
  - ECMAScript
- WHATWG
  - HTML
- W3C
  - webaudio
  - CG/WG
