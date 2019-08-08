module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const AccessSchema = new Schema({
    access_module: { type: String, default: "" }, //权限模块
    access_type: { type: String, required: true }, //节点类型y
    creat_time: { type: Number, default: Date.now() }, //创建时间
    access_action: { type: String, default: "" }, //权限操作
    access_url: { type: String, default: "" }, //权限资源
    data_sort: { type: Number, default: 100 }, //权限排序
    access_desc: { type: String, default: 1 }, //权限描述
    data_status: { type: Number, default: "" }, //权限状态
    access_module_id: { type: mongoose.Mixed } //模块id，0顶级模块  objiecID关联access模块  mixed混合类型
  });
  return mongoose.model("Access", AccessSchema, "accesss");
};
