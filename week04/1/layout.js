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
}

module.exports = layout;