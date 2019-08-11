const BaseController = require("./base");
const sendToWormhole = require('stream-wormhole');
class GoodsbrandController extends BaseController {
  //list显示
  async list() {
    const { ctx } = this;
    var result = await ctx.service.goodsbrand.findAll();
    if (result.flag) {
      var brands = result.data;
      await ctx.render("admin/goodsbrand/list", { brands });
    } else {
      ctx.body = result.msg;
    }
  }
  //增加列表显示
  async add() {
    const { ctx } = this;
    await ctx.render("admin/goodsbrand/add");
  }
  //增加列表操作
  async doAdd() {
    //const fromStream = await this.ctx.getFileStream();
    //多文件上传
     var parts = await this.ctx.multipart({autoFields:true});//多文件查找流文件
      var result = await this.ctx.service.goodsbrand.insert(parts);
      if (result.flag) {
        await this.success("/admin/goodsbrand", result.msg);
      } else {
        await this.fail("/admin/goodsbrand",result.msg);
      }
  }
  async edit() {
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var result = await ctx.service.goodsbrand.findById(_id);
    if (result.flag) {
      var brands = result.data;
      await ctx.render("admin/goodsbrand/edit", { brands });
    } else {
      await this.fail("/admin/goodsbrand", result.msg);
    }
  }
  async doEdit(){


    //多文件修改有问题
   //var fromStream = await this.ctx.getFileStream({requireFile:false});//不要求文件
    var parts = await this.ctx.multipart({autoFields:true});
   // console.log('====='+JSON.stringify(fields));
  // console.log(parts.field);
   
   var result = await this.ctx.service.goodsbrand.update(parts);
    if (result.flag) {
      await this.success("/admin/goodsbrand", result.msg);
    } else {
      await this.fail("/admin/goodsbrand/edit", result.msg);
  }
}
  async delete(){
    const { ctx } = this;
    var _id = ctx.request.query._id;
    var result = await ctx.service.goodsbrand.delete(_id);
    if (result.flag) {
      await this.success(this.ctx.locals.lastPage, result.msg);
    } else {
      await this.fail(this.ctx.locals.lastPage, result.msg);
    }
  }





  //测试

  
}
module.exports = GoodsbrandController;
