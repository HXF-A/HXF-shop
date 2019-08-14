const BaseController = require("./base");
class GoodsCateGoryController extends BaseController {
  //list显示
  async list() {
    const { ctx } = this;
    var result = await ctx.service.goodscategory.findAll();
    if (result.flag) {
      var categorys = result.data;
      await ctx.render("admin/goodscategory/list", { categorys });
    } else {
      ctx.body = result.msg;
    }
  }
  //增加列表显示
  async add() {
    const { ctx } = this;
    var result = await ctx.service.goodscategory.findAllTopCates();
    if (result.flag) {
      var topcategorys = result.data;
      await ctx.render("admin/goodscategory/add", { topcategorys });
    }
  }
  //增加列表操作
  async doAdd() {
    const { ctx } = this;
    var body = ctx.request.body;
    var cate_pid = body.cate_pid;
    if (cate_pid != 0) {
      body.cate_pid = this.app.mongoose.Types.ObjectId(cate_pid);
    }
    var result = await ctx.service.goodscategory.insert(body);
    if (result.flag) {
      await this.success("/admin/goodscategory", result.msg);
    } else {
      await this.fail("/admin/goodscategory".result.msg);
    }
  }
  //修改页面显示
  async edit() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var cateTopResult = await ctx.service.goodscategory.findAllTopCates();
    var cateResult = await ctx.service.goodscategory.findById(_id);
    if (cateTopResult.flag && cateResult.flag) {
      var cate = cateResult.data[0];
      var topCates = cateTopResult.data;
      await ctx.render("admin/goodscategory/edit", { cate, topCates });
    } else {
      await this.fail("/admin/goodscategory", result.msg);
    }
  }
  //修改页面操作
  async doEdit() {
    const { ctx } = this;
    var body = ctx.request.body;
    var _id = body._id;
    var cate_pid = body.cate_pid;
    if (cate_pid != 0) {
      body.cate_pid = this.app.mongoose.Types.ObjectId(cate_pid);
    }
    var result = await ctx.service.goodscategory.update(_id, body);
    if (result.flag) {
      await this.success("/admin/goodscategory", result.msg);
    } else {
      await this.fail("/admin/goodscategory", result.msg);
    }
  }
  //删除页面操作
  async delete() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var result = await ctx.service.goodscategory.delete(_id);
    if (result.flag) {
      await this.success(ctx.locals.lastPage, result.msg);
    } else {
      await this.fail(ctx.locals.lastPage, result.msg);
    }
  }
}
module.exports = GoodsCateGoryController;
