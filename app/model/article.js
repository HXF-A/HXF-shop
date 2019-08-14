module.exports = app =>{
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const ArticleSchema = new Schema({
        article_title:{type:String,default:''},//文章标题
       // article_cateid:{type:Mongoose.Types.Objectid},
        article_img:{type:String,default:''},
        article_link:{type:String,default:''},
        article_content:{type:String,default:''},
        article_keys:{type:String,default:''},
        article_desc:{type:String,default:''},
        data_sort:{type:Number,default:100},
        data_status:{type:Number,default:1},
        creat_time:{type:Number,default:Date.now()},
    });
    return mongoose.model('Article',ArticleSchema,'article')
}