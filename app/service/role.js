const { Service } = require("egg");
class RoleService extends Service {
  //增加
  async insert(role) {
    var roleModel = new this.ctx.model.Role(role);
    try {
      await roleModel.save();
      return { flag: true, msg: "角色添加成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，角色添加失败" };
    }
  }
  //查找全部
  async findAll() {
    try {
      var roles = await this.ctx.model.Role.find({});
      if (roles) {
        return { flag: true, data: roles };
      }
    } catch (error) {
      return { flag: false, msg: "角色列表数据查询失败" };
    }
  }
  //ID查找
  async findById(_id) {
    try {
      var role = await this.ctx.model.Role.findById(_id);
      if (role) {
        return { flag: true, data: role };
      }
    } catch (error) {
      return { flag: false, msg: "访问数据异常，id查找失败" };
    }
  }
  //修改角色
  async update(_id, role) {
    try {
      var role = await this.ctx.model.Role.update({ _id: _id }, role);
      return { flag: true, msg: "修改角色成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，修改角色失败" };
    }
  }
  //删除角色
  async delete(_id) {
    try {
      await this.ctx.model.Role.deleteOne({ _id: _id });
      return { flag: true, msg: "角色删除成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，角色删除失败" };
    }
  }
  async insertMangRoleAccess(role_id, roleAccessArray) {
    try {
      await this.ctx.model.RoleAccess.deleteMany({ role_id: role_id });
      await this.ctx.model.RoleAccess.insertMany(roleAccessArray);

      return { flag: true, msg: "角色授权成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，角色授权失败" };
    }
  }
}
module.exports = RoleService;
