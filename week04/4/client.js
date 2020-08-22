const net = require("net");
const parser = require("./parser.js");

class Request {
  constructor(options) {
    //存值同时给默认值
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if (this.headers["Content-Type"] === "application/json"){
      this.bodyText = JSON.stringify(this.body);
    }
    //application/x-www-form-urlencoded的话是以&符来分割的
    else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ){
        this.bodyText = Object.keys(this.body).map(key=>`${key}=${encodeURIComponent(this.body[key])}`).join('&');
    }
    //这是HTTP协议的请求,必须要有Length
    this.headers["Content-Length"] = this.bodyText.length;
  }

  send(connection) { // The parameter connection is a constructed TCP connection.
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser;
      // 可以在已经建立好的TCP链接上把我们的请求发出去
      if(connection) {
          connection.write(this.toString());
      }
      // 如果没有传，我们就自动通过传来的host和port创建一个新的TCP链接
      else {
          connection = net.createConnection({
              host: this.host,
              port: this.port
          }, () =>{
              connection.write(this.toString());// A callback function when the connection is created successfully
          });
      }
      // 监听connection的data
      connection.on('data', (data) =>{
        //   console.log(data.toString());
          //原封不动把data变成字符串传给parser
          parser.receive(data.toString());
          // parser的传输已经结束
          if(parser.isFinished){
              //执行resolve把整个parser结束掉
              resolve(parser.response);
              // 不要忘记把connection给关掉
              connection.end();
          }
      });

      connection.on('error', (err) => {
          reject(err);
          connection.end();
      });
    });
    }
    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
    }
}

class ResponseParser {
    constructor(){
        //首先设置状态机
        //status line会以一个\r\n去结束
        //当接收到\r会切换到LINE_END
        this.WAITING_STATUS_LINE = 0;
        //直到接收到\n切换到WAITING_HEADER的状态
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        //header之后还要再等一个空行
        this.WAITING_HEADER_BLOCK_END = 6;
        // 由于body格式不固定，没法通过状态机简单解决
        this.WAITING_BODY = 7;
        //存储解析中产生的结果
        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }
    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response(){
        // this.statusLine.match(/HTTP\/1.1 (\d+) (\S+)/);
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return{
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    receive(string){
        for(let i = 0; i < string.length; i++){
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char){
        if(this.current === this.WAITING_STATUS_LINE){
            if(char === '\r'){
                this.current = this.WAITING_STATUS_LINE_END;
            } else {
                this.statusLine += char;
            }
        } else if(this.current === this.WAITING_STATUS_LINE_END){
            if(char === '\n'){
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if(this.current === this.WAITING_HEADER_NAME){
            if(char === ":"){
                this.current = this.WAITING_HEADER_SPACE;
            } else if(char === "\r") {
                this.current = this.WAITING_HEADER_BLOCK_END;
                //进入block end代表所有的header都收到了，这时候我们就要找Transfer-Encoding
                if(this.headers['Transfer-Encoding'] === 'chunked'){
                    this.bodyParser = new ChunkedBodyParser();
                }
            } else {
                this.headerName += char;
            }
        } else if(this.current === this.WAITING_HEADER_SPACE){
            if(char === ' '){
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if(this.current === this.WAITING_HEADER_VALUE){
            if(char === '\r'){
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            } else{
                this.headerValue += char;
            }
        } else if(this.current === this.WAITING_HEADER_LINE_END){
            if(char === "\n"){
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if(this.current === this.WAITING_HEADER_BLOCK_END){
            if(char === "\n"){
                this.current = this.WAITING_BODY;
            }
        } else if(this.current === this.WAITING_BODY){
            this.bodyParser.receiveChar(char);
        }
    }

}

class ChunkedBodyParser{
    constructor(){
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_CHUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;

        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }
    receiveChar(char){
        if(this.current === this.WAITING_LENGTH){
            if(char === '\r'){
                if(this.length === 0){
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            } else {
                 //原来是16进制，所以要乘以16，把最后读进来的一位给加上去
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if(this.current === this.WAITING_LENGTH_LINE_END){
            //console.log("WAITING_LENGTH_LINE_END");
            if(char === '\n'){
                this.current = this.READING_CHUNK;
            }
        } else if(this.current === this.READING_CHUNK){
            this.content.push(char);
            this.length --;
            if(this.length === 0){
                this.current = this.WAITING_NEW_LINE;
            }
            // if(this.length!==0){ // make sure it's volid to push a new char to the content
            //     this.content.push(char);
            // }
            // if(this.content.length === this.length){
            //     this.current = this.WAITING_NEW_LINE;
            //     this.length = 0; //RESET for a chunk
            // }
        } else if(this.current === this.WAITING_NEW_LINE){
            if(char === '\r'){
                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if(this.current === this.WAITING_NEW_LINE_END){
            if(char === '\n'){
                this.current = this.WAITING_LENGTH
            }
        }
    }
}

void async function() {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8088",
    path: "/",
    headers: {
      ["X-Foo2"]: "customed"
    },
    body: {
      name: "Mei"
    }
  });
  let response = await request.send();
  //如果是真正的浏览器这里必须逐段返回，这里为了代码简洁，我们会把body全收回来
  let dom = parser.parseHTML(response.body);
  console.log(JSON.stringify(dom, null, "    "));
}();