一个好的组件体系能够帮助一个前端团队提升它的复用率。

# 1. 组件的基本知识

## 组件的基本概念和基本组成部分

### ・对象与组件

一般我们会把组件和对象，模块区分开。一般我们认为组建是和 UI 强相关的东西，我们从某种意义上可以理解为是特殊的对象或者模块。它的特点是可以以树形结构来进行组合，并且拥有模板化的配置能力。

对象一般有三个要素

- Properties
- Methods
- Inherit(继承关系)

组件

- Properties
- Methods
- Inherit
- Attribute(当有 Properties 的时候会被翻译成特性)
- Config & State(一般指构造函数里面传的参数)
- Event
- Lifecycle
- Children(非常重要 树形结构的必要性)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/581e6fe7-2f25-46f3-9872-6178a59561a6/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/581e6fe7-2f25-46f3-9872-6178a59561a6/Untitled.png)

### ・Attribute vs Property

- Attribute 强调描述性
- Property 强调从属关系

从 HTML 的角度分析：

```jsx
Attribute:
<my-component attribute="v">
my-component.getAttribute=("a");
my-component.setAttribute=("a",value);

Property:
my-component.a="value"
```

接下来我们看几个例子

```jsx
//example 1
<dic class="cls1 cls2"></div>
<script>
var div = document.getElementByTagName('div')
div.className // cls1 cls2
</script>
```

早年的 js 是不允许 class 这样的关键字做属性名的，现在是可以的。但 HTML 为了规避这个问题，它把 attribute 叫成 class，把 property 变成了 className。两种是完全的互相反射关系

```jsx
//example 2
<dic class="cls1 cls2" style="color:blue"></div>
<script>
var div = document.getElementByTagName('div')
div.className // 对象
</script>
```

有些时候 attribute 是个字符串，但 property 是一个字符串语义化之后的对象。

```jsx
//example 3
<a href="//m.taobao.com"></div>
<script>
var div = document.getElementByTagName('a');
a.href //property: "http://m.taobao.com",这个是url是resolve过的结果
a.getAttribute("href") //attribute: //"http://m.taobao.com",跟HTML代码中完全一致。
</script>
```

```jsx
//example 4
<input value = "cute />
<script>
var input = document.getElementByTagName("input"); //若property没有设置，则结果是attribute
input.value // cute
input.getAttribute('value') //cute
input.value = "hello"; //若value属性已经设置，则attribute不变，property变化，元素上实际的效果是property优先
input.value // hello
input.getAttribute('value'); //cute
</script>
```

这个是 value 最坑的地方，需要记住元素上实际的效果是 property 优先

### ・Structure figure

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/129a522d-b6c7-4e16-a39b-967c056bb095/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/129a522d-b6c7-4e16-a39b-967c056bb095/Untitled.png)

### ・component state

[Untitled](https://www.notion.so/0415e988158a42e7a7a10276da4e442a)

### ・Lifecycle

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bef5ce97-6aba-40c3-93ef-dfe4dc2694f0/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bef5ce97-6aba-40c3-93ef-dfe4dc2694f0/Untitled.png)

### ・Children

- Content
  - 能直接 render 的组件
- Template
  - 不能直接 render 的 （vue）

# 2. 轮播组件

1. @Babel/plugin-transform-react-jex
   - 转换 jsx 成为 React.createElement
   - 自定义：{pragma:}
2. Babel:
   1. preset: pre-defined plugins collection
   2. plugin: extended function
