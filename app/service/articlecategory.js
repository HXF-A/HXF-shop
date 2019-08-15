const { Service } = require("egg");
class ArticleCategoryService extends Service {
  //增加操作
  async insert(body) {
    try {
      var articleCategoryModel = new this.ctx.model.ArticleCategory(body);
      await articleCategoryModel.save();
      return { flag: true, msg: "文章类型增加成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，文章类型增加失败" };
    }
  }
  //查找全部顶级分类
  async findAllTopCates() {
    try {
      var topCates = await this.ctx.model.ArticleCategory.find({
        acate_pid: "0",
        acate_status: 1
      });
      return { flag: true, data: topCates, msg: "查询顶级模块成功" };
    } catch (error) {
      return { flag: false, msg: "查询顶级模块失败" };
    }
  }
  //查找全部
  async findAll() {
    try {
      var articlecategorys = await this.ctx.model.ArticleCategory.aggregate([
        {
          $lookup: {
            from: "article_category",
            localField: "_id",
            foreignField: "acate_pid",
            as: "subCategorys"
          }
        },
        {
          $match: {
            acate_pid: "0",
            acate_status: 1
          }
        },
        //按照条件查找
        {
          $project: {
            _id: 1,
            acate_title: 1,
            acate_icon: 1,
            acate_keys: 1,
            acate_desc: 1,
            acate_subtitle: 1,
            acate_link: 1,
            acate_status: 1,
            data_sort: 1,
            acate_pid: 1,
            //！！！！！！！
            subCategorys: {
              $filter: {
                input: "$subCategorys",
                as: "item",
                cond: { $eq: ["$$item.acate_status", 1] } //条件
              }
            }
          }
        }
      ]).sort({ data_sort: 1 });
      return { flag: true, data: articlecategorys, msg: "查找全部文章成功" };
    } catch (error) {
      return { flag: false, mag: "数据异常，查找全部文章失败" };
    }
  }
  //按照id查找文章分类
  async findById(_id) {
    try {
      var cates = await this.ctx.model.ArticleCategory.findById({ _id: _id });
      return { flag: true, data: cates, msg: "按照id查找文章分类成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，按照id查找文章分类失败" };
    }
  }
  //修改操作update
  async update(_id, body) {
    try {
      await this.ctx.model.ArticleCategory.update({ _id: _id }, body);
      return { flag: true, msg: "按照id更新成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，按照id更新失败" };
    }
  }
  //软删除操作一softDelete
  async softDelete(_id) {
    try {
      await this.ctx.model.ArticleCategory.updateOne(
        { _id: _id },
        { acate_status: 0 }
      );
      return { flag: true, msg: "id软删除文章分类成功" };
    } catch (error) {
      return { flag: false, msg: "数据异常，id软删除文章失败" };
    }
  }
  //软删除二操作delete
  async delete(_id) {
    try {
      var object = await this.ctx.model.ArticleCategory.findOne(
        { _id: _id },
        { _id: 0, acate_id: 1 }
      );
      var acatePid = object.acate_pid;
      if (acatePid == "0") {
        var _id = this.app.mongoose.Types.Objectid(_id);
        await this.ctx.model.ArticleCategory.updateMany(
          { acate_pid: _id },
          { acate_status: 0 }
        );
        await this.ctx.model.ArticleCategory.updateOne(
          { _id: _id },
          { acate_status: 0 }
        );
      } else {
        await this.ctx.model.ArticleCategory.updateOne(
          { _id: _id },
          { acate_status: 0 }
        );
      }
      return { flag: true, msg: "按照ID软删除成功" };
    } catch (error) {
      return { flag: false, msg: "按照ID软删除失败" };
    }
  }
}
module.exports = ArticleCategoryService;
