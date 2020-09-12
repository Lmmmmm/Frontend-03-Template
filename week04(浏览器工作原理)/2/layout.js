function getStyle(element){
    if(!element.style)
        element.style ={}
    
    //console.log("---style---")
    //把一些属性变成纯数字来处理(预处理)
    for(let prop in element.computedStyle){
        //console.log(prop);
        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value

        //处理px属性
        if(element.style[prop].toString().match(/px$/)){
            element.style[prop] = parseInt(element.style[prop])
        }
        if(element.style[prop].toString().match(/^[0-9]\.]+$/)){
            element.style[prop] = parseInt(element.style[prop])
        }
    }
    return element.style;
}

function layout(element) {
    if(!element.computedStyle)
        return;
        
    //对style进行一些预处理
    let elementStyle = getStyle(element);

    if(elementStyle.display !== 'flex')
        return;
    //把文本结点之类的element全部过滤出去
    var items = element.children.filter(e => e.type === 'element');
    //为了支持order属性
    item.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
    });
    //取出style后开始flex布局
    var style = elementStyle;

    //把空的都变成null，方便后面处理
    ['width', 'height'].forEach(size =>{
        if(style[size] === 'auto' || style[size] ===''){
            style[size] = null;
        }
    })

    //设置默认值
    if(!style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row'
    if(!style.alignItems ||style.alignItems === 'auto')
        style.alignItems = 'stretch'
    if(!style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = "flex-start";
    if(!style.flexWrap || style.flexWrap === 'auto')
        style.flexWrap = 'nowrap';
    if(!style.alignContent || style.alignContent === 'auto')
        style.alignContent = "stretch";

    var mainSize, mainStart, mainEnd, mainSign, mainBase, 
        crossSize, crossStart, crossEnd, crossSign, crossBase;
    if(style.flexDirection === 'row'){
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if(style.flexDirection === 'row-reverse'){
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if(style.flexDirection === 'column'){
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if(style.flexDirection === 'column-reverse'){
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    //如果是反向的换行的话(交叉轴只受wrap-reverse影响)
    if(style.flexWrap === 'wrap-reverse'){
        //互换交叉轴的开始和结果
        var tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    //如果父元素没有设置主轴尺寸,比如说主轴是width属性,但父元素没有width.就会进入isAutoMainSize
    //isAutoMainSize: 反正父元素没设置主轴尺寸,就由子元素把它撑开，那么这个时候它的尺寸无论如何也不会超
    var isAutoMainSize = false;
    if(!style[mainSize]){ //auto sizing
        elementStyle[mainSize] = 0;
        //把所有子元素的mainSize加起来就是它的主轴元素了
        for(var i = 0; i < items.length; i++){
            var item = items[i];
            if(itemStyle[mainSize] !== null || itemStyle)
                elementStyle[mainSize] = elementStyle[mainSize]
        }
        isAutoMainSize = true;
        //style.flexWrap = 'nowrap';

        // 开始把元素收进行
        var flexLine = [] //行的名字(为了和正常流的行区分开)
        var flexLines = [flexLine]
        
        var mainSpace = elementStyle[mainSize]; //剩余空间，让它等于父元素的mainSize
        var crossSpace = 0; //实际占的尺寸

        for(var i = 0; i < items.length; i++){
            //取出每个flex item的属性
            var item = items[i]; 
            var itemStyle = getStyle(item);

            if(itemStyle[mainSize] === null){ //没设主轴尺寸的话给个默认值0
                itemStyle[mainSize] = 0;
            }

            if(itemStyle.flex){ //如果有flex属性的话
                flexLine.push(item); //说明这个元素可以伸缩，就一定可以放进flexLine里
            } else if(style.flexWrap === 'nowrap' && isAutoMainSize){
                mainSpace -= itemStyle[mainSize];
                if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                    crossSpace = Math.max(crossSpace, itemStyle[crossSize]); //算行高(去该行的最高值)
                flexLine.push(item); //放进flexLine里面
            } else { //处理换行
                //如果有元素比他的父元素主轴尺寸还大的话，把该元素压到和主轴尺寸一样大
                if(itemStyle[mainSize] > style[mainSize]){
                    itemStyle[mainSize] = style[mainSize];
                }
                //如果主轴剩下的空间不足以容纳当前元素了
                if(mainSpace < itemStyle[mainSize]){
                    // 处理旧的flexLine,算出实际剩余的尺寸和实际占的行高
                    flexLine.mainSpace = mainSpace;
                    flexLine.crossSpace = crossSpace;
                    // 创建新的flexLine，也就是新行并存进数组里
                    flexLine = [item];
                    flexLines.push(flexLine);
                    //重置
                    mainSpace = style[mainSize];
                    crossSpace = 0;
                } else { //如果主轴剩下的空间可以容纳当前元素了
                    flexLine.push(item);
                }
                //计算主轴和交叉轴的尺寸
                if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                    crossSpace = Math.max(crossSpace, itemStyle[crossSize]); //算行高(去该行的最高值)
                mainSpace -= itemStyle[mainSize];
            }
        }
        flexLine.mainSpace = mainSpace;//最后一行的元素
        console.log(items)
    }
}

module.exports = layout;