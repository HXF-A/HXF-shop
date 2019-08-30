module.exports = app =>{
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const AdvertiseSchema = new Schema({
        ads_title:{type:String,default:''},//广告标题
        ads_type:{type:Number,default:1},//1网站，2app，3小程序
        ads_img:{type:[String],default:[]},//广告图片
        ads_link:{type:String,default:''},//跳转地址
        ads_position:{type:Number,default:0},//1上，2中，3左，4右，5下
        data_sort:{type:Number,default:10},
        ads_status:{type:Number,default:0},
        data_status:{type:Number,default:1},//1显示，2隐藏
        creat_time:{type:Number,default:Date.now()},
    });
    return mongoose.model('Advertise',AdvertiseSchema,'advertise');
}