// 定义当前promise的状态
const PENDING = 'PENDING'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'

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
            }
        }

        // 失败的处理函数
        let reject = (reason) => {
            if (this.status == PENDING) {
                this.reason = reason;   //存储失败的原因
                this.status = REJECTED; //将当前的状态修改为失败状态
            }
        }

        // 当pormise抛出异常时
        try {
            exector(resolve, reject)    //立即执行函数
        } catch (e) {
            reject(e)
        }
    }

    // then方法有两个参数onFullfilled  onRejected
    // onFulfilled：成功态回调函数
    // onRejected：失败态回调函数
    then(onFulfilled, onRejected) {

        // 成功状态的处理方法
        // 同步操作
        if (this.status == RESOLVED) {
            onFulfilled(this.value)
        }
        
        // 失败状态的处理方法
        // 同步操作
        if (this.status === REJECTED) {
            onRejected(this.reason)
        }

        // 等待状态，将成功与失败的的操作进行保存
        // 异步操作
        if (this.status === PENDING) {
            this.onResolvedCallbacks.push(() => {
                onFulfilled(this.value)
            });
            this.onResolvedCallbacks.push(() => {
                onRejected(this.reason)
            })
        }

    }
}

// 导出一个promise
module.exports = Promise;


/**
 * 注意：当在promise中出现异步的时候，必须先将then中成功和失败的回调函数
 *      先进行保存，当promise中的状态发生改变的时候，才再进行执行
 */