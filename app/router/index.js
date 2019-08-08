module.exports = app => {
  const { router, controller } = app;
  router.get("/", controller.index.home.index);
  router.get("/user", controller.index.user.index);
};
