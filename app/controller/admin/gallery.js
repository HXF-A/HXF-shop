const BaseController = require("./base");
const sendToWormhole = require('stream-wormhole');
class GalleryController extends BaseController {
  //增加列表显示
  async upload() {
    const { ctx } = this;
    await ctx.render("admin/goods/uploadajax");
  }
  //增加列表操作
  async doUpload() {
    //const fromStream = await this.ctx.getFileStream();
    //多文件上传
     var parts = await this.ctx.multipart({autoFields:true});//多文件查找流文件
      var result = await this.ctx.service.goods.upload(parts);
      if (result.flag) {
        var gallerys = result.data
        //接口返回数据
        this.ctx.body = {gallerys:gallerys}
      } else {
        var msg = result.mag
        this.ctx.body = {msg:msg}
      }
  }
}
module.exports = GalleryController;
