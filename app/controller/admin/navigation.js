const BaseController = require('./base')
class NavigationController extends BaseController{
//列表显示
async list(){
    const {ctx} = this
    var page = ctx.request.query.page || 1;
    var pageSize = 2;
    var result = await ctx.service.navigation.findAll(page, pageSize)
    if(result.flag){
        
        var navigations = result.data.navigations;
        var totalPage = result.data.totalPage;
        var page = result.data.page;
        await ctx.render('admin/navigation/list',{navigations,totalPage,page}) 
    }else{
        ctx.body = result.msg
    }
}
//增加页面
async add(){
    const {ctx} = this
    await ctx.render('admin/navigation/add')
}
//增加操作
async doAdd(){
    const {ctx} = this
    var body = ctx.request.body
    var result = await ctx.service.navigation.insert(body)
    if(result.flag){
        await this.success('/admin/navigation',result.msg)
    }else{
        await this.fail('/admin/navigation',result.msg)
    }
}
//显示修改页面
async edit(){
    const {ctx} =this
    var _id  = ctx.request.query._id
    var targetpage = ctx.locals.lastPage
    var result = await ctx.service.navigation.findById(_id)
    if(result.flag){
        var navigation = result.data
        await ctx.render('admin/navigation/edit',{navigation,targetpage})
    }else{
        await this.fail(ctx.locals.lastPage,result.msg)
    }
}
//修改操作
async doEdit(){
    const{ctx} =this
    var body = ctx.request.body
    var _id= body._id
    var targetpage = body.targetpage
    var result = await ctx.service.navigation.update(_id,body)
    if(result.flag){
        await this.success(targetpage,result.msg)

    }else{
        await this.fail(ctx.locals.lastPage,result.msg)
    }
}
//删除操作
async delete(){
    const {ctx} = this
    var _id = ctx.request.query._id
    var result = await ctx.service.navigation.delete(_id)
    if(result.flag) {
        await this.success(ctx.locals.lastPage,result.msg)
    }else{
        await this.fail(ctx.locals.lastPage,result.msg)
    }
}
}
module.exports = NavigationController