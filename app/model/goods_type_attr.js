module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const GoodTypeAttrSchema = new Schema({
    attr_name: { type: String, default: "", required: true }, //类型名称
    type_id: { type: mongoose.ObjectId, require: true },
    attr_group: { type: String, default: "" }, //属性分组
    attr_type: { type: Number, default: 1 }, //1:唯一属性，2:单选属性，3:复选属性
    attr_name: { type: String, default: "" }, //属性名称
    attr_input: { type: Number, default: 1 }, //1:单行录入，2:多行录入
    //attr_value: { type: [String], default: [] }, //属性可选值，回车符间隔，一行为一个数值
    data_sort: { type: Number, default: 0 } //数据排序
  });
  return mongoose.model("GoodTypeAttr", GoodTypeAttrSchema, "goods_type_attr");
};
