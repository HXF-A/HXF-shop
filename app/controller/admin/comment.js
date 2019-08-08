const BaseController = require("./base");
class CommentController extends BaseController {
    async list(){
        const {ctx} = this
        var result = await ctx.service.comment.findAll()
        if(result.flag){
            var comments = result.data
            await this.ctx.render("admin/comment/list",{comments})
        }else{
            ctx.body = 123
        }
       
    }
    async add(){
        await this.ctx.render("admin/comment/add")
    }
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
      async delete(){
          const {ctx} =this
          var _id = ctx.request.query._id
        var result = await ctx.service.comment.delete(_id)
        if(result.flag){
            await this.success('/admin/comment',result.msg)
        }else{
            await this.fail('/admin/comment',result.msg)
        }
      }
}
module.exports = CommentController;
