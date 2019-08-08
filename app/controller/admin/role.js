const BaseController = require("./base");
class RoleController extends BaseController {
  //添加页面
  async add() {
    await this.ctx.render("admin/role/add");
  }
  //添加角色
  async doAdd() {
    const { ctx } = this;
    var body = ctx.request.body;
    var result = await this.ctx.service.role.insert(body);
    if (result.flag) {
      await this.success("/admin/role", result.msg);
    } else {
      await this.fail("/admin/role/add", result.msg);
    }
  }
  //角色列表
  async list() {
    var result = await this.ctx.service.role.findAll();
    if (result.flag) {
      var roles = result.data;
      await this.ctx.render("admin/role/list", { roles });
    } else {
      await this.fail("/admin/role", result.msg);
    }
  }
  // 修改页面
  async edit() {
    var _id = this.ctx.request.query._id;
    var result = await this.ctx.service.role.findById(_id);
    if (result.flag) {
      var role = result.data;
      await this.ctx.render("admin/role/edit", { role });
    } else {
      await this.fail("/admin/role", result.msg);
    }
  }
  //修改保存
  async doEdit() {
    const { ctx } = this;
    var body = ctx.request.body;
    var _id = body._id;
    if (body.data_status == "on") {
      body.data_status = 1;
    } else {
      body.data_status = 0;
    }
    var result = await this.ctx.service.role.update(_id, body);
    if (result.flag) {
      await this.success("/admin/role", result.msg);
    } else {
      await this.fail("/admin/role", result.msg);
    }
  }
  //删除操作
  async delete() {
    const { ctx } = this;
    var _id = this.ctx.request.query._id;
    var result = await this.ctx.service.role.delete(_id);
    if (result.flag) {
      await this.success(ctx.locals.lastPage, result.msg);
    } else {
      await this.fail(ctx.locals.lastPage, result.msg);
    }
  }
  async auth() {
    var role_id = this.ctx.request.query._id;
    var result = await this.ctx.service.access.findwithChecked(role_id);
    if (result.flag) {
      var accessArray = result.data;
      await this.ctx.render("/admin/role/auth", { role_id, accessArray });
    } else {
      await this.fail("admin/role", result.msg);
    }
  }
  async doAuth() {
    var { ctx } = this;
    var body = ctx.request.body;
    var role_id = body.role_id;
    if (body.access_checked) {
      var accessCheckedArray = body.access_checked;
    } else {
      var accessCheckedArray = [];
    }
    var role_access_array = [];
    accessCheckedArray.forEach(access_id => {
      var roleAccess = {
        role_id: role_id,
        access_id: access_id
      };
      role_access_array.push(roleAccess);
    });
    var result = await ctx.service.role.insertMangRoleAccess(
      role_id,
      role_access_array
    );
    if (result.flag) {
      await this.success("/admin/role", result.msg);
    } else {
      await this.fail("/admin/role", result.msg);
    }
  }
}
module.exports = RoleController;
