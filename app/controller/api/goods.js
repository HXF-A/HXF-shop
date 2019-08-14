const BaseController = require("../admin/base");

class goodsController extends BaseController {
  async goodsList() {
    let goodsList = [
      { goodsname: "han", price: 19 },
      { goodsname: "han", price: 19 },
      { goodsname: "han", price: 19 },
      { goodsname: "han", price: 19 }
    ];
    this.ctx.body = goodsList;
  }


//goods页面
  async list(){
    var category_id = this.ctx.request.query.category_id
    console.log("xxxx"+category_id);
    
   var result=  await this.ctx.service.goods.findByCategoryId(category_id)
   console.log('===='+JSON.stringify(result));
   
   if(result.flag){
     var goods= result.data
    await this.ctx.render('api/goods',{goods})
   }else{
     this.ctx.body = result.msg
   }


  }
}
module.exports = goodsController;
