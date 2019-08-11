const BaseController = require("./base");
class AdvertiseController extends BaseController {
  //列表显示
  async list() {
    const { ctx } = this;
    var result = await ctx.service.advertise.findAll();
    if (result.flag) {
      var advertises = result.data;
      await ctx.render("admin/advertise/list", { advertises });
    } else {
      ctx.body = result.msg;
    }
  }
  //增加页面
  async add() {
    await this.ctx.render("admin/advertise/add");
  }
  //增加操作
  async doAdd() {
    const { ctx } = this;
    //多文件上传
    var parts = await ctx.multipart({ autoFields: true }); //多文件查找流文件
    var result = await ctx.service.advertise.insert(parts);
    if (result.flag) {
      await this.success("/admin/advertise", result.msg);
    } else {
      await this.fail("/admin/advertise", result.msg);
    }
  }
  //修改页面
  async edit() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var result = await ctx.service.advertise.findById(_id);
    if (result.flag) {
      var advertises = result.data;
      await ctx.render("admin/advertise/edit", { advertises });
    } else {
      ctx.body = result.msg;
    }
  }
  //修改操作
  async doEdit(){
      const {ctx} = this
     var parts = await ctx.multipart({autoFields:true})
     var result = await ctx.service.advertise.update(parts)
     if(result.flag){
       await this.success('/admin/advertise',result.msg)
     }else{
       await this.fail(ctx.locals.lastPage,result.msg)
     }
  }
  //删除操作
  async delete(){
    const {ctx} = this
    var _id = ctx.request.query._id
    var result = await ctx.service.advertise.delete(_id)
    if(result.flag){
      await this.success('/admin/advertise',result.msg)
    }else{
      await this.fail('/admin/advertise',result.msg)
    }
  }
}
module.exports = AdvertiseController;
