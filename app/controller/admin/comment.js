const BaseController = require("./base");
class CommentController extends BaseController {
  //评论列表
  async list() {
    const { ctx } = this;
    var page = ctx.request.query.page || 1;
    var pageSize = 5;
    var result = await ctx.service.comment.findAllwithPage(page, pageSize);
    //var result = await ctx.service.comment.findAll();
    if (result.flag) {
      var comments = result.data.comments;
      var totalPage = result.data.totalPage;
      var page = result.data.page;
      await this.ctx.render("admin/comment/list", {
        comments,
        totalPage,
        page
      });
    } else {
      ctx.body = 123;
    }
  }
  //增加
  async add() {
    await this.ctx.render("admin/comment/add");
  }
  //批量增加假数据
  async insertMany() {
    const { app } = this;
    var comments = [];
    for (let i = 0; i < 10; i++) {
      var comment = {
        comment_type: 0,
        comment_object: app.mongoose.Types.ObjectId(
          "5d491e7cf11eda2f7c75077" + i
        ),
        comment_content:
          "66666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666",
        comment_rank: 1,
        comment_status: 1,
        user_id: app.mongoose.Types.ObjectId("5d491e7cf11eda2f7c75077" + i),
        user_name: "user" + i,
        user_email: "2019" + i + "@email.com",
        user_ip: "127.0.0." + i
      };
      comments.push(comment);
    }
    var result = await this.ctx.model.Comment.insertMany(comments);
    if (result) {
      this.ctx.body = "成功";
    }
  }
  //评论增加操作
  async doAdd() {
    const { ctx } = this;
    var body = ctx.request.body;
    var result = await ctx.service.comment.insert(body);
    if (result.flag) {
      await this.success("/admin/comment", result.msg);
    } else {
      await this.fail("/admin/comment/add", result.msg);
    }
  }
  //问题？？？？？？没写
  async detail() {
    var _id = this.ctx.request.query._id;
    var page = this.ctx.request.query.targetPage;
    var result =await this.ctx.service.comment.findDetailById(_id)
    if(result.flag){
        var comments = result.data
       await this.ctx.render("/admin/comment/detail", {
      comments,
      page
    }); 
    }else{
        await this.fail('/admin/comment',result.msg)
    }
  }
  //详情操作
  async doDetail() {
    const { ctx } = this;
    var comment_status = ctx.request.query.comment_status;
    var _id = this.ctx.request.query._id;
    var page = this.ctx.request.query.page;
    if (comment_status == 1) {
      comment_status = 0;
    } else {
      comment_status = 1;
    }
    var result = await ctx.service.comment.updateDetail(_id, comment_status);
    if (result.flag) {
      await this.success("/admin/comment?page=" + page, result.msg);
    } else {
      await this.fail(ctx.locals.lastPage, result.msg);
    }
  }
  //删除评论
  async delete() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var result = await ctx.service.comment.delete(_id);
    if (result.flag) {
      await this.success(ctx.locals.lastPage, result.msg);
    } else {
      await this.fail(ctx.locals.lastPage, result.msg);
    }
  }
}
module.exports = CommentController;
