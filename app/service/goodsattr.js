const { Service } = require("egg");
class GoodsAttrService extends Service {
    //增加商品属性
  async insert(body) {
    try {
      var goodsAttrModel = new this.ctx.model.GoodsAttr(body);
      await goodsAttrModel.save();
      return { flag: true, msg: "增加商品属性成功" };
    } catch (error) {
      return { flag: false, msg: "增加商品属性失败" };
    }
  }
  //根据商品goods_id查询所有商品属性
  async findByGoodsId(goods_id) {
    try {
        var goods_obj_id = this.app.mongoose.Types.ObjectId(goods_id)
        
      var goodsAttrs = await this.ctx.model.GoodsAttr.find({
        goods_id: goods_obj_id
      }).sort({ data_sort: 1 });
      return { flag: true, data: goodsAttrs, msg: "查询所有商品属性成功" };
    } catch (error) {
      return { flag: false, msg: "查询所有商品属性成功失败" };
    }
  }
  //根据商品type_id查询所有商品属性
  async findByTypeId(type_id) {
    try {
      var goodsAttrs = await this.ctx.model.GoodsAttr.find({
        type_id: type_id
      }).sort({ data_sort: 1 });
      //console.log(allAttrs);

      return { flag: true, data: goodsAttrs, msg: "查询所有商品属性成功" };
    } catch (error) {
      return { flag: false, msg: "查询所有商品属性成功失败" };
    }
  }
  async deleteByGoodsId(goods_id){
    try {
        await this.ctx.model.GoodsAttr.deleteMany({goods_id:goods_id})
        return {flag:true,msg:'删除更新所有商品属性成功'}
    } catch (error) {
      return {flag:false,msg:'删除更新所有商品属性失败'}
    }
  }

}
module.exports = GoodsAttrService;
