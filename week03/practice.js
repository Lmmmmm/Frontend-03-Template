//实现复合选择器，实现支持空格的 Class 选择器
//思路：把空格用split处理并且进行逐一比较
/*
function match(element, selector) {
    if (selector.charAt(0) === '#') {
    } else if (selector.charAt(0) === '.') {
      let attr = element.attributes.filter((attr) => attr.name === 'class')[0]
      if (attr) {
        let classes = attr.value.split(' ')
        for (let class of classes) {
          if (class === selector.replace('.', '')) {
            return true
          }
        }
        return false
      }
    } else {
      ...
    }
    return false
}
*/

// selectorParts 里面去解析复合选择器
function splitSelector(selector){
    let selector = [];
    function split(){
        if(selector.match(/^[a-zA-Z]+([\.|#][a-zA-Z_-][\w-]+$/)){
            selector.push(RegExp.$1);
            selector = selector.replace(RegExp.$1, '');
            split(selector);
        } else {
            selectors.push(selector);
        }
    }
    split(selector);
    return selectors;
}


