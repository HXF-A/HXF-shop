const BaseController = require("./base");
class UserRankController extends BaseController {
  //显示页面
  async list() {
    var result = await this.ctx.service.userrank.findAll();
    if (result.flag) {
      var userranks = result.data;
      await this.ctx.render("admin/userrank/list", { userranks });
    } else {
      await this.fail("/admin/userrank", result.msg);
    }
  }
  //添加页面
  async add() {
    await this.ctx.render("admin/userrank/add");
  }
  //添加会员
  async doAdd() {
    const { ctx } = this;
    var body = ctx.request.body;
    var result = await this.ctx.service.userrank.insert(body);
    if (result.flag) {
      await this.success("/admin/userrank", result.msg);
    } else {
      await this.fail("/admin/userrank/add", result.msg);
    }
  }
  // 修改页面
  async edit() {
    var _id = this.ctx.request.query._id;
    var result = await this.ctx.service.userrank.findById(_id);
    if (result.flag) {
      var userrank = result.data;
      await this.ctx.render("admin/userrank/edit", { userrank });
    } else {
      await this.fail("/admin/userrank", result.msg);
    }
  }
  //修改保存会员
  async doEdit() {
    const { ctx } = this;
    var body = ctx.request.body;
    var _id = body._id;
    var result = await this.ctx.service.userrank.update(_id, body);
    if (result.flag) {
      await this.success("/admin/userrank", result.msg);
    } else {
      await this.fail("/admin/userrank", resulr.msg);
    }
  }
  //删除操作
  async delete() {
    const { ctx } = this;
    var _id = this.ctx.request.query._id;
    var result = await this.ctx.service.userrank.delete(_id);
    if (result.flag) {
      await this.success(ctx.locals.lastPage, result.msg);
    } else {
      await this.fail(ctx.locals.lastPage, result.msg);
    }
  }
}
module.exports = UserRankController;
