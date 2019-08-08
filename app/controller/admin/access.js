const BaseController = require("./base");

class AccessController extends BaseController {
  async add() {
    var result = await this.ctx.service.access.findModules();
    if (result.flag) {
      var modules = result.data;
      await this.ctx.render("/admin/access/add", { modules: modules });
    } else {
      await this.fail("/admin/access/add", result.msg);
    }
  }
  async doAdd() {
    var body = this.ctx.request.body;
    //转换成ObjectId对象，方便以后与_id关联
    if (body.access_module_id != "0") {
      body.access_module_id = this.app.mongoose.Types.ObjectId(
        body.access_module_id
      );
    }
    var result = await this.ctx.service.access.insert(body);
    if (result.flag) {
      await this.success("/admin/access", result.msg);
    } else {
      await this.fail("/admin/access/add", result.mag);
    }
  }
  async list() {
    var result = await this.ctx.service.access.findAll();
    if (result.flag) {
      var modules = result.data;
      await this.ctx.render("admin/access/list", { modules });
    } else {
      await this.fail("/admin/access", "角色列表数据查询失败");
    }
  }
  async edit() {
    var _id = this.ctx.request.query._id;
    //找到模块和菜单_id关联查询
    var result1 = await this.ctx.service.access.findById(_id);
    var result2 = await this.ctx.service.access.findModules();
    if (result1.flag && result2.flag) {
      var access = result1.data;
      var modules = result2.data;
      await this.ctx.render("admin/access/edit", { access, modules });
    } else {
      await this.fail("/admin/access", "数据异常，查找modules或id失败");
    }
  }
  async doEdit() {
    const { ctx } = this;
    var body = ctx.request.body;
    var _id = body._id;
    //将菜单及操作的access_module_id转化为
    if (body.access_module_id != "0") {
      body.access_module_id = this.app.mongoose.Types.ObjectId(
        body.access_module_id
      );
    }
    var result = await this.ctx.service.access.updateById(_id, body);
    if (result.flag) {
      await this.success("/admin/access", result.msg);
    } else {
      await this.fail("/admin/access", result.msg);
    }
  }
  async delete() {
    const { ctx } = this;
    var _id = this.ctx.request.query._id;
    var result = await this.ctx.service.access.delete(_id);
    if (result.flag) {
      await this.success(ctx.locals.lastPage, "删除成功");
    } else {
      await this.fail(ctx.locals.lastPage, "访问异常");
    }
  }
}
module.exports = AccessController;
