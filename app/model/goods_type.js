module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const GoodTypeSchema = new Schema({
    type_name: { type: String, default: "", reqired: true }, //类型名称
    attr_group: { type: [String] }, //属性分组
    type_status: { type: Number, default: 1 } //状态 1启动，0关闭
  });
  return mongoose.model("GoodType", GoodTypeSchema, "goods_type");
};
