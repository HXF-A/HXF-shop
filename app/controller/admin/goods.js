const BaseController = require("./base");
class GoodsController extends BaseController {
  //list页面
  async list() {
    const { ctx } = this;
    var page = ctx.request.query.page || 1;
    var pageSize = 2;
    var result = await ctx.service.goods.findAllwithPage(page, pageSize);
    if (result.flag) {
      var goodss = result.data.goodss;
      var totalPage = result.data.totalPage;
      var page = result.data.page;
      await ctx.render("admin/goods/list", { goodss, totalPage, page });
    } else {
      ctx.body = result.msg;
    }
  }
  //小型测试
  async upload() {
    await this.ctx.render("admin/goods/upload");
  }
  //增加，查找商品品牌，分类，类型的id将商品信息渲染到页面
  async add() {
    const { ctx } = this;
    var typeResult = await ctx.service.goodstype.findAll();
    var brandResult = await ctx.service.goodsbrand.findAll();
    var cateResult = await ctx.service.goodscategory.findAll();
    if (typeResult.flag && cateResult.flag && brandResult.flag) {
      var types = typeResult.data;
      var brands = brandResult.data;
      var cates = cateResult.data;
      await ctx.render("admin/goods/add", { types, cates, brands });
    } else {
      await this.fail("/admin/goods", "增加显示页面失败");
    }
  }
  //商品增加处理
  async doAdd() {
    var fromStream = await this.ctx.getFileStream({ requireFile: false });
    var result = await this.ctx.service.goods.insert(fromStream);
    if (result.flag) {
      await this.success("/admin/goods", result.msg);
    } else {
      await this.fail("/admin/goods/add", result.msg);
    }
  }
  //详细描述图片处理
  async doUpload() {
    var parts = await this.ctx.multipart({ autoFields: true }); //多文件查找流文件
    var result = await this.ctx.service.goods.upload(parts);
    if (result.flag) {
      var links = result.data;
      //插件规范必须使用link传值，使用多文件上传返回数组需要具体的对象
      this.ctx.body = { link: links[0] };
    } else {
      var msg = result.mag;
      this.ctx.body = { msg: msg };
    }
  }
  //页面处理获取type_id，
  async change() {
    var _id = this.ctx.request.query.type_id;
    var result = await this.ctx.service.goodstypeattr.findAllByTypeId(_id);
    if (result.flag) {
      var data = result.data;
      this.ctx.body = { data: data };
    } else {
      this.ctx.body = "12345678";
    }
  }
  //修改页面显示
  async edit() {
    const { ctx } = this;
    var typeResult = await ctx.service.goodstype.findAll();
    var brandResult = await ctx.service.goodsbrand.findAll();
    var cateResult = await ctx.service.goodscategory.findAll();
    var goods_id = ctx.request.query._id;
    var goodsResult = await ctx.service.goods.findById(goods_id);
    var lastPage = ctx.locals.lastPage;
    //规格回显
    var goodsattr = "";
    //console.log(goods_id);

    var goodsAttrResult = await ctx.service.goodsattr.findByGoodsId(goods_id);
    //console.log("xxxxxx" + JSON.stringify(goodsAttrResult));

    if (goodsAttrResult.flag) {
      var goodsAttrs = goodsAttrResult.data;
      for (var i = 0; i < goodsAttrs.length; i++) {
        if (goodsAttrs[i].attr_type == 1) {
          //1:唯一属性2:单选3:复选
          goodsattr +=
            "<li><span>" +
            goodsAttrs[i].attr_name +
            ': </span><input type="hidden" name="attr_id_list" value="' +
            goodsAttrs[i].attr_id +
            '" />  <input type="text" name="attr_value_list" value="' +
            goodsAttrs[i].attr_value +
            '"/></li>';
        } else {
          goodsattr +=
            "<li><span>" +
            goodsAttrs[i].attr_name +
            ': </span><input type="hidden" name="attr_id_list" value="' +
            goodsAttrs[i].attr_id +
            '" />';
          goodsattr += '<textarea name="attr_value_list"  rows="5" cols="30">';
          for (const value of goodsAttrs[i].attr_value) {
            goodsattr += value + "\r\n";
          }

          goodsattr += "</textarea> ";
          goodsattr += "</li>";
        }
      }
    }
    if (
      typeResult.flag &&
      cateResult.flag &&
      brandResult.flag &&
      goodsResult.flag
    ) {
      var types = typeResult.data;
      var brands = brandResult.data;
      var cates = cateResult.data;
      var goods = goodsResult.data;
      await ctx.render("admin/goods/edit", {
        goods,
        types,
        brands,
        cates,
        goodsattr,
        lastPage
      });
    } else {
      await this.fail("/admin/goods/list");
    }
  }

  //
  async deleteImg() {
    var { ctx } = this;
    var goods_id = ctx.request.query._id;
    var img_url = ctx.request.query.img_url;
    var result = await ctx.service.goods.deleteImg(goods_id, img_url);
    if (result.flag) {
      ctx.body = { flag: true, msg: result.msg };
    } else {
      ctx.body = { flag: false, msg: result.msg };
    }
  }
  async doEdit() {
    const { ctx } = this;
    var fromStream = await ctx.getFileStream({ requireFile: false });
    var lastPage = fromStream.fields.lastPage;
    var result = await ctx.service.goods.update(fromStream);
    //console.log('vvvvvvv'+JSON.stringify(result));
    if (result.flag) {
      await this.success(lastPage, result.msg);
    } else {
      await this.fail(ctx.locals.lastPage, result.msg);
    }
  }
  async deleteUpdate() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var result = await ctx.service.goods.deleteUpdate(_id);
    if (result.flag) {
      await this.success(this.ctx.locals.lastPage, result.msg);
    } else {
      await this.fail(this.ctx.locals.lastPage, result.msg);
    }
  }
  async delete() {

    //删除文件goods_img，relate_gallerys，goods_desc
    //删除关联表
    //删除goods
    const { ctx } = this;
    var _id = ctx.request.query._id
    var result = await ctx.service.goods.delete(_id)
    // if(result.flag){
    //   await this.success(ctx.locals.lastPage,result.msg)
    // }else{
    //   await this.fail(ctx.locals.lastPage,result.msg)
    // }
  }
}
module.exports = GoodsController;
