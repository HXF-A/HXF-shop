module.exports = () => {
  return async function(ctx, next) {
    const startTime = Date.now();
    await next();
    reportTime(Date.now() - startTime);
  };
};
module.exports = options => {
  //洋葱模型
  //前置中间件，后置中间件
  return async (ctx, next) => {
    var userinfo = ctx.session.userinfo;
    var pathname = ctx.request.path;
    //请求上一页，来源地址
    //console.log(latePage);
    //抽离crsf，提升为全局变量
    ctx.locals.lastPage = ctx.request.header.referer;
    ctx.locals.csrf = ctx.csrf;
    ctx.locals.userinfo = userinfo;
    //加盐随机数测试
    //let random = await ctx.service.tool.randomNumber()
    // await ctx.service.tool.md5Secret('123456',random)
    //会发生死循环，一直跳转/admin/login
    if (userinfo != null) {
      var authResult = await ctx.service.staff.checkedAuth(
        userinfo.role_id,
        pathname
      );
      if (authResult.flag) {
        var result = await ctx.service.access.findwithChecked(userinfo.role_id);
        if (result.flag) {
          ctx.locals.authList = result.data;
          await next(); //执行下一个中间件
        } else {
          ctx.body = authResult.msg;
        }
      } else {
        ctx.body = authResult.msg;
      }
    } else {
      //死循环
      if (
        pathname == "/admin/login" ||
        pathname == "/admin/doLogin" ||
        pathname == "/admin/verify" ||
        pathname == "/admin/logon" ||
        pathname == "/admin/doLogon"
      ) {
        await next();
      } else {
        ctx.redirect("/admin/login");
      }
    }
  };
};
