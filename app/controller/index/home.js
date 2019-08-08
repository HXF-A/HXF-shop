const BaseController = require("../admin/base");
class IndexController extends BaseController {
  async index() {
    await this.ctx.render("index/index");
  }
}
module.exports = IndexController;
