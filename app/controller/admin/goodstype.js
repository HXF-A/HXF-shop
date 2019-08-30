const BaseController = require("./base");

class GoodsTypeController extends BaseController {
  //商品类型列表
  async list() {
    const { ctx } = this;
    var result = await ctx.service.goodstype.findAll();
    if (result.flag) {
      var goodstypes = result.data;
      //console.log(JSON.stringify(goodstypes));
      await ctx.render("admin/goodstype/list", { goodstypes });
    } else {
      ctx.body = result.msg;
    }
  }
  //增加商品类型
  async add() {
    await this.ctx.render("admin/goodstype/add");
  }
  //增加商品类型操作
  async doAdd() {
    const { ctx } = this;
    var body = ctx.request.body;
    var attrString = body.attr_group;
    var attr_group = attrString.trim().split("\r\n"); //将String转化为数组形式保存
    //重新将goodstype封装
    var goodstype = {
      type_name: body.type_name,
      attr_group: attr_group
    };
    var result = await this.ctx.service.goodstype.insert(goodstype);
    if (result.flag) {
      await this.success("/admin/goodstype", result.msg);
    } else {
      await this.fail("/admin/goodstype/add", result.msg);
    }
  }
  async edit() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var result = await ctx.service.goodstype.findById(_id);
    if (result.flag) {
      var goodstype = result.data;
      await ctx.render("admin/goodstype/edit", { goodstype });
    } else {
      await ctx.fail("/admin/goodstype", rsult.msg);
    }
  }
  async doEdit() {
    const { ctx } = this;
    var body = ctx.request.body;
    var attrString = body.attr_group;
    var _id = body._id;
    var attr_group = attrString.trim().split("\r\n"); ///将String转化为数组形式保存
    //重新将goodstype封装
    //用户在输入中无意加入空字符串，删除存储
    for (var i = 1; i < attr_group.length; i++) {
      if (
        attr_group[i] == "" ||
        attr_group[i] == null ||
        typeof attr_group[i] == undefined
      ) {
        attr_group.splice(i, 1);
        i = i - 1;
      }
    }
    //console.log(JSON.stringify(attr_group));
    var goodstype = {
      type_name: body.type_name,
      type_status: body.type_status,
      attr_group: attr_group
    };
    var result = await ctx.service.goodstype.update(_id, goodstype);
    //console.log('==='+JSON.stringify(result));
    if (result.flag) {
      await this.success("/admin/goodstype", result.msg);
    } else {
      await this.fail("/admin/goodstype", result.msg);
    }
  }
  async delete() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    //console.log(_id);
    var result = await ctx.service.goodstype.delete(_id);
    if (result.flag) {
      await this.success(this.ctx.locals.lastPage, result.msg);
    } else {
      await this.fail(this.ctx.locals.lastPage, result.msg);
    }
  }
}
module.exports = GoodsTypeController;
