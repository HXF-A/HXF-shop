module.exports = () => {
  return async (ctx, next) => {
    console.log("query===" + ctx.request.query.name);
    ctx.request.query.name =
      ctx.request.query.name && ctx.request.query.name.toLowerCase();
    console.log("query===" + ctx.request.query.name);
    await next();
  };
};
