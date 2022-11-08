// 1. 引入 express 框架
const express = require("express");
// 2. 创建 express 实例
const app = express();
// 3. 引入 base64 解码模块
const base64 = require("base64-img");
// 4. 引入跨域模块，让接口可以跨域访问
const cors = require("cors");
// 5. 引入 http body 解析模块
const bodyParser = require("body-parser");
// 6. 定义运行的端口号
const port = 8081;

// 7. 执行跨域
app.use(cors());
// 8. 挂载静态资源，让前端可以访问到服务器的静态资源，这里的静态资源主要是由 krpano 引擎生成的全景图工程，如果不声明这个静态资源，前端是无法访问到的
// 可以注释掉看看效果
app.use(express.static("./server/public/vtour"));
// 9. 指定图片大小
app.use(bodyParser.json({ limit: "50mb" }));

// 10. 创建接口：上传图片到服务器
app.post("/upload", (req, res) => {
  // 11. 获取前端上传的图片
  const { image } = req.body;
  // 12. 解码图片并将图片保存到指定目录
  base64.img(image, "./server/public", Date.now(), (err, filepath) => {
    const pathArr = filepath.split("/");
    const fileName = pathArr[pathArr.length - 1];
    console.log(fileName);
    // 13. 调用execCmd函数，控制台执行 krpanotools makepano 命令，生成全景图文件到 server/public/vtour 目录下
    execCmd(
      "krpanotools makepano -config=templates/vtour-multires.config  " +
        fileName,
      function() {
        console.log("执行完毕");
      }
    );
    // 14. 向前端返回图片名称
    res.status(200).json({
      success: true,
      url: `http://127.0.0.1:${port}/${fileName}`
    });
  });
});

// 15.导入依赖 exec ，用于执行模拟cmd命令
const { exec } = require("child_process");
// 16. 文件管理模块
const fs = require("fs");

console.log("开始执行");

// 17. 创建 nodejs 执行 exe 文件，执行回调
function execCmd(cmd, callback) {
  console.log(cmd);
  var cmd = exec(cmd, function(error, stdout, stderr) {
    if (error) {
      // 18. 如果调取失败，反馈错误信息
      console.log(error.stack);
      console.log("Error code: " + error.code);
      console.log("Signal received: " + error.signal);
    }
    if (stderr) {
      console.log("stderr: " + stderr);
    }
    if (stdout) {
      console.log("stdout: " + stdout);
    }
    callback();
  });
  // 19. 执行完成退出
  cmd.on("exit", function(code) {
    console.log("子进程已退出，退出码 " + code);
  });
}

// 20. 接口：响应 /showpano 请求，挂载 server/public/vtour/tour.html，便于直接访问全景图
// 在浏览器中输入 http://127.0.0.1:8081/showpano 即可访问全景图
app.get("/showpano", (req, res) => {
  // __dirname 表示当前文件所在的目录，要用绝对路径
  res.sendFile(__dirname + "/server/public/vtour/tour.html");
});

// 监听端口
app.listen(port, () => {
  console.log(`starting...${port}`);
});

// 接口：获取全景图
// app.post("/display", (req, res) => {
//   //   console.log(req.query);

//   var surl = "vtour-img/vtour/" + req.query.file;
//   var type = surl.substr(surl.lastIndexOf(".") + 1, surl.length);
//   //   设置writeHead(200, { "Content-type": "text/" + type });
//   //   res.writeHead(200, { "Content-type": "text/" + type });
//   var ns = fs.readFile(surl, function(err, data) {
//     if (err) {
//       console.error(err);
//       // 返回失败
//       //   response.end("404");
//       res.status(200).json({
//         success: false
//       });
//       return;
//     }
//     // 返回 data
//     res.status(200).json({
//       data: data
//     });
//   });
// });
