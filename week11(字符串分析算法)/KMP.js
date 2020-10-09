function kmp(source, pattern) {
  //计算table
  let table = new Array(pattern.length).fill(0);
  //table[i]=j 代表第i位前面有长度为j的公共子串
  {
    //加大括号让i,j变得更有局限性
    let i = 1,
      j = 0;
    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        ++i, ++j;
        table[i] = j;
      } else {
        if (j > 0) j = table[j];
        else {
          ++i;
        }
      }
    }
    // console.log(table);
  }

  //匹配
  {
    //i:index of source, j:index of pattern
    let i = 0,
      j = 0;
    while (i < source.length) {
      if (pattern[j] === source[i]) {
        ++i, ++j;
      } else {
        if (j > 0) j = table[j];
        else {
          ++i;
        }
      }
      if (j === pattern.length) return true;
    }
    return false;
  }
}
console.log(kmp("abc", "abc"));

// console.log(kmp("abcdabcdabcex", "abcdabce"));
