const { Service } = require("egg");
class CommentService extends Service {
  //增加
  async insert(comment) {
    try { 
    var commentModel = new this.ctx.model.Comment(comment);
      await commentModel.save();
      return { flag: true, msg: "评论添加成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，评论添加失败" };
    }
  }
  //查找全部评论
  async findAll(){
      try {
           var comments = await this.ctx.model.Comment.find({})
           return {flag:true,data:comments,msg:'查找评论成功'}
      } catch (error) {
        return {flag:false,msg:'查找评论失败'}
      }
  }
  //删除评论
  async delete(_id){
    try {
        await this.ctx.model.Comment.deleteOne({_id:_id})
        return {flag:true,msg:'删除评论成功'}
    } catch (error) {
            return {flag:false,msg:'删除评论失败'}
    }
  }
   //分页查找
   async findAllwithPage(page, pageSize) {
    const { ctx } = this;
    try {
      var totleNum = await ctx.model.Comment.count({ comment_status: 1 });
      var totalPage = Math.ceil(totleNum / pageSize);
      //？？
      if (page > totalPage) {
        page = totalPage;
      }
      var comments = await ctx.model.Comment.find({ comment_status: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      return {
        flag: true,
        data: { comments: comments, totalPage: totalPage, page: page },
        msg: "获取商品成功 "
      };
    } catch (error) {
      return { flag: false, msg: "数据异常，获取所有商品失败" };
    }
  }
  //通过id查找
  async findDetailById(_id){
    try {
      var comments = await this.ctx.model.Comment.findById({_id:_id});
      return {flag:true,data:comments,msg:'查找评论成功'}
    } catch (error) {
      return {flag:false,msg:'查找评论失败'}
    }

  }
  //dodetail
  async updateDetail(_id,comment_status){
    try {
      await this.ctx.model.Comment.updateOne({_id:_id},{comment_status:comment_status})
      return {flag:true,msg:'修改状态成功'}
    } catch (error) {
      return {flag:false,msg:'修改状态失败'}
    }
  }
}
module.exports = CommentService;
