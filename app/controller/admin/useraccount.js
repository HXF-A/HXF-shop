const BaseController = require("./base");
class UseraccountController extends BaseController {
  //listaccount显示
  async list() {
    const { ctx } = this;
    var result = await ctx.service.user.findAllAccount();
    if (result.flag) {
      var useraccounts = result.data;
      await ctx.render("admin/user/listaccount", { useraccounts });
    } else {
      ctx.body = result.msg;
    }
  }
  async edit() {
    //const {ctx} = this
    var _id = this.ctx.request.query._id;
    var result = await this.ctx.service.user.findAllAccountById(_id);
    if (result.flag) {
      var useraccount = result.data;
      await this.ctx.render("admin/user/editaccount", { useraccount });
    } else {
      this.ctx.body = result.msg;
    }
  }
  //修改操作
  async doEdit() {
    var body = this.ctx.request.body;
    var _id = body._id;
    var pwd = body.login_pwd;
    if (pwd) {
      var useraccount = {
        login_name: body.login_name,
        login_pwd: await this.ctx.service.tool.md5(body.login_pwd),
        user_status: body.user_status
      };
    } else {
      var useraccount = {
        login_name: body.login_name,
        user_status: body.user_status
      };
    }
    var result = await this.ctx.service.user.accountUpdata(_id, useraccount);
    if (result.flag) {
      await this.success("/admin/useraccount", result.msg);
    } else {
      await this.fail("/admin/useraccount", result.msg);
    }
  }
}
module.exports = UseraccountController;
