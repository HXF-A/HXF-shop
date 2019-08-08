module.exports = app => {
  //app.config.coreMiddleware.unshift('report')
  app.once("server", server => {
    app.logger.info("server is running..");
  });
  app.on("error", (err, ctx) => {});
  app.on("request", ctx => {
    //console.log('request is comming' + ctx.request.href);
  });
  app.on("response", ctx => {
    //console.log('response is working' + ctx.response.status);
  });
};
