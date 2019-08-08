const { Service } = require("egg");
const svgCaptcha = require("svg-captcha");
const md5 = require("md5");
const fs = require("fs");
const path = require("path");
const awaitWriteStream = require("await-stream-ready").write;
const sendToWormhole = require("stream-wormhole");
var mkdirp = require("mkdirp");
var dateFormat = require("dateformat");
var pump = require("pump");
var Jimp = require("jimp");
class ToolService extends Service {
  async captcha(width, height, fontSize) {
    let w = width ? width : 150;
    let h = height ? height : 50;
    let f = fontSize ? fontSize : 50;
    var captcha = svgCaptcha.create({
      size: 4,
      width: w,
      height: h,
      fontSize: f
    });
    return captcha;
  }
  async md5(content) {
    return md5(content);
  }
  async md5Secret(content, secret) {
    //console.log('content===='+content);
    //console.log('secret===='+secret);
    //console.log('md5(content+secret)===='+md5(content+secret));
    return md5(content + secret);
  }
  async randomNumber() {
    return Math.floor(Math.random() * 9000 + 1000);
  }
  // 上传文件 重命名，返回 数据库路径&上传文件路径
  async filePath(file_name) {
    let uploadBaseDir = this.app.config.uploadbasedir;
    let dateDir = dateFormat(new Date(), "yyyymmdd"); //helper转化时间
    let baseDir = path.join(uploadBaseDir, dateDir); //拼接路径path.join
    await mkdirp(baseDir);
    const filename =
      Date.now() +
      Math.floor(Math.random() * 9000 + 1000) +
      path.extname(file_name); //创建上传文件名 统一名称 不能重复,时间戳
    var targetPath = path.join(baseDir, filename); //app/public/admin/upload/.....文件上传地址
    var dbPath = targetPath.slice(3).replace(/\\/g, "/"); //处理字符串，形成public路径
    return { targetPath: targetPath, dbPath: dbPath };
  }
  //上传文件
  async uploadFile(fromStream, targetPath) {
    //写入流
    var writestream = fs.createWriteStream(targetPath);
    // var source = fs.createReadStream('/view/admin/common/aside.html')
    // console.log(source);

    // pump(fromStream, writestream, function(err) {
    //   console.log('pipe finished', err)
    // })

    try {
      await awaitWriteStream(fromStream.pipe(writestream));
    } catch (error) {
      await sendToWormhole(fromStream);
      throw error;
    } finally {
      await sendToWormhole(fromStream);
    }
  }
  //压缩文件
  async jimp(targetPath) {
    Jimp.read(targetPath)
      .then(lenna => {
        return lenna
          .resize(200, 200)
          .quality(60)
          .greyscale()
          .write(targetPath + "_200x200" + path.extname(targetPath));
      })
      .catch(err => {
        console.log(err);
      });
  }
}
module.exports = ToolService;
