const { Service } = require("egg");
class StaffService extends Service {
  //增加
  async insert(staff) {
    var staffModel = await new this.ctx.model.Staff(staff);
    try {
      await staffModel.save();
      return { flag: true };
    } catch (error) {
      console.log(error);
      return { flag: false };
    }
  }
  //查找
  async find(login_name, login_pwd) {
    //少trychath
    try {
      var result = await this.ctx.model.Staff.findOne(
        {
          login_name: login_name,
          login_pwd: login_pwd
        },
        { staff_name: 1, staff_status: 1, role_id: 1, is_super: 1, _id: 0 }
      );
      return { flag: true, data: result, msg: "登陆成功1234" };
    } catch (error) {
      return { flag: false, msg: "数据异常，登陆失败 " };
    }
  }
  //查找全部
  async findAll() {
    try {
      var staffs = await this.ctx.model.Staff.aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "role_id",
            foreignField: "_id",
            as: "role"
          }
        }
      ]);
      if (staffs) {
        return { flag: true, data: staffs };
      }
    } catch (error) {
      return { flag: false, msg: "数据异常，findAll查找失败" };
    }
  }
  //checkedAuth用户访问权限
  async checkedAuth(role_id, path) {
    //
    var ignoreUrls = [
      "/admin/login",
      "/admin/doLogin",
      "/admin",
      "/admin/welcome",
      "/admin/logout",
      "/admin/verify"
    ];
    var is_super = this.ctx.locals.userinfo.is_super;
    if (ignoreUrls.indexOf(path) != -1 || is_super == 1) {
      return { flag: true, msg: "拥有访问权限" };
    }
    var result1 = await this.ctx.service.access.findByRoleId(role_id);
    var result2 = await this.ctx.service.access.findByUrl(path);
    if (result1.flag && result2.flag) {
      var accessArray = result1.data;
      var access = result2.data;
      var accessAll = [];
      accessArray.forEach(element => {
        accessAll.push(element.access_id.toString());
      });
      if (accessAll.indexOf(access._id.toString()) != -1) {
        return { flag: true, msg: "查询checkedAuth成功，该用户拥有访问权限" };
      } else {
        return { flag: false, msg: "查询checkedAuth失败，没有权限联系尼玛" };
      }
    }
  }
  //通过姓名查找
  async findByLoginName(login_name) {
    var result = await this.ctx.model.Staff.findOne({ login_name: login_name });
    if (result) {
      return { flag: false, msg: "用户添加成功" };
    } else {
      return { flag: true, msg: "数据异常，用户添加失败" };
    }
  }
  //通过Id查找
  async findById(_id) {
    try {
      var staff = await this.ctx.model.Staff.findById(_id);
      if (staff) {
        return { flag: true, data: staff };
      }
    } catch (error) {
      return { flag: false };
    }
  }
  //修改
  async updateById(_id, staff) {
    try {
      var staff = await this.ctx.model.Staff.update({ _id: _id }, staff);
      return { flag: true, msg: "修改Staff更新成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，修改更新失败" };
    }
  }
  //删除
  async delete(_id) {
    try {
      await this.ctx.model.Staff.deleteOne({ _id: _id });
      return { flag: true, msg: "删除用户成功" };
    } catch (error) {
      return { falg: false, msg: "数据异常，删除失败" };
    }
  }
}
module.exports = StaffService;
