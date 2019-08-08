module.exports = app => {
  const { router, controller } = app;
  var lowercase = app.middleware.lowercase();
  router.get(" ", lowercase, controller.api.goods.goodsList);
};
