module.exports = app=>{
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const GoodsBrandSchema = new Schema({

        brand_name: { type: String ,default:'' }, //品牌名称
        brand_logo: { type: [String] ,default:[]}, //品牌logo
        brand_desc: { type: String, default:'' }, //seo 描述
        brand_url: { type: String,default:''  },  //品牌网址
        brand_status: { type: Number,default:1  }, //1：显示 0：隐藏
        data_sort: { type: Number,default:50 },  //排序
        data_status: { type: Number,default:1 },  //1 正常 0 删除

    });
    return mongoose.model('GoodsBrand',GoodsBrandSchema,'goods_brand')

}