module.exports = app=>{
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const GoodsAttrSchema = new Schema({

      goods_id:{type:mongoose.ObjectId,required:true},//商品id
      attr_id:{type:mongoose.ObjectId,required:true},//商品属性id
      type_id:{type:mongoose.ObjectId,required:true},//商品类型id
      attr_name:{type:String,default:''},//商品属性标题
      attr_value:{type:[String],default:[]},//商品属性值
      attr_type:{type:String,default:''},//唯一属性，单选属性，复选属性
      attr_group: { type: String, default: "" }, //属性分组
      //筛选分类id



    });
    return mongoose.model('GoodsAttr',GoodsAttrSchema,'goods_attr')

}