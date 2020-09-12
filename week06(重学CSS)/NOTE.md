学习笔记# 1. 盒

我们先理解一下关于标签（Tag），元素（Element），盒（Box）的概念

首先，标签对应的是源代码，元素代表的是我们脑子里的概念，而盒是实际的表现

- HTML 代码中可以书写开始**标签**，结束**标签** ，和自封闭**标签** 。
- 一对起止**标签** ，表示一个**元素** 。
- DOM 树中存储的是**元素**和其它类型的节点（Node）。（比如文本节点，注释节点，CDATA 节点，processing-instruction，DTD 之类的）
- CSS 选择器选中的是**元素** 。（或者伪元素）
- CSS 选择器选中的**元素** ，在排版时可能产生多个**盒** 。
- 排版和渲染的基本单位是**盒**。

## 盒模型

盒模型是排版的时候所用的基本单位，是多层结构。`padding`（内边距）主要影响盒内排版，它决定了里边可排布的`content`的区域大小，而`margin`（外边距）主要影响盒本身的排版，它决定我们周围至少要存在的空白区域的大小。

因此 box-sizing 可以分成 content-box 和 border-box 两种。

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dc02443e-c86c-4d62-b0ff-ca23f7ae31b9/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dc02443e-c86c-4d62-b0ff-ca23f7ae31b9/Untitled.png)

# 2. 正常流

关于 css 的排版应该是有三代技术，第一代是属于正常流和正常流里面的一些基础设施的排版。第二代是`flex`技术的排版，第三代是基于`grid`的排版。

目前主流是 flex 技术。但我们目前讲的是关于正常流。

其实在 css 的排版里，只排**盒**和**文字**两样东西。

正常流排版的步骤如下：

- 收集盒进行（line-box）
- 计算盒在行中的排布
- 计算行的排布

inline-level-box：行内级别的盒

line-box：由 inline-level-box 和文字构成的盒子

block-level-box：块级别的盒子

line-box 和 block-level-box 是从上到下的排布顺序，称为 BFC (block-level-formatting-context)

line-box 内部是从左到右的排布顺序，称为 IFC (inline-level-formatting-context)

# 3. 正常流的行级排布

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c35c394e-cc42-4bba-8768-f4e0efc198f4/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c35c394e-cc42-4bba-8768-f4e0efc198f4/Untitled.png)

相关概念：

- 基线 baseline：对齐英文的基准线
- text-bottom，text-top：文字顶部底部，由 fontSize 最大的字决定
- line-bottom，line-top：行顶部底部

我们需要注意，行内盒 inline-block 的基线是随着自己里面文字的变化而变化的

# 4. 正常流的块级排布

正常流有两个非常复杂的机制，分别是**float**和**clear**

## 关于 float:

- float 会压缩行盒子尺寸

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b2fc8ed4-b093-431e-bfbb-20731bcde831/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b2fc8ed4-b093-431e-bfbb-20731bcde831/Untitled.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2b26ee84-f4ca-4867-bd91-44f229a3f41b/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2b26ee84-f4ca-4867-bd91-44f229a3f41b/Untitled.png)

- 影响行的范围是 float 元素自身高度内

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/acd8e001-373f-4b78-9939-e8bc27a196e6/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/acd8e001-373f-4b78-9939-e8bc27a196e6/Untitled.png)

- 多个 float 堆叠可能会发生

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0bfb0017-0912-4d09-82d7-a9a669056a16/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0bfb0017-0912-4d09-82d7-a9a669056a16/Untitled.png)

## 关于 clear：

clear 是找一个干净的空间来执行浮动

我们来看一段代码

```html
float:
<div
  style="float: right; width: 100px; height: 100px; background-color: blue"
></div>
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
float:
<div
  style="float: right; width: 100px; height: 100px; background-color: blue"
></div>
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
float:
<div
  style="float: right; width: 100px; height: 100px; background-color: blue"
></div>
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
float:
<div
  style="float: right; width: 100px; height: 100px; background-color: blue"
></div>
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
```

效果图如下：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/84a8e974-c53c-4383-aff0-63fcd08620db/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/84a8e974-c53c-4383-aff0-63fcd08620db/Untitled.png)

图中的 float 表示的位置是原本图片应该在的位置，我们发现这些图片因为`float:right`而产生了位移并且堆叠。

但是如果我们将第三张图片的`style`添加上`clear:right`的话，效果图如下

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/20cc19d8-1ab1-4776-a2d3-42e5bd9e0f04/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/20cc19d8-1ab1-4776-a2d3-42e5bd9e0f04/Untitled.png)

第三张图片会找到右边是空的地方来执行浮动的操作。

因此我们可以使用`clear`来强制进行换行

## 关于 float 的总结

由于`float`会导致整行的重排现象，这里并不是很推荐频繁使用`float`，只需要在绕排的时候使用即可，大部分情况下使用`flex`效果反而会更好

## Margin 折叠

当我们在 BFC 里的时候，如果有两个盒都拥有 margin，CSS 并不会把两个 margin 的空白都留出来，而是会让他们进行堆叠，叠出来的高度是跟最大的 margin 的高度相等的。

> 我们需要记住，只有在正常流的 BFC 里面才会有 margin 折叠这个问题。

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b1d29f2f-8fd0-4841-a53d-0f41f1489469/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b1d29f2f-8fd0-4841-a53d-0f41f1489469/Untitled.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/33c3cd8f-3c20-46e4-800c-b17004dcb50e/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/33c3cd8f-3c20-46e4-800c-b17004dcb50e/Untitled.png)

# 5. BFC 合并

我们需要理解几个基础知识点

## BLOCK

- Block Container: 里面包含 BFC，能容纳正常流的盒，里面就有 BFC
- Block-level Box: 外面有 BFC
- Block Box = Block Container + Block-level Box: 里外都有 BFC

## Block Container

- display: block
- display: inline-block
- display: table-cell
- display: table-caption
- flex item
- grid cell

## Block-level Box

- Block level
  - display: block
  - display: flex
  - display: table
  - display: grid
  - ...
- Inline level
  - display: inline-block
  - display: inline-flex
  - display: inline-table
  - display: inline-grid
  - ...
- Display: run-in（跟着自己上一个元素，不需要特别理解）

## 设立 BFC 的条件

- 拥有 float 元素
- position:absolute/fixed 的元素
- Block Container that are not block boxes :display 为 inline-block | table-cell | table-caption | flex | inline-flex | grid cell
- overflow != visible 的 Block Box

## BFC 合并

我们也可以换个角度记设立 BFC 的条件，我们默认能容纳正常流的盒都可以创建 BFC，除了 Block box 里外都是 BFC 并且 overflow 是 visiable。这个时候就会发生 BFC 合并

- block box && overflow:visiable
  - BFC 合并与 float：float 会影响行盒，比如文字环绕
  - BFC 合并与边距折叠：margin collapse

我们看两个例子：

```html
<body style="height: 500px; background-color: lightgreen">
  <div
    style="
      float: right;
      width: 100px;
      height: 100px;
      background-color: aqua;
      margin: 20px;
    "
  ></div>
  <div style="background-color: pink; overflow: visible; margin: 30px">
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
  </div>
</body>
```

当文字的 style 的 overflow 设为 visible 和 hidden 时排版样式：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dce93c2d-3175-4c56-aea5-cac601995525/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dce93c2d-3175-4c56-aea5-cac601995525/Untitled.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/34912860-7b9d-4ef6-ab07-769d84a1a592/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/34912860-7b9d-4ef6-ab07-769d84a1a592/Untitled.png)

从右图我们可以看出，当`overflow`设成`hidden`的时候，它符合创建新的 BFC 的条件。图中左边的文字列元素整体作为一个 block level 的 element 被排进 BFC 里面。这个时候文字列就围绕着右边的`float`元素就行排版了。

我们再来看另外一个例子：

```html
<body>
  <div
    style="width: 100px; height: 100px; background-color: aqua; margin: 20px"
  ></div>
  <div style="overflow: visible; background: pink">
    <div
      style="width: 100px; height: 100px; background-color: aqua; margin: 20px"
    ></div>
  </div>
</body>
```

当 overflow 设为 visible 和 hidden 时排版样式：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2a805a24-3f33-443f-9793-29c18d01a802/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2a805a24-3f33-443f-9793-29c18d01a802/Untitled.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0615b194-21f6-40e7-849f-48357fe31c24/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0615b194-21f6-40e7-849f-48357fe31c24/Untitled.png)

这样的原因是因为 overflow 为 visible 时（左图），两个天蓝色元素为同一个 BFC，因此会发生折叠。

当 overflow 为 hidden 的时候（右图），两个天蓝色元素已经不为同一个 BFC，这两者之间不会发生 margin 折叠，但是粉色元素和第一个天然色元素依然为同一个 BFC（body BFC）中，粉红色元素里外都是 BFC，所以他们依然会发生折叠。

**补充**：关于上面那段代码一共有 4 个 BFC，一个为最大的 bodyBFC，然后还有两个互相不包含的第一个蓝色元素和粉红色元素 BFC，以及最后一个被粉红色元素包含的第二个蓝色元素 BFC。

因此我们知道 bfc 就是一个排版上下文，比如说当我们在一个 main 函数里调用很多别的子函数，子函数之间的局域变量是互相分离的，bfc 就相当于一个小区域自我排版时，跟外面隔离开来

# 6. Flex 排版

排版的过程：

- 收集盒进行
- 计算盒在主轴方向的排布
- 计算盒在交叉轴方向的排布

要点：

- 行盒先计算非 flex 元素占用的宽度，再把剩下的宽度按比例分配宽度给 flex 元素
- 行盒剩下的宽度如果是负数，flex 元素宽度是 0，而其他元素宽度按比例压缩
- flex-wrap: no-wrap 的元素会被强制分进第一行
- 行高由行最高的一个元素决定，具体位置由 flex-align/item-align 属性决定

# 1. 动画

## Animation

Animation 包含两个部分

- @keyframes 定义
- animation：使用

使用@keyframes 声明动画，from 和 to 等同 0%和 100%，通过 animation 属性使用动画

下面是个简单的例子：

```html
<style>
  @keyframes mykf {
    from {
      background: red;
    }
    to {
      background: yellow;
    }
  }
  div {
    animation: mykf 5s infinite;
  }
</style>
<div style="width: 100px; height: 100px"></div>
```

`animation`是一个简写的属性，包含

- animation-name 时间曲线
- animation-duration 动画的时长;
- animation-timing-function 动画的时间曲线;
- animation-delay 动画开始前的延迟;
- animation-iteration-count 动画的播放次数;
- animation-direction 动画的方向

keyframes 的声明：使用百分比或 from/to 关键字表示关键帧的属性

**在 keyframes 里使用 transition 可以使用不同的 timing-function**

```html
@keyframes mykf{ 0%{top:0; transition:top ease} 50%{top:30px; transition:top
ease-in} 75%{top:10px; transition:top ease-out} 100%{top:0; transition:top
linear} }
```

## Transition

直接使用`transition`属性，不需要@rule 声明

`transition`是一个简写的属性，包含：

- transition-property 要变换的属性;
- transition-duration 变换的时长;
- transition-timing-function 时间曲线;
- transition-delay 延迟。

## Timing Function 时间曲线

CSS 的 timing-function 都是[三次贝塞尔曲线](https://cubic-bezier.com/#.17,.67,.83,.67)

纵轴表示的是我们的进展，横轴表示的是时间

贝塞尔曲线是一种插值曲线，它描述了两个点之间差值来形成连续的曲线形状的规则。

- ease：从慢到快再到慢
- ease-in：从慢到快（适合元素离开）
- ease-out：从快到慢（适合元素出现）
- ease-in-out：相似 ease，但是速度差别更小
- linear：线性动画，速度恒定

对于贝塞尔曲线定义的理解可以看 pdf

# 2. 颜色

**浏览器的默认颜色空间是基于 sRGB 的（图片/视频是特例）**

CSS3 可以使用这些颜色模型表示颜色

- RGB，RGBA
- HSL，HSLA

HSL 是色相（Hue）、饱和度（Saturation）和明亮度（Lightness）这三个颜色属性的简称

[https://www.w3.org/TR/css-color-3/](https://www.w3.org/TR/css-color-3/)

# 3. 绘制

## 影响绘制的属性

- 几何图形
  - border
  - box-shadow
  - border-radius
- 文字
  - font
  - text-decoration
- 位图
  - background-image

## 应用技巧

- data url + svg
- data:image/svg+xml,<svg width="100%" height="100%" version="1.1"
  xmlns="http://www.w3.org/2000/svg"><ellipse cx="300" cy="150"
  rx="200" ry="80" style="fill:rgb(200,100,50);
  stroke:rgb(0,0,100);stroke-width:2"/> </svg>
