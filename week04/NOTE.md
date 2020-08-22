# 根据浏览器属性进行排版

在上一节课我们完成了css规则的计算，我们通过计算css的每个元素匹配了哪些css规则，并且把css规则里面的内容放进元素的`computedStyle`上面。

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d104b6f8-d42f-44c0-a94d-8744f7e0de7a/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d104b6f8-d42f-44c0-a94d-8744f7e0de7a/Untitled.png)

这次我们的排版会以flex排版来实现排版算法。

css一共有三种排班技术，第一代是正常流，包含position, float, display等等属性，因此第一代有点偏向古典排版。第二代就是flex，它比较接近我们的编程思想，类似于在瓢里填满剩余空间。第三代是grid，也是自己比较常用的排版技术。

由于我们是做toy-broswer，因此我们是希望排版能够好实现但是能力又不差，因此使用了第二代flex。

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/259ffc14-e18c-4e02-b649-1e936594a2b1/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/259ffc14-e18c-4e02-b649-1e936594a2b1/Untitled.png)

由于flex布局是需要知道子元素的，也就是在我们发现结束标签之前，也就是找`token.type=="endTag"`的地方

### 总结

- 处理了flexDirection, wrap相关的属性
- 创建了抽象的属性变量`main, cross`之类的来代替`width, length`这种具体的值进行计算，这样会给接下来的工作带来很大方便

# 收集元素进行

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3892ceda-cc24-433e-9285-c0cf9f8cd3d0/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3892ceda-cc24-433e-9285-c0cf9f8cd3d0/Untitled.png)

分行：

- 根据主轴尺寸，把元素进行分行
- 若设置了no-wrap，则强行分配进第一行

收集元素进行(hang)主要是为了我们后面计算元素位置的重要准备工作。flex也是允许我们进行分行的。当我们所有元素的子元素的尺寸超过父元素的主轴尺寸的时候就会进行分行。它还是允许用一个no-wrap进行控制的。

# 计算主轴

我们根据上一步完成的分行，来使用flex相关的属性来计算每一行里面的尺寸。

计算主轴方向：

- 找出所有Flex元素
- 把主轴方向的剩余尺寸按比例分配给这些元素
- 若剩余空间为负数(no-warp)，所有flex元素为0，等比压缩剩余的非flex元素

针对于第二点我们看下例子：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/96eff275-56b0-42e8-9a32-679801ec6cfb/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/96eff275-56b0-42e8-9a32-679801ec6cfb/Untitled.png)

我们发现当前行有剩余空间，带问号的block是flex元素

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8b7140dd-ac15-40a1-81f1-04a4416cf315/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8b7140dd-ac15-40a1-81f1-04a4416cf315/Untitled.png)

那么在这一行还有剩余空间的情况下，我们就会让它把剩余空间填满

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e1ff1316-ec0e-4054-b166-2b175ebfd390/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e1ff1316-ec0e-4054-b166-2b175ebfd390/Untitled.png)

如果有多个flex元素，我们就去按比例去分配并且填满剩余空间

# 计算交叉轴

主轴计算完了之后就是计算交叉轴尺寸

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e11bdc1a-cc84-4086-a546-71292ec19928/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e11bdc1a-cc84-4086-a546-71292ec19928/Untitled.png)
# 绘制单个元素

由于node.js里面是没有图形的封装，所以我们用生成图片来代替，也就是把绘制屏幕变成绘制图片

总结：

- 绘制需要依赖一个图形环境
- 这里采用了npm包images
- 绘制在一个viewport上进行
- 与绘制相关的属性：background-color, border, background-image等

# 绘制DOM树

- 递归调用子元素的绘制方法完成DOM树的绘制
- 忽略一些不需要绘制的结点
- 在实际的浏览器中，文字绘制是难点，需要依赖文字库，把文字变成图片去渲染，这里忽略
- 在实际浏览器中，还会对一些图层做compositing，我们这里也忽略了。

## 绘制结果

渲染的html代码如下：

```html
<html maaa=a >
    <head>
        <style>
#container{
    width: 500px;
    height: 300px;
    display: flex;
    background-color: rgb(255, 255, 255);
}
#container #myid{
    width: 200px;
    height: 100px;
    background-color: rgb(255, 0, 0);
}
#container .c1{
    flex: 1;
    background-color: rgb(0, 255, 0);
}
        </style>
    </head>
    <body>
        <div id="container">
            <div id="myid"></div>
            <div class="c1"></div>
        </div>
    </body>
</html>
```

得到的DOM树中style属性的信息：

```html
html {}
    head {}
        style {}
    body {}
        div {"width":500,"height":300,"display":"flex","background-color":"rgb(255, 255, 255)","flexDirection":"row","alignItems":"stretch","justifyContent":"flex-start","flexWrap":"nowrap","alignContent":"stretch"}
            div {"width":200,"height":100,"background-color":"rgb(255, 0, 0)","left":0,"right":200,"top":0,"bottom":100}
            div {"flex":1,"background-color":"rgb(0, 255, 0)","width":300,"left":200,"right":500,"height":300,"top":0,"bottom":300}
```

最终渲染结果：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1348038b-60f4-426d-bb63-571a4e37e3b8/viewport.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1348038b-60f4-426d-bb63-571a4e37e3b8/viewport.jpg)

首先这个body的背景`container`的`width: 500px  height: 300px`。之后我们遍历到`myid`，它指定了width为200px，height为100px。这种没指定的情况下，我们通常都是从左往右放置元素。我们发现`myid`并不能填满整个`container`的width。而之后遍历到`c1`，由于它是`flex:1`，所以它会填满父元素的宽度，并且`c1`没有指定高度，所以它的高度也是默认和父元素相同。