module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const StaffSchema = new Schema({
    login_name: { type: String, required: true }, //登陆账号
    login_pwd: { type: String, required: true }, //登陆密码
    staff_name: { type: String, required: true }, //用户名称
    staff_no: { type: String, default: "" }, //用户编号
    staff_phone: { type: String, default: "" }, //用户电话
    staff_status: { type: Number, default: 1 }, //用户状态
    creat_time: { type: Number, default: Date.now() }, //显示时间
    role_id: { type: Schema.Types.ObjectId, request: true }, //角色ID
    data_status: { type: Number, default: 1 }, //数据状态
    last_time: { type: String, default: "" }, //最后登陆时间
    last_ip: { type: String, default: "" }, //访问IP
    is_super: { type: Number, default: 0 } //设置超级管理员 1超级管理员
  });
  return mongoose.model("Staff", StaffSchema, "staffs");
};
