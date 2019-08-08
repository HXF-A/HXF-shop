const { Service } = require("egg");

class UserService extends Service {
  //查找所有会员数据
  async findAll() {
    try {
      var users = await this.ctx.model.User.find({ data_status: 1 });
      //foreach没有async方法
      // users.forEach(user => {
      //     var score = user.user_totalscore
      //     var rank_name = await this.ctx.service.userrank.getUserrankByScore(score)
      //     user.user_rank = rank_name
      // });
      for (const user of users) {
        var score = user.user_totalscore;
        var rank_name = await this.ctx.service.userrank.getUserrankByScore(
          score
        );
        user.user_rank = rank_name.data;
      }
      return { flag: true, data: users, msg: "查询所有会员成功" };
    } catch (error) {
      return { falg: false, msg: "数据异常啊查询所有数据失败，" };
    }
  }
  //ID查找
  async findById(_id) {
    try {
      var user = await this.ctx.model.User.findById(_id);
      if (user) {
        return { flag: true, data: user, msg: "依据id查询会员成功" };
      }
    } catch (error) {
      return { flag: false, msg: "访问数据异常，id查找失败" };
      //throw error
    }
  }
  //修改会员
  async update(_id, user) {
    try {
      var user = await this.ctx.model.User.update({ _id: _id }, user);
      return { flag: true, msg: "修改会员成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，修改会员失败" };
    }
  }
  //删除
  async delete(_id) {
    try {
      await this.ctx.model.User.updateOne(
        { _id: _id },
        { $set: { data_status: 0 } }
      );
      //console.log("=====" + JSON.stringify(x));

      return { flag: true, msg: "软删除用户成功" };
    } catch (error) {
      return { falg: false, msg: "数据异常，软删除失败" };
    }
  }
  //
  async findAllAccount() {
    try {
      const { ctx } = this;

      var userAccount = await ctx.model.User.find(
        { data_status: 1 },
        {
          _id: 1,
          login_name: 1,
          login_secret: 1,
          user_name: 1,
          user_email: 1,
          user_status: 1,
          last_ip: 1,
          last_time: 1
        }
      );
      // console.log('======'+JSON.stringify(userAccount));

      return { flag: true, data: userAccount, msg: "查询会员帐号成功" };
    } catch (error) {
      return { flag: false, msg: "查询会员帐号异常" };
    }
  }
  async findAllAccountById(_id) {
    try {
      var useraccount = await this.ctx.model.User.findById(
        {_id}, 
        {
          _id: 1,
          login_name: 1,
          user_name: 1,
          login_pwd: 1,
          user_status: 1
        }
      );
      console.log("=====" + JSON.stringify(useraccount));
      if (useraccount) {
        return { flag: true, data: useraccount, msg: "依据id查询会员成功" };
      }
    } catch (error) {
      return { flag: false, msg: "访问数据异常，id查找失败" };
    }
  }
  async accountUpdata(_id, useraccount) {
    try {
      if(useraccount.login_pwd){
            var seret = await this.ctx.model.User.findOne({_id:_id},{login_seret:1,_id:0})
console.log(seret);

         useraccount.login_pwd = await this.ctx.service.tool.md5Secret(useraccount.login_pwd,seret)
      var useraccount = await this.ctx.model.User.updateOne({ _id: _id }, useraccount);
     
      }else{
        var useraccount = await this.ctx.model.User.updateOne({ _id: _id }, useraccount);
      }
      return { flag: true, msg: "修改会员更新成功" };
     

    } catch (error) {
      console.log(error);
      
      return { flag: false, msg: "数据异常，修改会员更新失败" };
    }

  }
}

module.exports = UserService;
