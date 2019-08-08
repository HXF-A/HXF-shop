module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserrankSchema = new Schema({
    rank_icon: { type: String, default: "" }, //等级图标
    rank_name: { type: String, required: true }, //角色名称
    start_score: { type: Number, required: true, default: 0 }, //开始积分
    end_score: { type: Number, required: true, default: 0 }, //结束积分
    disconnt: { type: Number, required: true, default: 0 }, //折扣
    creat_time: { type: Number, default: Date.now() }, //创建时间
    data_sot: { type: Number, default: 0 }, //排序
    data_status: { type: Number, default: 1 } //角色状态
  });
  return mongoose.model("Userrank", UserrankSchema, "userranks");
};
