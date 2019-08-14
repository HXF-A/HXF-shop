const { Service } = require("egg");
const fs = require("fs");
class AdvertiseService extends Service {
  //增加广告
  async insert(parts) {
    try {
      var fromStream;
      var adsImg = [];
      while ((fromStream = await parts()) != null) {
        if (fromStream && fromStream.filename) {
          var filePath = await this.service.tool.filePath(fromStream.filename); //找到tergetPath目标路径与dbPath相对路径
          await this.ctx.service.tool.uploadFile(
            fromStream,
            filePath.targetPath
          ); //上传来源流
          adsImg.push(filePath.dbPath); //将相对路径传入整个数组中/
          //图片压缩
          await this.ctx.service.tool.jimp(filePath.targetPath);
        } else {
          continue;
        }
      }
      var body = parts.field; //多个文件的数据
      Object.assign(body, { ads_img: adsImg });
      var advertiseModel = new this.ctx.model.Advertise(body);
      await advertiseModel.save();
      return { flag: true, msg: "免费赞助广告添加成功" };
    } catch (error) {
      return { flag: false, msg: "免费赞助广告添加失败" };
    }
  }
  //查找全部
  async findAll() {
    try {
      var advertises = await this.ctx.model.Advertise.find({}).sort({data_sort:1});
      return { flag: true, data: advertises, msg: "查找全部广告成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，查找全部广告失败" };
    }
  }
  //通过id查找
  async findById(_id) {
    try {
      var advertises = await this.ctx.model.Advertise.findById(_id);
      return { flag: true, data: advertises, msg: "通过id查找广告成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，通过id查找广告失败" };
    }
  }
  async update(parts) {
    try {
      var fromStream;
      var advertiseLogos = [];
      while ((fromStream = await parts()) != null) {
        var body = parts.field;
        var _id = body._id;
        if (!fromStream.filename) {
          await this.ctx.model.Advertise.update({ _id: _id }, body);
          return { flag: true, msg: "修改商品广告成功（没传照片版）" };
        }
        if (fromStream.filename) {
          var filePath = await this.ctx.service.tool.filePath(
            fromStream.filename
          );
          await this.ctx.service.tool.uploadFile(
            fromStream,
            filePath.targetPath
          );
          advertiseLogos.push(filePath.dbPath);
          await this.ctx.service.tool.jimp(filePath.targetPath);
          Object.assign(body, { ads_img: advertiseLogos });
          var object = await this.ctx.model.Advertise.findOne(
            { _id: _id },
            { _id: 0, ads_img: 1 }
          );
          var adsLogo = object.ads_img;
          if (adsLogo) { 
            adsLogo.forEach(element => {
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
        await this.ctx.model.Advertise.update({ _id: _id }, body);
        return { flag: true, msg: "修改商品广告成功（传照片版）" };
      }
    } catch (error) {
      return { flag: false, msg: "数据异常，修改商品广告失败" };
    }
  }
  //删除操作
  async delete(_id){
    try {
       var deleteObject = await this.ctx.model.Advertise.findOne({_id:_id},{
      _id:0,ads_img:1
    })
    var adsLogo =  deleteObject.ads_img
    if(adsLogo){
      adsLogo.forEach(element => {
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
    await this.ctx.model.Advertise.deleteOne({_id:_id})
    return {flag:true,msg:'删除商品广告成功'}
    } catch (error) {
      return {flag:false,msg:'数据异常，删除商品广告失败'}
    }
  }
}
module.exports = AdvertiseService;
