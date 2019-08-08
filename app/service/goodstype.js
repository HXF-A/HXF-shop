const { Service } = require("egg");

class GooddsTypeService extends Service {
  //增加商品类型
  async insert(goodstype) {
    try {
      //调用save时需要将其封装成一个Model对象，传递参数
      var goodsTypeModel = new this.ctx.model.GoodsType(goodstype);
      await goodsTypeModel.save();
      // await this.ctx.model.GoodsType.insertMany(goodstype)
      //await this.ctx.model.GoodsType.creat(goodstype)
      return { flag: true, msg: "增加商品类型成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，增加商品类型失败" };
    }
  }
  //findAll
  async findAll() {
    try {
      var goodstypes = await this.ctx.model.GoodsType.find({});
      return { flag: true, data: goodstypes, msg: "获取所有商品类型成功" };
    } catch (error) {
      return { flag: false, msg: "获取所有商品类型失败" };
    }
  }
  //修改商品类型页面显示
  async findById(_id) {
    try {
      var goodstype = await this.ctx.model.GoodsType.findById(_id);
      if (goodstype) {
        return { flag: true, data: goodstype, msg: "商品id查找成功" };
      }
    } catch (error) {
      return { flag: false, msg: "访问数据异常，商品id查找失败" };
    }
  }
  //修改商品类型操作
  async update(_id, goodstype) {
    try {
      await this.ctx.model.GoodsType.update({ _id: _id }, goodstype);
      return { flag: true, msg: "修改商品类型成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，修改商品类型失败" };
    }
  }
  async delete(_id) {
    try {
      await this.ctx.model.GoodsType.deleteOne({ _id: _id });
      return { flag: true, msg: "删除商品类型成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，删除商品类型失败" };
    }
  }
}
module.exports = GooddsTypeService;
