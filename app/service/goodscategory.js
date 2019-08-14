//总体字段还有问题data_status与cate_status
const { Service } = require("egg");
class GoodsCategoryService extends Service {
  async find() {
    try {
      var cate_idattr = await this.ctx.model.GoodsCategory.find({});
      return { flag: true, data: cate_idattr, msg: "cate——id成功" };
    } catch (error) {
      return { flag: false, msg: "cate——id失败" };
    }
  }
  //findAll关联查询，自我关联，分类
  async findAll() {
    try {
      var goodscategorys = await this.ctx.model.GoodsCategory.aggregate([
        {
          $lookup: {
            from: "goods_category",
            localField: "_id",
            foreignField: "cate_pid",
            as: "subCategorys"
          }
        },
        {
          $match: {
            cate_pid: "0",
            data_status: 1
          }
        },
        //按照条件查找
        {
          $project: {
            _id: 1,
            cate_name: 1,
            cate_icon: 1,
            cate_keys: 1,
            cate_desc: 1,
            cate_url:1,
            cate_template: 1,
            cate_status: 1,
            data_sort: 1,
            data_status: 1,
            cate_pid: 1,
            //！！！！！！！
            subCategorys: {
              $filter: {
                input: "$subCategorys",
                as: "item",
                cond: { $eq: ["$$item.data_status", 1]},//条件
                
              },
            
            }

          }
        }
      ]).sort({ data_sort: 1 });
      return { flag: true, data: goodscategorys, msg: "查找全部分类成功" };
    } catch (error) {
      return { flag: false, msg: "查找全部分类失败" };
    }
  }
  //findById
  async findById(_id) {
    try {
      var categoryAttr = await this.ctx.model.GoodsCategory.find({
        _id: _id
      });
      return { flag: true, data: categoryAttr, msg: "依据id查找分类成功" };
    } catch (error) {
      return { flag: false, msg: "查找失败，数据异常分类失败" };
    }
  }
  //查找全部顶级分类
  async findAllTopCates() {
    try {
      var topCates = await this.ctx.model.GoodsCategory.find({
        cate_pid: "0",
        data_status: 1
      });
      return { flag: true, data: topCates, msg: "查询顶级模块成功" };
    } catch (error) {
      return { flag: false, msg: "查询顶级模块失败" };
    }
  }
  //增加数据库数据
  async insert(goodscategory) {
    try {
      var goodsCategoryModel = new this.ctx.model.GoodsCategory(goodscategory);
      await goodsCategoryModel.save();
      return { flag: true, msg: "goodsCategory保存成功" };
    } catch (error) {
      return { flag: false, msg: "goodsCategory保存失败数据异常" };
    }
  }
  //修改商品分类操作
  async update(_id, goodscatetory) {
    try {
      await this.ctx.model.GoodsCategory.update({ _id: _id }, goodscatetory);
      return { flag: true, msg: "修改商品类型成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，修改商品类型失败" };
    }
  }
  //删除数据库数据()软删除二
  async delete(_id) {
    try {
      var object = await this.ctx.model.GoodsCategory.findOne(
        {
          _id: _id
        },
        { _id: 0, cate_pid: 1 }
      );

      var catePid = object.cate_pid;
      console.log(catePid);

      if (catePid == "0") {
        var _id = this.app.mongoose.Types.ObjectId(_id);
        var a = await this.ctx.model.GoodsCategory.updateMany(
          { cate_pid: _id },
          { data_status: 0 }
        );
        var b = await this.ctx.model.GoodsCategory.updateOne(
          { _id: _id },
          { data_status: 0 }
        );
        console.log(JSON.stringify(a) + "xxxxx" + JSON.stringify(b));
      } else {
        await this.ctx.model.GoodsCategory.updateOne(
          { _id: _id },
          { data_status: 0 }
        );
      }

      return { flag: true, msg: "按照ID删除成功" };
    } catch (error) {
      return { flag: false, msg: "按照ID删除失败" };
    }
  }
  //软删除操作
  async softDelete(_id) {
    try {
      await this.ctx.model.GoodsCategory.updateOne(
        { _id: _id },
        { $set: { data_status: 0 } }
      );
      return { flag: true, msg: "软删除分类成功" };
    } catch (error) {
      return { falg: false, msg: "数据异常，软删除分类失败" };
    }
  }
}
module.exports = GoodsCategoryService;
