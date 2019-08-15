const BaseController = require("./base");
class ArticleController extends BaseController {
  //显示列表
  async list() {
    const { ctx } = this;
    var page = ctx.request.query.page || 1;
    var pageSize = 2;
    var articleResult = await ctx.service.article.findAllwithPage(
      page,
      pageSize
    );
    // var articleResult = await ctx.service.article.findAll()
    var cateResult = await ctx.service.articlecategory.findAll();
    if (articleResult.flag && cateResult.flag) {
      var cates = cateResult.data;
      var articles = articleResult.data.articles;
      var totalPage = articleResult.data.totalPage;
      var page = articleResult.data.page;
      await ctx.render("admin/article/list", {
        articles,
        cates,
        page,
        totalPage
      });
    } else {
      ctx.body = articleResult.msg;
    }
  }
  //增加页面
  async add() {
    const { ctx } = this;
    var cateResult = await ctx.service.articlecategory.findAll();
    if (cateResult.flag) {
      var cates = cateResult.data;
      await ctx.render("admin/article/add", { cates });
    } else {
      ctx.body = result.msg;
    }
  }
  //增加操作
  async doAdd() {
    const { ctx } = this;
    var fromStream = await ctx.getFileStream({ requireFile: false });
    var result = await ctx.service.article.insert(fromStream);
    if (result.flag) {
      await this.success("/admin/article", result.msg);
    } else {
      await this.fail("/admin/article", result.msg);
    }
  }
  //详细描述上传
  async doUpload() {
    var parts = await this.ctx.multipart({ autoFields: true }); //多文件查找流文件
    var result = await this.ctx.service.article.upload(parts);
    if (result.flag) {
      var links = result.data;
      //插件规范必须使用link传值，使用多文件上传返回数组需要具体的对象
      this.ctx.body = { link: links[0] };
    } else {
      var msg = result.mag;
      this.ctx.body = { msg: msg };
    }
  }
  //修改页面显示
  async edit() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var cateResult = await ctx.service.articlecategory.findAll();
    var articleResult = await ctx.service.article.findById(_id);
    if (articleResult.flag && cateResult.flag) {
      var article = articleResult.data;
      var cates = cateResult.data;
      await ctx.render("admin/article/edit", { article, cates });
    } else {
      await this.fail("/admin/article", articleResult.msg);
    }
  }
  //修改操作
  async doEdit() {
    const { ctx } = this;
    var fromStream = await ctx.getFileStream({ requireFile: false });
    var result = await ctx.service.article.update(fromStream);
    if (result.flag) {
      await this.success("/admin/article", result.msg);
    } else {
      await this.fail(ctx.locals.lastPath, result.msg);
    }
  }
  //删除操作
  async delete() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var result = await ctx.service.article.deleteById(_id);
    if (result.flag) {
      await this.success("/admin/article", result.msg);
    } else {
      await this.fail(this.ctx.locals.lastPath.result.msg);
    }
  }
}
module.exports = ArticleController;
