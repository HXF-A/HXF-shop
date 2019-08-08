const BaseController = require("../admin/base");
class UserController extends BaseController {
  async index() {
    await this.ctx.render("index/user");
  }
}
module.exports = UserController;
