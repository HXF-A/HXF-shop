const { Service } = require("egg");
const fs = require("fs");
class GoodsService extends Service {
  //详细描述的照片处理
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
  //商品页面显示
  async insert(fromStream) {
    try {
      var body = fromStream.fields;
      if (fromStream && fromStream.filename) {
        var filePath = await this.service.tool.filePath(fromStream.filename); //找到tergetPath目标路径与dbPath相对路径
        var dbPath = filePath.dbPath;
        var targetPath = filePath.targetPath;
        body.goods_img = dbPath;
        await this.ctx.service.tool.uploadFile(fromStream, targetPath); //上传来源流
        await this.ctx.service.tool.jimp(filePath.targetPath);
      }
      //字符串处理
      body.relate_goods = body.relate_goods.trim().split(",");
      body.relate_gifts = body.relate_gifts.trim().split(",");
      body.relate_parts = body.relate_parts.trim().split(",");
      body.relate_articles = body.relate_articles.trim().split(",");
      var goodsModel = new this.ctx.model.Goods(body);
      var result = await goodsModel.save();

      //处理商品属性值
      var goods_id = result._id;
      var attr_values = body.attr_value_list;
      var attr_ids = body.attr_id_list;
      if (typeof body.attr_value_list == "string") {
        var attr_values = new Array(body.attr_value_list);
        var attr_ids = new Array(body.attr_id_list);
      }

      var attrNewValues = [];
      attr_values.forEach(element => {
        element = element.trim().split("\r\n");
        attrNewValues.push(element);
      });
      var attrArray = attr_ids;
      for (let i = 0; i < attrArray.length; i++) {
        //拆分字段
        var attr_id = attrArray[i];
        var attr_value = attrNewValues[i];
        var typeAttr = await this.ctx.model.GoodsTypeAttr.findById(attr_id);
        //
        var attr_name = typeAttr.attr_name;
        var type_id = typeAttr.type_id;
        var attr_group = typeAttr.attr_group;
        var attr_type = typeAttr.attr_type;
        //拼接存储
        await this.ctx.service.goodsattr.insert({
          goods_id: goods_id,
          type_id: type_id,
          attr_id: attr_id,
          attr_name: attr_name,
          attr_value: attr_value,
          attr_group: attr_group,
          attr_type: attr_type
        });
      }
      //数据库存储完毕后才能取出id
      return { flag: true, msg: "商品保存成功" };
    } catch (error) {
      return { flag: false, msg: "商品保存失败" };
    }
  }
  //分页查找
  async findAllwithPage(page, pageSize) {
    const { ctx } = this;
    try {
      var totleNum = await ctx.model.Goods.count({ data_status: 1 });
      var totalPage = Math.ceil(totleNum / pageSize);
      //？？
      if (page > totalPage) {
        page = totalPage;
      }
      var goodss = await ctx.model.Goods.find({ data_status: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      return {
        flag: true,
        data: { goodss: goodss, totalPage: totalPage, page: page },
        msg: "获取商品成功 "
      };
    } catch (error) {
      return { flag: false, msg: "数据异常，获取所有商品失败" };
    }
  }
  //findById查找商品
  async findById(_id) {
    try {
      var goodsFindById = await this.ctx.model.Goods.findById({
        _id: _id
      });
      return {
        flag: true,
        data: goodsFindById,
        msg: "通过商品ID查询商品成功"
      };
    } catch (error) {
      return { flag: false, msg: "通过商品ID查询商品失败" };
    }
  }
  //删除数据库相册
  async deleteImg(goods_id, img_url) {
    try {
      var result = await this.ctx.model.Goods.updateOne(
        { _id: goods_id },
        {
          $pull: {
            relate_gallerys: img_url
          }
        }
      );
      //物理删除，允许物理图片冗余，不允许数据库冗余
      var path1 = "app" + img_url;
      var path2 = this.ctx.helper.url200(path1);
      if (fs.existsSync(path1)) {
        fs.unlinkSync(path1);
      }
      if (fs.existsSync(path2)) {
        fs.unlinkSync(path2);
      }
      if (result.ok == 1) {
        return { flag: true, msg: "删除相册成功" };
      } else {
        return { flag: false, msg: "没有可以删除的相册，删除相册失败" };
      }
    } catch (error) {
      return { flag: false, msg: "数据异常，删除相册失败" };
    }
  }
  //修改更新
  async update(fromStream) {
    try {
      const { ctx } = this;
      var body = fromStream.fields;
      var _id = body._id;
      //表单出现的问题？？？

      // console.log("xxxxx" + JSON.stringify(body));
      //console.log("vvvvvv" + body.relate_goods);
      if (fromStream && fromStream.filename) {
        var filePath = await this.ctx.service.tool.filePath(
          fromStream.filename
        ); //找到tergetPath目标路径与dbPath相对路径
        var dbPath = filePath.dbPath;
        var targetPath = filePath.targetPath;
        await this.ctx.service.tool.uploadFile(fromStream, targetPath); //上传来源流
        await this.ctx.service.tool.jimp(filePath.targetPath);
        //删除
        body.goods_img = dbPath;
        await ctx.model.Goods.updateOne({ _id: _id }, body);
        // console.log("xxxxx" + JSON.stringify(body));
        var path1 = "app" + body.history_img;
        var path2 = this.ctx.helper.url200(path1);
        if (fs.existsSync(path1)) {
          fs.unlinkSync(path1);
        }
        if (fs.existsSync(path2)) {
          fs.unlinkSync(path2);
        }
      } else {
        //无文件修改
        await ctx.model.Goods.updateOne({ _id: _id }, body);
      }
      //字符串处理
      body.relate_goods = body.relate_goods.trim().split(",");
      body.relate_gifts = body.relate_gifts.trim().split(",");
      body.relate_parts = body.relate_parts.trim().split(",");
      body.relate_articles = body.relate_articles.trim().split(",");
      //处理商品属性值转化为数组
      var attr_values = body.attr_value_list;
      var attr_ids = body.attr_id_list;
      if (typeof body.attr_value_list == "string") {
        var attr_values = new Array(body.attr_value_list);
        var attr_ids = new Array(body.attr_id_list);
      }
      var attrNewValues = [];
      //循环将每一项拼接 。例：[a,8,[a,b],[a,b],[a,c]]
      attr_values.forEach(element => {
        element = element.trim().split("\r\n");
        attrNewValues.push(element);
      });
      var attrArray = attr_ids;
      //删除所有商品属性
      var result = await ctx.service.goodsattr.deleteByGoodsId(_id);
      if (result.flag) {
        for (let i = 0; i < attrArray.length; i++) {
          //拆分字段
          var attr_id = attrArray[i];
          var attr_value = attrNewValues[i];
          //通过goodsattr的attr_id，拿到goodstypeattr表的所有数据，attr_id(外键) = _id（主键）,
          var typeAttr = await this.ctx.model.GoodsTypeAttr.findById(attr_id);
          var goods_id = _id;
          var attr_name = typeAttr.attr_name;
          var type_id = typeAttr.type_id;
          var attr_group = typeAttr.attr_group;
          var attr_type = typeAttr.attr_type;
          //拼接存储,增加所有商品属性，相当于更新
          await this.ctx.service.goodsattr.insert({
            goods_id: goods_id,
            type_id: type_id,
            attr_id: attr_id,
            attr_name: attr_name,
            attr_value: attr_value,
            attr_group: attr_group,
            attr_type: attr_type
          });
        }
      } else {
        return { flag: false, msg: result.msg };
      }
      return { flag: true, msg: "商品保存123456789成功" };
    } catch (error) {
      return { flag: false, msg: "商品保存失败" };
    }
  }
  //软删除商品
  async deleteUpdate(_id) {
    try {
      await this.ctx.model.Goods.updateOne({ _id: _id }, { data_status: 0 });
      return { flag: true, msg: "软删除商品数据成功（data_status：0）" };
    } catch (error) {
      return { flag: false, msg: "软删除商品数据失败" };
    }
  }
  //通过id查找全部商品
  async findAll(_id) {
    try {
      var goodss = await this.ctx.model.Goods.find({ _id: _id });
      return { flag: true, data: goodss, msg: "按照id查询商品成功" };
    } catch (error) {
      return { flag: false, msg: "按照id查询商品失败" };
    }
  }
  //不会写硬件删除的富文本的本地删除
  async delete(_id) {
    try {
      var deleteGoods = await this.ctx.service.goods.findAll(_id);
      //console.log(deleteGoods);
    } catch (error) {}
  }

  //通过type_id查找商品，为导航做准备
  async findByCategoryId(category_id) {
    try {
      //console.log("aaaa" + category_id);

      var categoryIGoods = await this.ctx.model.Goods.find({
        category_id: category_id
      });
      return {
        flag: true,
        data: categoryIGoods,
        msg: "通过category_id查找goods商品成功"
      };
    } catch (error) {
      return { flag: false, msg: "数据异常，通过category_id查找goods商品失败" };
    }
  }

  //拿前台数据

  //查找热销商品
  async findGoodsIs(condition, number) {
    try {
      //console.log("xxx");
      var json = { data_status: 1 };
      var limit = number | 4;
      switch (condition) {
        case "is_hot":
          json = Object.assign(json, { is_hot: 1 });
          break;
        case "is_new":
          json = Object.assign(json, { is_new: 1 });
          break;
        case "is_best":
          json = Object.assign(json, { is_best: 1 });
          break;
      }
      var goodss = await this.ctx.model.Goods
        .find(json).limit(limit)
        
        
       return {flag:true,data:goodss,msg:'查询所有商品is成功'}
    } catch (error) {
      return {flag:false,msg:'数据异常，查询所有is商品失败'}
    }
  }
}

module.exports = GoodsService;
