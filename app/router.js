module.exports = app => {
    require('./router/admin')(app)//管理admin的路由
    require('./router/api')(app)//管理api的路由
    require('./router/index')(app)//管理index的路由 
}



