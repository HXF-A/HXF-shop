const { Service } = require("egg");
const fs = require("fs");
class GalleryService extends Service {
  async upload(parts) {
    try {
      var fromStream;
      var gallerys = [];
      while ((fromStream = await parts()) != null) {
        if (fromStream.filename) {
          var filePath = await this.service.tool.filePath(fromStream.filename); //找到tergetPath目标路径与dbPath相对路径
          //filePath：{ targetPath: 'app/public/admin/upload/20190726/1564110932558.jpg',   dbPath: '/public/admin/upload/20190726/1564110932558.jpg' }
          await this.ctx.service.tool.uploadFile(
            fromStream,
            filePath.targetPath
          ); //上传来源流
          gallerys.push(filePath.dbPath);
        } else {
          continue;
        }
      }
      //console.log(gallerys);
      //var body = parts.field;
      // body.goods_gallery = gallerys;
      //Object.assign(body, { goods_gallery: gallerys });
      // var goodsModel = new this.ctx.model.Goods(body);
      // await goodsModel.save();

      return { flag: true, data:gallerys,msg: "商品保存成功" };
    } catch (error) {
      return { flag: false, msg: "商品保存失败" };
    }
  }
}

module.exports = GalleryService;
