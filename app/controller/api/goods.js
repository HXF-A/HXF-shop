const BaseController = require("../admin/base");

class goodsController extends BaseController {
  async goodsList() {
    let goodsList = [
      { goodsname: "han", price: 19 },
      { goodsname: "han", price: 19 },
      { goodsname: "han", price: 19 },
      { goodsname: "han", price: 19 }
    ];
    this.ctx.body = goodsList;
  }
}
module.exports = goodsController;
