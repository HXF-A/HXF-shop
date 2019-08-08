module.exports = app=>{
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const CommentSchema = new Schema({
        comment_type:{type:Number,default:0},//评论类型0:评论商品 1:评论文章
        comment_object:{type:mongoose.ObjectId},//评论对象id 文章id
        comment_content:{type:String,default:''},// 评论内容
        comment_rank:{type:Number,default:0},//评论等级，1-5级别
        comment_time:{type:Number,default:Date.now()},//评论时间
        comment_status:{type:Number,default:0},//评论状态 0未显示批准 1显示批准
        user_id:{type:mongoose.ObjectId},//评论用户 id
        user_name:{type:String,default:''},//评论用户 名称
        user_email:{type:String,default:'',},//评论用户邮箱
        user_ip:{type:String,default:''}//评论用户 ip

    });
    return mongoose.model('Comment',CommentSchema,'comment')

}