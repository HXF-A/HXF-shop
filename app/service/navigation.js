const { Service } = require("egg");
class CommentService extends Service {
  //增加列表
  async insert(body) {
    try {
      var navigationModel = await new this.ctx.model.Navigation(body);
      await navigationModel.save();
      return { flag: true, msg: "增加导航成功" };
    } catch (error) {
      return { flag: false, msg: "增加导航失败" };
    }
  }
  //查找全部导航
  async findAll(page, pageSize) {
    try {
      var totleNum = await this.ctx.model.Navigation.count({ nav_status: 1 });
      var totalPage = Math.ceil(totleNum / pageSize);
      //？？
      if (page > totalPage) {
        page = totalPage;
      }
      var navigations = await this.ctx.model.Navigation.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      return {
        flag: true,
        data: { navigations: navigations, totalPage: totalPage, page: page },
        msh: "查找全部导航成功"
      };
    } catch (error) {
      return { flag: false, msg: "数据异常，查找全部导航失败" };
    }
  }

  //按照id查找导航
  async findById(_id) {
    try {
      var navigations = await this.ctx.model.Navigation.findById({ _id: _id });
      return { flag: true, data: navigations, msg: "按照id查找导航成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，按照id查找导航失败" };
    }
  }
  //更新操作
  async update(_id, body) {
    try {
      await this.ctx.model.Navigation.updateOne({ _id: _id }, body);
      return { flag: true, msg: "更新导航成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，更新导航失败" };
    }
  }
  //删除操作
  async delete(_id) {
    try {
      await this.ctx.model.Navigation.deleteOne({ _id: _id });
      return { flag: true, msg: "删除导航成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，删除导航失败" };
    }
  }
}
module.exports = CommentService;
