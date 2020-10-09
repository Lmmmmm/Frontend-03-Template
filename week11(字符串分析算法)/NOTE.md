# 1. 总论

这节课主要把剩下的字符串算法给讲完

我们先看下字符串算法整体目录，从易到难大概是这样

- 字典树
  - 大量高重复字符串的储存和分析（例如处理一亿个字符串里面的出现频率前 50）
- KMP
  - 在长字符串里找一个短字符串
- Wildcard
  - 带通配符(例如？ \*)的字符串模式
- 正则
  - 字符串通用匹配模式
- 状态机
  - 通用的字符串分析
- LL LR
  - 字符串多层级结构分析

# 2. 字典树

字典树的大致的想法如下

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bc3013a4-fd10-413e-8409-6e361deef7ef/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bc3013a4-fd10-413e-8409-6e361deef7ef/Untitled.png)

# 3. KMP 字符串模式匹配算法

KMP 是一个字符串的模式匹配算法，也就是查一个字符串里有没有另一个字符串。

我们举个例子

```jsx
abcdabce
       ↑
abcdabcdabcex
			 ↑
```

首先，abcdabce 本身就有重复的，如果是没有需要遍历的字符串本身是没有重复的话，一旦发生匹配失败就要从头开始匹配了。当有重复的时候，例如我们上面的例子，我们匹配到 d 的位置的时候，我们发现 d 和 e 不匹配，但是我们可以证明 abcd 是匹配的，所以我们把原字符串 pattern 的位置移动一下

```jsx
abcdabce
   ↑
abcdabcdabcex
			 ↑
```

这样我们就不需要移动到最前面。

我们看了上面的步骤就知道，我们最开始需要做的事情是看查找的字符串里面的最长公共子串，做法为每次都截取掉首位

```jsx
abcdabce;
bcdabce;
cdabce;
dabce;
abce;
```

接下来我们需要考虑如何去描述这种自重复特性。我们采用表格的形式。

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e724e8ac-1f93-438d-995d-fcb01be39468/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e724e8ac-1f93-438d-995d-fcb01be39468/Untitled.png)

# Wildcard

- wildcard: ab*c?d*abc\*a?d
  - 只有*: ab*cd*abc*a?b
  - 只有?:c?d, a?d

我们看下只有星号的情况：

对于有多个星号的情况下，前面的星号我们要尽量少匹配，而最后一个星号需要尽量多匹配

对于 ab*cd*abc\*a?b 这个例子，如果没有最后那个问号，就相当于多个 KMP 匹配，如果有问号的话情况后非常复杂。因此一般我们使用**正则**来解决这个问题。

我们使用正则时，不能把一整段全部都用正则匹配，这样性能会很差。因此我们需要逐段的转换成 exec 去处理正则。
