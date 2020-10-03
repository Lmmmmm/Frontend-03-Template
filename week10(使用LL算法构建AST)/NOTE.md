前面我们已经学习了很多关于字符串处理的知识。这次我们专注于比较高级的字符串处理（LL 算法）

# 使用 LL 算法构建 AST

AST 叫做抽象语法树

我们的代码在计算机的分析过程如下：

1. 首先就是把我们的编程语言进行分词
2. 把这些词变成层层相嵌的语法树结构
3. 解析我们的代码去执行

构建 AST 抽象语法树的过程又被叫做语法分析，最著名的语法分析的核心思想有两种，分别是**LL**算法和**LR**算法。

LL 算法(left left)代表的是从左到右进行扫描和规约，

# 四则运算

为了更好地理解 LL 算法，我们来举个四则运算的例子。

## 四则运算词法的定义

- TokenNumber: 1,2,3,4,5,6,7,8,9,0 的组合
- Operatoe: + - \* /
- WhiteSpace: <SP>
- LineTerminator: <LF> <CR>

## 四则运算语法定义

```
//四则运算 产生式

//TERMINAL SYMBOL : <EOF>
<Expression>::= <AdditiveExpression><EOF>

//TERMINAL SYMBOL : <+> <->
<AdditiveExpression>::= <MultiplicativeExpression> | <AdditiveExpression> <+> <MultiplicativeExpression> | <AdditiveExpression> <-> <MultiplicativeExpression>

//TERMINAL SYMBOL : <NUMBER> <*> </>
<MultiplicativeExpression> ::= <Number> | <MultiplicativeExpression> <*> <Number>| <MultiplicativeExpression> </> <Number>
```

# 正则表达式

我们了解了四则运算语法定义，接下来来看一下正则表达式：

```jsx
var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
```

我们分析一下上面这个表达式的语法，这个正则表达式是以或`|`分开的，每一个成分里面都有一个圆括号，在正则里面圆括号代表捕获，一旦我们进行捕获，它除了正则表达式整体表示的字符串，圆括号里面的内容也会被直接匹配出来。

在正则中但凡出现一个（）就会在正则类数组对象（Tuple）中产生一个 capture slot。

接下来是代码和运行结果。

```jsx
<script>
  var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
  //对应regexp
  var dictionary = [
    "Number",
    "Whitespace",
    "LineTerminator",
    "*",
    "/",
    "+",
    "-",
  ];

  function tokenize(source) {
    var result = null;
    while (true) {
      //exec() 方法在一个指定字符串中执行一个搜索匹配
      result = regexp.exec(source);
      if (!result) break;
      for (var i = 1; i <= dictionary.length; i++) {
        if (result[i]) console.log(dictionary[i - 1]);
      }
      console.log(result);
    }
  }

  tokenize("1024 + 10 * 25");
</script>
```

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/498ea46a-79cc-4917-b70d-5cbdd8756bda/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/498ea46a-79cc-4917-b70d-5cbdd8756bda/Untitled.png)

# LL 词法分析

我们就在正则表达式的基础上储存每个 token

```jsx
<script>
  var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
  //对应regexp
  var dictionary = [
    "Number",
    "Whitespace",
    "LineTerminator",
    "*",
    "/",
    "+",
    "-",
  ];

  function* tokenize(source) {
    var result = null;
    var lastIndex = 0;
    while (true) {
      lastIndex = regexp.lastIndex;
      //exec() 方法在一个指定字符串中执行一个搜索匹配
      result = regexp.exec(source);
      //没匹配出来break
      if (!result) break;
      //匹配出来的有不认识的字符也break
      if (regexp.lastIndex - lastIndex > result[0].length) break;
      let token = { type: null, value: null };
      for (var i = 1; i <= dictionary.length; i++) {
        if (result[i]) token.type = dictionary[i - 1];
      }
      token.value = result[0];
      yield token;
    }
    yield {
      type: "EOF",
    };
  }

  for (let token of tokenize("1024 + 10 * 25")) {
    console.log(token);
  }
</script>
```

# LL 语法分析

重点就是每个产生式都对应一个函数。

```jsx
<script>
  var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
  //对应regexp
  var dictionary = [
    "Number",
    "Whitespace",
    "LineTerminator",
    "*",
    "/",
    "+",
    "-",
  ];

  function* tokenize(source) {
    var result = null;
    var lastIndex = 0;
    while (true) {
      lastIndex = regexp.lastIndex;
      //exec() 方法在一个指定字符串中执行一个搜索匹配
      result = regexp.exec(source);
      //没匹配出来break
      if (!result) break;
      //匹配出来的有不认识的字符也break
      if (regexp.lastIndex - lastIndex > result[0].length) break;
      let token = { type: null, value: null };
      for (var i = 1; i <= dictionary.length; i++) {
        if (result[i]) token.type = dictionary[i - 1];
      }
      token.value = result[0];
      yield token;
    }
    yield {
      type: "EOF",
    };
  }

  let source = [];
  for (let token of tokenize("1 + 2 * 5 + 3")) {
    if (token.type !== "Whitespace" && token.type !== "LineTerminator")
      source.push(token);
  }

  // 整体加上一个EOF
  function Expression(tokens) {
    if (
      source[0].type === "AdditiveExpression" &&
      source[1] &&
      source[1].type === "EOF"
    ) {
      let node = {
        type: "Expression",
        children: [source.shift(), source.shift()],
      };
      source.unshift(node);
      return node;
    }
    AdditiveExpression(source);
    return Expression(source);
  }
  function AdditiveExpression(source) {
    if (source[0].type === "MultiplicativeExpression") {
      let node = {
        type: "AdditiveExpression",
        children: [source[0]],
      };
      source[0] = node;
      return AdditiveExpression(source);
    }
    if (
      source[0].type === "AdditiveExpression" &&
      source[1] &&
      source[1].type === "+"
    ) {
      let node = {
        type: "AdditiveExpression",
        operator: "+",
        children: [],
      };
      node.children.push(source.shift());
      node.children.push(source.shift());
      MultiplicativeExpression(source); //根据产生式，第三项是<Add><+><Multi>
      node.children.push(source.shift());
      source.unshift(node);
      return AdditiveExpression(source);
    }
    if (
      source[0].type === "AdditiveExpression" &&
      source[1] &&
      source[1].type === "-"
    ) {
      let node = {
        type: "AdditiveExpression",
        operator: "/",
        children: [],
      };
      node.children.push(source.shift());
      node.children.push(source.shift());
      MultiplicativeExpression(source);
      node.children.push(source.shift());
      source.unshift(node);
      return AdditiveExpression(source);
    }
    if (source[0].type === "AdditiveExpression") return source[0];
    //遇到目前无法处理的事情，先调用MultiplicativeExpression
    MultiplicativeExpression(source);
    return AdditiveExpression(source);
  }
  function MultiplicativeExpression(source) {
    if (source[0].type === "Number") {
      let node = {
        type: "MultiplicativeExpression",
        children: [source[0]],
      };
      source[0] = node;
      return MultiplicativeExpression(source);
    }
    if (
      source[0].type === "MultiplicativeExpression" &&
      source[1] &&
      source[1].type === "*"
    ) {
      let node = {
        type: "MultiplicativeExpression",
        operator: "*",
        children: [],
      };
      node.children.push(source.shift());
      node.children.push(source.shift());
      node.children.push(source.shift());
      source.unshift(node);
      return MultiplicativeExpression(source);
    }
    if (
      source[0].type === "MultiplicativeExpression" &&
      source[1] &&
      source[1].type === "/"
    ) {
      let node = {
        type: "MultiplicativeExpression",
        operator: "/",
        children: [],
      };
      node.children.push(source.shift());
      node.children.push(source.shift());
      node.children.push(source.shift());
      source.unshift(node);
      return MultiplicativeExpression(source);
    }
    //处理完毕
    if (source[0].type === "MultiplicativeExpression") return source[0];

    return MultiplicativeExpression(source);
  }
  console.log(Expression(source));
</script>
```
