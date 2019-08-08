module.exports = (options, app) => {
  return async function(ctx, next) {
    const startTime = Date.now();
    app.logger.info("开始时间：" + startTime);
    //console.log(startTime);
    await next();
    const endTime = Date.now();
    app.logger.info("结束时间：" + endTime);
    const reportTime = endTime - startTime;
    app.logger.info("经历时间：" + reportTime);
  };
};
