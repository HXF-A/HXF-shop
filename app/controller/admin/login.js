const BaseController = require("./base");
class loginController extends BaseController {
  //渲染
  async index() {
    await this.ctx.render("admin/login");
  }
  async doLogin() {
    //获取用户密码
    //加密
    //数据验证
    //验证验证码
    //提交验证码和session比较
    //账号密码数据库查询
    //没有提示用户密码错误
    //登陆成功 session储存
    //如果session 直接登录
    //如果session 跳转登录，session超时
    const { ctx } = this;
    let login_name = ctx.request.body.username;
    //Promise说明没有异步
    //let random = await ctx.service.tool.randonNumber()
    let login_pwd = await ctx.service.tool.md5(ctx.request.body.password);
    let code = ctx.request.body.code;
    var result = await ctx.service.login.find(login_name, login_pwd, code);
    if (result.flag) {
      await this.success("/admin", result.msg);
    } else {
      await this.fail("/admin/login", result.msg);
    }
  }
  //验证码
  async verifyCode() {
    var svg = await this.ctx.service.tool.captcha();
    console.log("captcha====" + svg.text);
    this.ctx.session.code = svg.text;
    this.ctx.response.type = "image/svg+xml";
    this.ctx.body = svg.data;
  }
  //退出操作
  async doLogout() {
    this.ctx.session = null;
    this.ctx.redirect("/admin");
  }
}
module.exports = loginController;
