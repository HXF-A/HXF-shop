const { Service } = require("egg");
class AccessService extends Service {
  //查找模块
  async findModules() {
    try {
      var accessModules = await this.ctx.model.Access.find({
        access_module_id: "0"
      });
      return { flag: true, data: accessModules, msg: "查询模块成功" };
    } catch (error) {
      return { flag: false, msg: "模块查询失败" };
    }
  }
  //增加操作
  async insert(access) {
    var accessModel = await new this.ctx.model.Access(access);
    try {
      await accessModel.save();
      return { flag: true, msg: "增加权限成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，增加权限失败" };
    }
  }
  //查找全部
  async findAll() {
    try {
      var accesss = await this.ctx.model.Access.aggregate([
        {
          $lookup: {
            from: "accesss",
            localField: "_id",
            foreignField: "access_module_id",
            as: "subAccess"
          }
        },
        {
          $match: {
            access_module_id: "0"
          }
        },
        {
          $sort: {
            data_sort: 1
          }
        }
      ]);
      //console.log(JSON.stringify(accesss));
      
      function jsonsort(key,sortType){
        return function(a,b){
            return sortType ?~~(a[key]<b[key]):~~(a[key]>b[key])
        }
    }
    if(accesss){
        accesss = accesss.map((item)=>{
          //console.log("sss"+JSON.stringify(item.subAccess));
          
             item.subAccess.sort( jsonsort('data_sort',false))
             return item;
        })

        return {flag:true,data:accesss,msg:'查询所有权限成功'}
    }

      if (accesss) {
        return { flag: true, data: accesss, msg: "查询所有权限成功" };
      }
    } catch (error) {
      return { flag: false, msg: "查询失败数据异常" };
    }
  }
  //Id查找
  async findById(_id) {
    try {
      var access = await this.ctx.model.Access.findById(_id);
      if (access) {
        return { flag: true, data: access, msg: "查询id成功" };
      }
    } catch (error) {
      return { flag: false, msg: "查询id失败" };
    }
  }
  //查找role-id
  async findByRoleId(role_id) {
    try {
      var roleAccessArray = await this.ctx.model.RoleAccess.find({
        role_id: role_id
      });
      return {
        flag: true,
        data: roleAccessArray,
        msg: "访问按照role_id查询成功"
      };
    } catch (error) {
      return { flag: false, msg: "访问错误，数据异常，按照role_id查询失败a" };
    }
  }
  //查询url地址
  async findByUrl(access_url) {
    try {
      var accessUrl = await this.ctx.model.Access.findOne({
        access_url: access_url
      });
      return { flag: true, data: accessUrl, msg: "查找URL成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，查询url失败" };
    }
  }
  //查找权限
  async findwithChecked(role_id) {
    var result1 = await this.findAll();
    var result2 = await this.findByRoleId(role_id);
    if (result1.flag && result2.flag) {
      var accessArray = result1.data;
      var accessChecked = result2.data;
      var accessCheckedArray = [];
      accessChecked.forEach(element => {
        accessCheckedArray.push(element.access_id.toString());
      });
      for (const module of accessArray) {
        if (accessCheckedArray.indexOf(module._id.toString()) != -1) {
          module.checked = true;
        }
        for (const access of module.subAccess) {
          if (accessCheckedArray.indexOf(access._id.toString()) != -1) {
            access.checked = true;
          }
        }
      }
      return {
        flag: true,
        data: accessArray,
        msg: "查询所有权限和所有选中权限成功"
      };
    } else {
      return { flag: false, msg: "数据异常请检查role或权限错误" };
    }
  }
  //修改access
  async updateById(_id, access) {
    try {
      var x = await this.ctx.model.Access.update({ _id: _id }, access);
      return { flag: true, msg: "修改权限成功" };
    } catch (error) {
      return { flag: false, msg: "更逊失败，数据错误" };
    }
  }
  //id删除
  async delete(_id) {
    try {
      await this.ctx.model.Access.deleteOne({ _id: _id });
      return { flag: true, msg: "删除成功" };
    } catch (error) {
      return { flag: false, msg: "访问异常" };
    }
  }
}
module.exports = AccessService;
