var config = {};
config.keys = "123456";
config.middleware = ["adminauth"];
config.adminauth = {
  enable: true,
  match: "/admin" //访问这个地址开启中间件
};
config.view = {
  defaultViewEngine: " ",
  mapping: {
    ".html": "nunjucks"
  }
};
//安全
(config.exports = {
  security: {
    csrf: {
      ignore: ctx => {
        if (ctx.request == "/admin/gallery/doUpload") {
          return false;
        }
      },
      queryName: "_csrf", // 通过 query 传递 CSRF token 的默认字段为 _csrf
      bodyName: "_csrf" // 通过 body 传递 CSRF token 的默认字段为 _csrf
    }
  }
}),
  //数据库
  (config.mongoose = {
    client: {
      url: "mongodb://127.0.0.1:27017/db_buka",
      options: { useNewUrlParser: true }
      // mongoose global plugins, expected a function or an array of function and options
      //plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
    }
  });
//session
config.session = {
  key: "EGG_SESS", //cookie加密
  maxAge: 24 * 3600 * 1000, // 1 天
  httpOnly: true,
  encrypt: true
};

config.uploadbasedir = "app/public/admin/upload/";
config.multipart = {
  fields: 60,
  fileSize: "30mb",
  files: 50,
  mode: "stream",
  fileModeMatch: /^\/upload_files$/
};
module.exports = config;
