const BaseController = require("./base");
const fs = require('fs')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
var mkdirp = require('mkdirp')
var dateFormat = require("dateformat");
class StaffController extends BaseController {
  //增加用户
  async add() {
    var object = await this.ctx.service.role.findAll();
    if (object.flag) {
      var roles = object.data;
      await this.ctx.render("admin/staff/add", { roles });
    }
    //少一个elae健壮性判断
    //     console.log("保存成功");
    //    var relsult = await this.ctx.service.staff.insert(staff)
    //     if(relsult){
    //        this.ctx.redirect('/admin/staff/list')
    //     }else{
    //         this.ctx.body = "跳转失败"
    //     }
  }
  //增加操作
  async doAdd() {
    const { ctx } = this;
    var body = ctx.request.body;
    body.login_pwd = await ctx.service.tool.md5(body.login_pwd);
    //密码加密
    //账号查询查重
    var user_result = await ctx.service.staff.findByLoginName(body.login_name);
    if (user_result.flag) {
      var result = await this.ctx.service.staff.insert(body);
      if (result.flag) {
        await this.success("/admin/staff", result.msg);
      } else {
        await this.fail("/admin/staff/add", result.msg);
      }
    } else {
      await this.fail("/admin/staff/add", "账户已存在，增加失败");
    }
  }
  //显示用户列表
  async index() {
    var result = await this.ctx.service.staff.findAll();
    var staffs = result.data;
    if (result.flag) {
      await this.ctx.render("admin/staff/index", { staffs });
    } else {
      await this.fail("/admin/staff", result.msg);
    }
  }
  //修改用户
  async edit() {
    var _id = this.ctx.request.query._id;
    var result = await this.ctx.service.staff.findById(_id);
    var resultRole = await this.ctx.service.role.findAll();
    if (result.flag && resultRole.flag) {
      var staff = result.data;
      var roles = resultRole.data;
      await this.ctx.render("admin/staff/edit", { staff, roles });
    } else {
      await this.fail("/admin/staff", result.msg);
    }
  }
  //修改操作
  async doEdit() {
    var body = this.ctx.request.body;
    var _id = body._id;
    var pwd = body.login_pwd;
    // var user_result =await this.ctx.service.staff.findByLoginName(body.login_name)
    // console.log('==='+user_result);
    // if(user_result){
    if (pwd) {
      var staff = {
        login_name: body.login_name,
        login_pwd: await this.ctx.service.tool.md5(body.login_pwd),
        staff_name: body.staff_name,
        staff_no: body.staff_no,
        staff_phone: body.staff_phone,
        role_id: body.role_id,
        staff_status: body.staff_status
      };
    } else {
      var staff = {
        login_name: body.login_name,
        staff_name: body.staff_name,
        staff_no: body.staff_no,
        staff_phone: body.staff_phone,
        role_id: body.role_id,
        staff_status: body.staff_status
      };
    }
    var result = await this.ctx.service.staff.updateById(_id, staff);
    if (result.flag) {
      await this.success("/admin/staff", result.msg);
    } else {
      await this.fail(this.ctx.locals.lastPage, result.msg);
    }
    // }
    // else{
    //     await this.fail(this.ctx.locals.lastPage,'账户名称已存在，修改失败')
    // }
  }
  //删除操作
  async delete() {
    const { ctx } = this;
    var _id = await this.ctx.request.query._id;
    var result = await this.ctx.service.staff.delete(_id);
    if (result.flag) {
      await this.success(ctx.locals.lastPage, result.msg);
    } else {
      await this.fail(ctx.localsl.lastPage, result.msg);
    }
  }
  //显示上传
  async upload(){
    //获取文件流，从表单中
    
    await this.ctx.render('admin/staff/upload')
   
   
  }
   //显示上传操作
   async doUpload(){
     //this.ctx.body = '123'
     const stream = await this.ctx.getFileStream()
      //创建标准文件夹，存储作用
    let uploadBaseDir = this.app.config.uploadbasedir
    //helper转化时间 
    let dateDir = dateFormat(new Date(),'yyyymmdd')
    //拼接路径path.join
    let baseDir= path.join(uploadBaseDir,dateDir)
    //
     mkdirp(baseDir)
    //创建上传文件名 统一名称 不能重复,时间戳
     const filename = Date.now() + Math.floor(Math.random()*9000+1000) + path.extname(stream.filename)
     //app/public/admin/upload/.....文件上传地址
     var targetPath = path.join(baseDir,filename)

     var writestream = fs.createWriteStream(targetPath)
     try {
       await awaitWriteStream (stream.pipe(writestream))
     } catch (error) {
       //出现错误将流关闭
       await sendToWormhole(stream)
       throw error
     }
     

     
     //this.ctx.body ='do'
    //await this.ctx.render('admin/staff/upload')
  }
}
module.exports = StaffController;
