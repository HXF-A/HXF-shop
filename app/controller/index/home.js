const BaseController = require("../admin/base");
class IndexController extends BaseController {
  async index() {
    //主页
    const { ctx } = this;
    //导航
    var navMiddleResult = await ctx.service.navigation.findNavPosition(2);
    var navBottomResulrt = await ctx.service.navigation.findNavPosition(3)
    var adsTopResult = await ctx.service.advertise.findAdsPosition(1,3);
    var adsMiddleResult = await ctx.service.advertise.findAdsPosition(2,3);
    //商品
    var goodsHotResult = await ctx.service.goods.findGoodsIs("is_hot", 4);
    var goodsNewResult = await ctx.service.goods.findGoodsIs("is_new", 4);
    var goodsBestResult = await ctx.service.goods.findGoodsIs("is_best", 4);
    if (
      navMiddleResult &&
      navBottomResulrt &&
      adsTopResult &&
      adsMiddleResult &&
      goodsHotResult &&
      goodsNewResult &&
      goodsBestResult
    ) {
      var navigationMiddles = navMiddleResult.data
      var navigationBottoms = navBottomResulrt.data
      var advertiseTops = adsTopResult.data
      var advertiseSub = adsMiddleResult.data
      var goodsHot = goodsHotResult.data
      var goodsNew = goodsNewResult.data
      var goodsBest = goodsBestResult.data
      //console.log(navigationMiddle+'====='+advertiseTops+'===='+advertiseSub+'===='+goodsHot+'====='+goodsNew+'===='+goodsBest);
       await this.ctx.render("index/index/home", {
        navigationBottoms,
        navigationMiddles,
        advertiseTops,
        advertiseSub,
        goodsHot,
        goodsNew,
        goodsBest,
      });
    }
  }
}
module.exports = IndexController;
