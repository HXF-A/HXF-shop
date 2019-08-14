const BaseController = require("./base");
class ArticleCategoryController extends BaseController {
  //文章分类列表显示
  async list() {
    const { ctx } = this;
    //console.log('1234');
    
    var result = await ctx.service.articlecategory.findAll()
   // console.log(result);
    
    if(result.flag){
      var categorys = result.data
      //console.log(categorys);
      
      await ctx.render("admin/articlecategory/list",{categorys});
    }else{
    ctx.body = result.msg
    }
    
  }
  //增加页面
  async add() {
    const { ctx } = this;
    var result = await ctx.service.articlecategory.findAllTopCates()
    if(result.flag){
      var topcategorys = result.data;
      await ctx.render("admin/articlecategory/add",{topcategorys});
    }

    
  }
  //增加操作
  async doAdd(){
      const {ctx} =this
      var body = ctx.request.body
      var acate_pid = body.acate_pid;
      if (acate_pid != 0) {
        body.acate_pid = this.app.mongoose.Types.ObjectId(acate_pid);
      }
      var result = await ctx.service.articlecategory.insert(body)
      if(result.flag){
          await this.success('/admin/articlecategory',result.msg)
          
      }else{
          await this.fail('/admin/articlecategory/add',result.msg)
      }
  }
  //修改页面
  async edit(){
    const {ctx} = this
    var _id = ctx.request.query._id
    var cateResult = await ctx.service.articlecategory.findById(_id)
    var cateTopResult = await ctx.service.articlecategory.findAllTopCates();
    if(cateResult.flag && cateTopResult.flag){
      var cate = cateResult.data
      var topCates = cateTopResult.data;
     await ctx.render('admin/articlecategory/edit',{cate,topCates})
    }else{
      ctx.body = result.msg
    }
  }
  //修改页面操作
  async doEdit(){
    const {ctx} = this  
    var body = ctx.request.body
    var _id  =body._id
    var acate_pid  = body.acate_pid
    if(acate_pid != '0'){
      body.acate_pid = this.app.mongoose.Types.ObjectId(acate_pid);
    }
    var result = await ctx.service.articlecategory.update(_id,body)
    if(result.flag){
      await  this.success('/admin/articlecategory',result.msg)
    }else{
      await this.fail('/admin/articlecategory',result.msg)
    }
  }
  //删除操作
  async delete(){
    const {ctx}  =this
    var _id = ctx.request.query._id
    
    var result = await ctx.service.articlecategory.delete(_id)
    if(result.flag){
      await this.success(ctx.locals.lastPage,result.msg)
    }else{
      await this.fail(ctx.locals.lastPage,result.msg)
    }
  }
}


module.exports = ArticleCategoryController;
