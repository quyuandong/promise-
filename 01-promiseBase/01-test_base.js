let Promise = require("./01-promise_base.js")

//===================================================
// 同步测试
// let promise = new Promise((resolve, reject) => {
//     // resolve("包");
//     // reject("没钱");
//     // throw new Error("Nicole")
// })



//===================================================
// 异步测试
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve("包");
        // reject("没钱");
        // throw new Error("Nicole")
    }, 3000);
})



promise.then(data => {
    console.log(data);
}, err => {
    console.log(err);
})