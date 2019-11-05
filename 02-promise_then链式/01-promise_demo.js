// 定义当前promise的状态
const PENDING = 'PENDING'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'
//=================================================================
// promise对象
class Promise {
    constructor(exector) {

        // 初始化status为等待状态
        this.status = PENDING;
        // 成功的值
        this.value = undefined;
        // 失败的原因
        this.reason = undefined;

        // 存储成功的回调函数
        this.onResolvedCallbacks = [];
        // 存储失败的回调函数
        this.onRejectedCallbacks = [];

        // 成功的处理函数
        let resolve = (value) => {
            if (this.status == PENDING) {
                this.value = value;     //存储成功的值
                this.status = RESOLVED; //将当前的状态修改为成功状态
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }

        // 失败的处理函数
        let reject = (reason) => {
            if (this.status == PENDING) {
                this.reason = reason;   //存储失败的原因
                this.status = REJECTED; //将当前的状态修改为失败状态
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }

        // 当pormise抛出异常时
        try {
            exector(resolve, reject)    //立即执行函数
        } catch (e) {
            reject(e)
        }
    }

    /**
     * 参数：
     * @param {*} onFulfilled   失败状态
     * @param {*} onRejected    成功状态
     * 
     * 说明：
     *  promise的链式，可以一直.then下去，需要then返回一个promise
     *  onFulfilled与onRejected的返回值，可能是一个promise 也可能是一个普通值
     *      如果是promise，就采用它的状态
     *      如果是普通值，这个值就作为下一个then成功的结果
     * 
     */
    then(onFulfilled, onRejected) {

        // 防止then中没有函数 p.then().then().then()...
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected :  err => { throw err };

        /**
         * 创建一个promise，并返回一个promise，使得可以then可以进行链式调用
         * settimeout作用：  使得该方法中，可以获取到promise2
         * try作用： 处理onfulfilled可能抛出一个异常
         */
        let promise2 = new Promise((resolve, reject) => {

            // 成功状态的处理方法-------同步操作(执行器中没有异步代码)
            if (this.status == RESOLVED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);// x可能是promise 也可能是普通值
                        // 假如x是promise(有自己的状态)，需要让pormise2拥有x同样的状态
                        resolvePromise(promise2, x, resolve, reject); // 处理promise2和x的关系
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            }

            // 失败状态的处理方法-------同步操作(执行器中没有异步代码)
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }


            // 等待状态，将成功与失败的的操作进行保存-------同步操作(执行器中有异步代码)
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                });

                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }

        })

        return promise2;
    }
}


//=================================================================
// 处理promise2和x的关系 ，x是onFulfilled或onRejected的返回值
function resolvePromise(promise2, x, resolve, reject) {

    // 如果 x === promise2，则是会造成循环引用，自己等待自己完成，则报“循环引用”错误
    if (promise2 === x) {
        return reject(new TypeError('my Chaining cycle detected for promise'))
    }

    // 防止多次调用
    let called;

    // x是一个对象（不包含null）或是一个函数时
    if (x !== null && (typeof x === "object" || typeof x === "function")) {

        try {
            // 有可能x上会被手动地加上一个then属性
            let then = x.then;

            if (typeof then === 'function') {   // x是一个promise时

                // 相当于 x.then(y=>{},r=>{})
                then.call(x, y => {
                    if (called) return;
                    called = true;

                    // 递归，解决返回值里面扔是promise的问题
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {
                    if (called) return;
                    called = true;

                    // 采用promise失败结果向下传递
                    reject(r)
                })
            } else {    // 此时x是一个对象，即返回的是一个对象
                resolve(x)
            }
        } catch (e) {   //当x抛出一个异常时
            if (called) return;
            reject(e)
        }
    } else {  //x 是一个普通的值
        resolve(x)
    }
}


//================================================================
// 
/**
 * 验证promise的正确性
 * 1，先在后面加上下述代码
 * 2，npm 有一个promises-aplus-tests插件 npm i promises-aplus-tests -g 可以全局安装
 * 3，命令行 promises-aplus-tests [js文件名] 即可验证
 */


// 目前是通过他测试 他会测试一个对象
// 语法糖
Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve,reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  }


//=================================================================
// 导出一个promise
module.exports = Promise;


/**
 * 注意：当在promise中出现异步的时候，必须先将then中成功和失败的回调函数
 *      先进行保存，当promise中的状态发生改变的时候，才再进行执行
 */