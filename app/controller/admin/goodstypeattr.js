const BaseControllrr = require("./base");
class GoodsTypeAttrController extends BaseControllrr {
  //商品类型列表
  async list() {
    const { ctx } = this;
    var type_id = ctx.request.query._id;
    var typeResult = await ctx.service.goodstype.findById(type_id);
    var allAttrResult = await ctx.service.goodstypeattr.findAllByTypeId(
      type_id
    );
    if (allAttrResult.flag && typeResult.flag) {
      var goodstypeattrs = allAttrResult.data;
      var goodstype = typeResult.data;
      await ctx.render("admin/goodstypeattr/list", {
        goodstypeattrs,
        goodstype
      });
    } else {
      //这里也有问题需要修改
      await ctx.render("admin/goodstypeattr/list", {
        goodstypeattrs,
        goodstype
      });
    }
  }
  //增加商品属性类型页面
  async add() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var goodstypeResult = await ctx.service.goodstype.findById(_id);
    var goodstypeResults = await ctx.service.goodstype.findAll();
    if (goodstypeResult.flag && goodstypeResults.flag) {
      var formgoodstype = goodstypeResult.data;
      var goodstypes = goodstypeResults.data;
      await ctx.render("admin/goodstypeattr/add", {
        formgoodstype,
        goodstypes
      });
    } else {
      await this.fail("/admin/goodstypeattr", "数据异常显示增加页面失败");
    }
  }
  //增加商品属性类型操作
  async doAdd() {
    const { ctx } = this;
    var body = ctx.request.body;
    var type_id = body.type_id;
    var result = await ctx.service.goodstypeattr.insert(body);
    if (result.flag) {
      await this.success("/admin/goodstypeattr?_id=" + type_id, result.msg);
    } else {
      await this.fail("/admin/goodstypeattr?_id=" + type_id, reuslt.msg);
    }
  }
  //修改页面
  async edit() {
    const { ctx } = this;
    var body = ctx.request.body;
    var attr_id = ctx.request.query._id;
    var type_id = body.type_id;
    var typeIdResult = await ctx.service.goodstypeattr.findWithtype(attr_id); //通过id关联查找goodstype和goodstypeattr
    var goodstypeResults = await ctx.service.goodstype.findAll();
    if (typeIdResult.flag && goodstypeResults.flag) {
      var attr = typeIdResult.data;
      var alltypes = goodstypeResults.data;
      await ctx.render("admin/goodstypeattr/edit", { attr, alltypes });
    } else {
      await this.fail("/admin/goodstypeattr?_id=" + type_id, typeIdResult.msg);
    }
  }
  //修改商品属性操作
  async doEdit() {
    const { ctx } = this;
    var body = ctx.request.body;
    var _id = body._id;
    var type_id = body.type_id;
    var goodstypeattr = {
      attr_name: body.attr_name,
      attr_type: body.attr_type,
      attr_group: body.attr_group,
      data_sort: body.data_sort,
      type_id: body.type_id
    };
    var result = await ctx.service.goodstypeattr.update(_id, goodstypeattr);
    if (result.flag) {
      await this.success("/admin/goodstypeattr?_id=" + type_id, result.msg);
    } else {
      await this.fail("/admin/goodstypeattr/edit?_id=" + _id, result.msg);
    }
  }
  //删除操作
  async delete() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var result = await ctx.service.goodstypeattr.delete(_id);
    if (result.flag) {
      await this.success(this.ctx.locals.lastPage, result.msg);
    } else {
      await this.fail(this.ctx.locals.lastPage, result.msg);
    }
  }
}
module.exports = GoodsTypeAttrController;
