# 学习笔记
本周主要学习了关于浏览器的运作原理和基本渲染过程，了解到关于服务器和用户之间传递个过程。<br>
具体的看自己做的笔记
# 课题解析
这一次的课题主要是让我们做一个toy-browser，我们主要对用户和服务器进行了设计。<br>
具体的设计老师也在上课讲过，自己也做了笔记。因此在这里主要想说一下运行结果和需要补充的地方。
## 运行结果
### server的运行情况
```
headers:
{ 'x-foo2': 'customed',
  'content-type': 'application/x-www-form-urlencoded',
  'content-length': '8' }

method:
'POST'
chunk is a kind of Buffer
Before concat() and toString(), body: 
[ Buffer [Uint8Array] [ 110, 97, 109, 101, 61, 77, 101, 105 ] ]
body: name=Mei
```
我们可以看到（这里借用waleking的总结）
1. body包含一个Buffer，长度为8，对应于body，也就是{name=Mei}的ASCII码。这和winter老师在String一节中的讲解一样，ASCII码在UTF8中只用一个字节表示，表示方式和ASCII的相同。
2. http.createServer中的request负责解析http请求；response部分负责处理http响应。 node.js中http部分文档给出了具体的解释。 要获知request中的其他部分，可以使用console.dir(request)查看。
3. 我看到有人说`body.push(chunk.toString())`会报错，原因是Buffer.concat(body)尝试将body拼接起来，但是发现body是string而非Buffer or Uint8Array。但对于我来说是没有任何问题的，不知道是不是win和mac区别的原因。
### client的运行情况
```
HTTP/1.1 200 OK
Content-Type: text/html
Date: Fri, 07 Aug 2020 12:30:15 GMT
Connection: keep-alive
Transfer-Encoding: chunked

d
 Hello World

0


{ statusCode: '200',
  statusText: 'OK',
  headers:
   { 'Content-Type': 'text/html',
     Date: 'Fri, 07 Aug 2020 12:30:15 GMT',
     Connection: 'keep-alive',
     'Transfer-Encoding': 'chunked' },
  body: ' Hello World\n\r\n' }
```
运行结果的上半部分是`console.log(data.toString());`的结果，也就是服务器端返回的data，d是16进制的13，代表body的长度

而下面是通过服务端得到的最终response`console.log(response);`

## 知识补充
### void async function() {}()

这个的作用是利用 void 运算符让 JavaScript 引擎把一个function关键字识别成**立即调用函数表达式**而不是函数声明（语句）。

换句话说就是会立刻执行函数里面的内容，我们看下面两个例子来促进理解
```js
// function后不带关键字
void function () { 
    var name = "Barry";
    console.log(name);
}(); //无需调用直接得到Barry
// 无法从外部访问变量 name
name // 抛出错误："Uncaught ReferenceError: name is not defined"


// function后带关键字
void function saySomething (msg) {
  console.log(msg);
} ('Hello'); //直接得到Hello
```

当然这里面还有一个`async`关键字

由于之前理解过`async`,`await`和`promise`，所以这里就不概括了。