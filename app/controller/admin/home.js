const md5 = require("md5");
const BaseController = require("./base");
class HomeController extends BaseController {
  //显示主页面
  async index() {
    var userinfo = this.ctx.session.userinfo;
    //console.log(userinfo);
    await this.ctx.render("admin/home/home");
  }
  async welcome() {
    await this.ctx.render("admin/home/welcome");
  }
}
module.exports = HomeController;
