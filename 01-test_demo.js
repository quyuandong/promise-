let Promise = require("./01-promise_demo.js")

// =========================================================
// 循环调用问题的示例
// let p = new Promise((resolve, reject) => {
//     resolve()
// })
// let promise2 = p.then(()=>{
//     return promise2;  // 我在等待我自己去洗衣服
// })
// // UnhandledPromiseRejectionWarning: TypeError: Chaining cycle detected for promise #<Promise></Promise>
// promise2.then(null,data=>{
//     console.log(data) //  my Chaining cycle detected for promise #<Promise></Promise>
// })


let p = new Promise((resolve, reject) => {
    resolve(100)
})
p.then().then().then(data=>console.log(data),err=>console.log(err))