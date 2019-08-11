const { Service } = require("egg");
const fs = require("fs");
const path = require("path");
class GoodsBrandService extends Service {
  async insert(parts) {
    try {
      //获取所有字段
      //不完整的body
      //单文件上传
      // var body = fromStream.fields;
      // var filePath = await this.ctx.service.tool.filePath(fromStream.filename);
      // //将brand_logo补全
      // body.brand_logo = filePath.dbPath;
      // //上传来源流
      // await this.ctx.service.tool.uploadFile(fromStream, filePath.targetPath);

      //多文件上传
      var fromStream;
      var brandLogos = [];
      while ((fromStream = await parts()) != null) {
        if (fromStream && fromStream.filename) {
          //filePath  <=fromStream(fromStream.filename)方法返回
          var filePath = await this.service.tool.filePath(fromStream.filename); //找到tergetPath目标路径与dbPath相对路径
          //filePath：{ targetPath: 'app/public/admin/upload/20190726/1564110932558.jpg',   dbPath: '/public/admin/upload/20190726/1564110932558.jpg' }
          await this.ctx.service.tool.uploadFile(
            fromStream,
            filePath.targetPath
          ); //上传来源流
          brandLogos.push(filePath.dbPath); //将相对路径传入整个数组中/
          //图片压缩
          await this.ctx.service.tool.jimp(filePath.targetPath);
        } else {
          continue;
        }
      }
      var body = parts.field; //多个文件的数据
      Object.assign(body, { brand_logo: brandLogos }); //将body补全，通过合并对象方法Object.assign将处理好的brandLogos放进body
      var goodsBrandModel = new this.ctx.model.GoodsBrand(body);
      await goodsBrandModel.save();
      return { flag: true, msg: "品牌保存成功" };
    } catch (error) {
      return { flag: false, msg: "品牌保存失败" };
    }
  }
  //修改
  //存在问题

  async update(parts) {
    try {
      var fromStream;
      var brandLogos = [];
      while ((fromStream = await parts()) != null) {
        var body = parts.field;
        var _id = body._id;
        if (!fromStream.filename) {
          //注意如果没有传入图片直接返回
          await this.ctx.model.GoodsBrand.update({ _id: _id }, body);
          return { flag: true, msg: "修改商品品牌成功" };
        }
        
        if (fromStream.filename) {
          var filePath = await this.service.tool.filePath(fromStream.filename); //找到tergetPath目标路径与dbPath相对路径
          await this.ctx.service.tool.uploadFile(
            fromStream,
            filePath.targetPath
          ); //上传来源流
          brandLogos.push(filePath.dbPath);
          await this.ctx.service.tool.jimp(filePath.targetPath);
          Object.assign(body, { brand_logo: brandLogos });
          var object = await this.ctx.model.GoodsBrand.findOne(
            { _id: _id },
            { _id: 0, brand_logo: 1 }
          );
          var brandLogo = object.brand_logo;
          if (brandLogo) {
            brandLogo.forEach(element => {
              var path1 = "app" + element;
              var path2 = this.ctx.helper.url200(path1);
              if (fs.existsSync(path1)) {
                fs.unlinkSync(path1);
              }
              if (fs.existsSync(path2)) {
                fs.unlinkSync(path2);
              }
            });
          }
        } else {
          break;
        }
      }
      await this.ctx.model.GoodsBrand.update({ _id: _id }, body);
      return { flag: true, msg: "修改商品品牌成功" };
    } catch (error) {
      return { flag: false, msg: "修改商品品牌失败" };
    }
  }
  //查找全部品牌
  async findAll() {
    try {
      var goodsBrands = await this.ctx.model.GoodsBrand.find();
      return { flag: true, data: goodsBrands, msg: "查询品牌成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，查询商品失败" };
    }
  }
  //findById查找
  async findById(_id) {
    try {
      var goodsBrandFindById = await this.ctx.model.GoodsBrand.findById({
        _id: _id
      });
      return {
        flag: true,
        data: goodsBrandFindById,
        msg: "通过商品ID查询品牌成功"
      };
    } catch (error) {
      return { flag: false, msg: "通过商品ID查询品牌失败" };
    }
  }
  //删除文件
  async delete(_id) {
    try {
      var object = await this.ctx.model.GoodsBrand.findOne(
        { _id: _id },
        { _id: 0, brand_logo: 1 }
      );
      var brandLogo = object.brand_logo;
      if (brandLogo) {
        brandLogo.forEach(element => {
          var path1 = "app" + element;
          var path2 = this.ctx.helper.url200(path1);
          fs.unlinkSync(path2);
          fs.unlinkSync(path1);
        });
      }
      //单文件上传
      //var tergetPath = "app" + brandLogo;
      await this.ctx.model.GoodsBrand.deleteOne({ _id: _id });
      return { flag: true, msg: "删除属性成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常删除商品属性规格失败" };
    }
  }
}
module.exports = GoodsBrandService;
