module.exports = app =>{
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const ArticleCategorySchema = new Schema({
        acate_title:{type:String,default:''},
        acate_icon:{type:String,default:''},
        acate_subtitle:{type:String,default:''},//seo相关标题，关键词描述
        acate_link:{type:String,default:''},
        acate_pid:{type:Schema.Types.Mixed},//混合类型
        acate_keys:{type:String,default:''},
        acate_desc:{type:String,default:''},
        acate_status:{type:Number,default:1},
        data_sort:{type:Number,default:1},
        create_time:{type:Number,default:Date.now()},

    });
    return mongoose.model('ArticleCategory',ArticleCategorySchema,'article_category')
}
