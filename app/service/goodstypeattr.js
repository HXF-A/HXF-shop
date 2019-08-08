const { Service } = require("egg");
class GoodsTypeAttrService extends Service {
  async insert(body) {
    try {
      var goodsTypeAttrModel = new this.ctx.model.GoodsTypeAttr(body);
      await goodsTypeAttrModel.save();
      return { flag: true, msg: "attr保存成功" };
    } catch (error) {
      return { flag: false, msg: "attr保存失败" };
    }
  }
  async findAllByTypeId(type_id) {
    try {
      var allAttrs = await this.ctx.model.GoodsTypeAttr.find({
        type_id: type_id
      }).sort({data_sort:1});
      //console.log(allAttrs);
      
      return { flag: true, data: allAttrs, msg: "依据type查询" };
    } catch (error) {
      return { flag: false, msg: "依据type查询失败" };
    }
  }
  async findWithtype(attr_id) {
    var attr_id = this.app.mongoose.Types.ObjectId(attr_id);
    try {
      var attrwithType = await this.ctx.model.GoodsTypeAttr.aggregate([
        {
          $match: {
            _id: attr_id
          }
        },
        {
          $lookup: {
            from: "goods_type",
            localField: "type_id",
            foreignField: "_id",
            as: "goodstype"
          }
        }
      ]);
      return { flag: true, data: attrwithType[0], msg: "属性关联查询成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，属性关联失败" };
    }
  }
  //修稿更新
  async update(_id, goodstypeattr) {
    try {
      await this.ctx.model.GoodsTypeAttr.update({ _id: _id }, goodstypeattr);
      return { flag: true, msg: "修改goodstypeattr更新成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常修改goodstypeattr失败" };
    }
  }
  async delete(_id) {
    try {
      await this.ctx.model.GoodsTypeAttr.deleteOne({ _id: _id });
      return { flag: true, msg: "删除属性成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常删除商品属性规格失败" };
    }
  }
}
module.exports = GoodsTypeAttrService;
