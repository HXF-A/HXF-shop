const { Service } = require("egg");
const fs = require("fs");
class ArticleService extends Service {
  //增加insert
  async insert(fromStream) {
    try {
      var body = fromStream.fields;
      if (fromStream && fromStream.filename) {
        var filePath = await this.service.tool.filePath(fromStream.filename);
        body.article_img = filePath.dbPath;
        await this.ctx.service.tool.uploadFile(fromStream, filePath.targetPath);

        await this.ctx.service.tool.jimp(filePath.targetPath);
      }
      
      var articleModel = new this.ctx.model.Article(body);
      await articleModel.save();
      return { flag: true, msg: "增加文章成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，增加文章失败" };
    }
  }
  //查找全部文章信息
  async findAll() {
    try {
      var articles = await this.ctx.model.Article.find({});
      return { flag: true, data: articles, msg: "查找全部文章成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，查找全部文章失败" };
    }
  }
  //分页查找
  async findAllwithPage(page, pageSize) {
    const { ctx } = this;
    try {
      var totleNum = await ctx.model.Article.count({});
      var totalPage = Math.ceil(totleNum / pageSize);
      //？？
      if (page > totalPage) {
        page = totalPage;
      }
      // var articles = await ctx.model.Article.find({})
      //   .sort({ data_sort: 1 })
      //   .skip((page - 1) * pageSize)
      //   .limit(pageSize); 
      var articles = await ctx.model.Article.aggregate([
        {
          $lookup:{
            from:'article_category',
            localField:'article_cateid',
            foreignField:'_id',
            as:'category'
          }
        },
        {
          $skip:((page - 1) * pageSize)
        },
        {
          $limit:pageSize
        },{
          $unwind:"$category"
        }
      ])
      return {
        flag: true,
        data: { articles: articles, totalPage: totalPage, page: page },
        msg: "获取商品成功 "
      };
    } catch (error) {
      return { flag: false, msg: "数据异常，获取所有商品失败" };
    }
  }
  //详细描述上传
  async upload(parts) {
    try {
      var fromStream;
      var links = [];
      while ((fromStream = await parts()) != null) {
        if (fromStream.filename) {
          var filePath = await this.service.tool.filePath(fromStream.filename); //找到tergetPath目标路径与dbPath相对路径
          //filePath：{ targetPath: 'app/public/admin/upload/20190726/1564110932558.jpg',   dbPath: '/public/admin/upload/20190726/1564110932558.jpg' }
          await this.ctx.service.tool.uploadFile(
            fromStream,
            filePath.targetPath
          ); //上传来源流
          links.push(filePath.dbPath);
        } else {
          continue;
        }
      }
      return { flag: true, data: links, msg: "商品保存成功" };
    } catch (error) {
      return { flag: false, msg: "商品保存失败" };
    }
  }
  //通过id查找文章
  async findById(_id) {
    try {
      var article = await this.ctx.model.Article.findById({ _id: _id });
      return { flag: true, data: article, msg: "通过id查找文章成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，通过id查找文章失败" };
    }
  }
  //修改操作update
  async update(fromStream) {
    try {
      var body = fromStream.fields;
      var _id = body._id;
      if (fromStream && fromStream.filename) {
        var filePath = await this.ctx.service.tool.filePath(fromStream.filename);
        body.article_img = filePath.dbPath;
        //console.log(body);
        //console.log("xxxxx"+filePath.targetPath);
        
        // await this.ctx.service.tool.uploadFile(fromStream, filePath.targetPath);
        await this.ctx.service.tool.uploadFile(
          fromStream,
          filePath.targetPath
        );

        await this.ctx.service.tool.jimp(filePath.targetPath);
       // console.log(body);
        
       // await this.ctx.model.Article.updateOne({ _id: _id }, body);
        var path1 = "app" + body.history_img;
        var path2 = this.ctx.helper.url200(path1);
        if (fs.existsSync(path1)) {
          fs.unlinkSync(path1);
        }
        if (fs.existsSync(path2)) {
          fs.unlinkSync(path2);
        }
      } else {
        await this.ctx.model.Article.update({ _id: _id }, body);
      }
      return { flag: true, msg: "修改文章成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，修改文章失败" };
    }
  }
  //删除delete
  async deleteById(_id) {
    try {
      var deleteImg = await this.ctx.model.Article.findOne(
        { _id: _id },
        { _id: 0, article_img: 1 }
      );
      var articImg = deleteImg.article_img;
      if (articImg) {
        var path1 = "app" + articImg;
        var path2 = this.ctx.helper.url200(path1);
        if (fs.existsSync(path1)) {
          fs.unlinkSync(path1);
        }
        if (fs.existsSync(path2)) {
          fs.unlinkSync(path2);
        }
      }
      await this.ctx.model.Article.deleteOne({ _id: _id });
      return { flag: true, msg: "删除文章成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，删除文章失败" };
    }
  }
}
module.exports = ArticleService;
