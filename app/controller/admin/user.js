const BaseController = require("./base");

class UserController extends BaseController {
  //显示会员列表
  async list() {
    const { ctx } = this;
    var result = await ctx.service.user.findAll();
    if (result.flag) {
      var users = result.data;
      await ctx.render("admin/user/list", { users });
    } else {
      await this.fail(ctx.locals.lastPage, result.msg);
    }
  }
  //修改
  async edit() {
    var _id = this.ctx.request.query._id;
    var result = await this.ctx.service.user.findById(_id);
    if (result.flag) {
      var user = result.data;
      await this.ctx.render("admin/user/edit", { user });
    } else {
      await this.fail("/admin/user", result.msg);
    }
  }
  //修改保存
  async doEdit() {
    const { ctx } = this;
    var body = ctx.request.body;
    var _id = body._id;
    var result = await this.ctx.service.user.update(_id, body);
    if (result.flag) {
      await this.success("/admin/user", result.msg);
    } else {
      await this.fail("/admin/user", result.msg);
    }
  }
  //删除操作
  async delete() {
    const { ctx } = this;
    var _id = await this.ctx.request.query._id;
    var result = await this.ctx.service.user.delete(_id);
    if (result.flag) {
      await this.success(ctx.locals.lastPage, result.msg);
    } else {
      await this.fail(ctx.locals.lastPage, result.msg);
    }
  }
}
module.exports = UserController;
