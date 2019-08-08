var dateFormat = require("dateformat");
var path = require('path')
module.exports = {
  //时间戳转化
  dateFormat(timestamp) {
    return dateFormat(new Date(timestamp), "yyyy-mm-dd HH:MM:ss");
  },
  //生成压缩图片地址
  url200(dbPath){
    return dbPath+'_200x200'+path.extname(dbPath)
  }
};
