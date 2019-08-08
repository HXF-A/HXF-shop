const { Service } = require("egg");
class CommentService extends Service {
  //增加
  async insert(comment) {
    try { 
    var commentModel = new this.ctx.model.Comment(comment);
      await commentModel.save();
      return { flag: true, msg: "角色添加成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，角色添加失败" };
    }
  }
  async findAll(){
      try {
           var comments = await this.ctx.model.Comment.find({})
           return {flag:true,data:comments,msg:'查找评论成功'}
      } catch (error) {
        return {flag:false,msg:'查找评论失败'}
      }
  }
  async delete(_id){
    try {
        await this.ctx.model.Comment.deleteOne({_id:_id})
        return {flag:true,msg:'删除评论成功'}
    } catch (error) {
            return {flag:false,msg:'删除评论失败'}
    }
  }
}
module.exports = CommentService;
