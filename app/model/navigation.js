module.exports = app=>{
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const NavigationSchema = new Schema({
        nav_name:{type:String,default:''},//导航名称
        nav_icon:{type:String,default:''},//导航icon
        nav_position:{type:Number,default:0},//导航位置
        nav_open:{type:Number,default:1},//1:本窗口打开，0:新窗口打开
        nav_link:{type:String,default:''},//导航连接
        data_sort:{type:Number,default:10},//排序
        nav_status:{type:Number,default:1},//显示隐藏
        create_time:{type:Number,default:Date.now()}//创建时间
    })
    return mongoose.model('Navigation',NavigationSchema,'navigation');
}
