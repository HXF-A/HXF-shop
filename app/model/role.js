module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const RoleSchema = new Schema({
    role_name: { type: String, required: true }, //角色名称
    role_desc: { type: String, default: "" }, //默认值
    creat_time: { type: Number, default: Date.now() }, //创建时间
    data_status: { type: Number, default: 1 } //角色状态
  });
  return mongoose.model("Role", RoleSchema, "roles");
};
