

// // var a = [];

// // var s = 'qwer:tyuio,asdfg:hjkl,zxcv'
// // function get(s){
// //     var str = s;
// //     console.log('str===='+str);
// //     var beg;
// //     var en;
// //     var x = 0;
// //     for(var i=x;i<str.length;i++){
// //         if(str[i] == ':'){
// //             var beg = i+1;
// //             for(var j=i+1;j<str.length;j++){
// //                 if(str[j]==','){
// //                     var en = j+1;
// //                     a.push(str.slice(beg,en));
// //                 }
// //                 var x = j+1;
// //                 continue;
// //             }
// //         }
        
// //     }
// //     return a;

// // }

// // console.log(get(s));


 
// var output=(function(x){
//     delete x;
//     return x;

// })(0)
// console.log(output)

var ary=[0,1,2];
ary[10]=10;
console.log(ary.filter(function(x){
    return x===undefined;
}))