const { Service } = require("egg");
class UserrankService extends Service {
  //增加
  async insert(userrank) {
    var userrankModel = new this.ctx.model.Userrank(userrank);
    try {
      await userrankModel.save();
      return { flag: true, msg: "会员添加成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，添加会员失败" };
    }
  }
  //查找全部
  async findAll() {
    try {
      var userranks = await this.ctx.model.Userrank.find({}).sort({
        data_sort: -1
      });
      if (userranks) {
        return { flag: true, data: userranks, msg: "查询会员等级成功" };
      }
    } catch (error) {
      return { flag: false, msg: "数据异常，查询所有会员等级失败" };
    }
  }
  //ID查找
  async findById(_id) {
    try {
      var userrank = await this.ctx.model.Userrank.findById(_id);
      if (userrank) {
        return { flag: true, data: userrank, msg: "依据id查询会员等级" };
      }
    } catch (error) {
      return { flag: false, msg: "数据异常，依据id查询失败" };
    }
  }
  //修改角色
  async update(_id, userrank) {
    try {
      var userrank = await this.ctx.model.Userrank.update(
        { _id: _id },
        userrank
      );
      return { flag: true, msg: "修改会员更新成功" };
    } catch (error) {
      return { falg: false, msg: "数据异常，修改会员失败" };
    }
  }
  //删除角色
  async delete(_id) {
    try {
      await this.ctx.model.Userrank.deleteOne({ _id: _id });
      return { flag: true, msg: "删除会员成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，删除会员失败" };
    }
  }
  async getUserrankByScore(score) {
    try {
      //var userrank = await this.ctx.model.Userrank.findOne({start_score:{$lte : score},end_score : {$gt:  score}})
      var userrank = await this.ctx.model.Userrank.findOne({
        start_score: { $lte: score },
        end_score: { $gt: score }
      });
      return { flag: true, data: userrank.rank_name };
    } catch (error) {
      return { falg: false };
    }
  }
}
module.exports = UserrankService;
