module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    login_name: { type: String, required: true }, //账号 手机号
    login_seret: { type: Number, required: true }, //安全码，密码加密
    login_pwd: { type: String, required: true }, //密码
    user_type: { type: String, required: true }, //0:线上会员1:门店会员
    user_sex: { type: Number, required: true }, // 0:保密1:男2:女
    user_name: { type: String, default: "" }, //会员名你
    user_phone: { type: String, default: "" }, //会员头像
    user_truename: { type: String, default: "" }, //真实姓名
    user_birthday: { type: String, default: "" }, //生日
    user_wechat: { type: String, default: "" }, //会员微信
    user_email: { type: String, default: "" }, //会员邮箱
    user_totalscore: { type: Number, default: "" }, //会员消费积分和会员等级相关
    user_status: { type: Number, default: 1 }, //1:正常0:停用
    user_from: { type: Number, default: 1 }, //1:pc 2:app 3:wechat
    last_ip: { type: String, default: "" }, //最后登陆ip
    last_time: { type: String, default: "" }, //最后登陆时间
    data_status: { type: Number, default: 1 }, //1:正常 0:删除
    creat_time: { type: Number, default: Date.now() } //创建时间
  });
  return mongoose.model("User", UserSchema, "users");
};
