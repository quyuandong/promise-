## promise原理的简单的描述

**参考文档**
- [最详细的手写Promise教程](https://juejin.im/post/5b2f02cd5188252b937548ab)


### 前言
promise是为了解决异步  回调有嵌套问题(``回调地狱``)
本人分三大步来进行promise原理的书写
-	``promiseBase``
	- 简单的promise,不包含链式调用，与一些静态方法
-	``promise_then链式``
	-	增添了then的链式调用
-	``promise_完整版``
	-	增添了一些静态方法

### 基本内容：


在promise中有  executor 执行器
默认创建出来的promise有三种状态
``等待态``（pending）   ``成功态``（fulfilled）  ``失败态``（reject）

promise  默认处于等待态
``resolve``,``reject`` 可以改变状态

### 从等待到失败有两种方式
- 返回一个失败的 Promise ``reject()``  
- 抛出一个异常   ``throw new Error()``


### 验证自己写的promise是否符合promise A+规范
**步骤：**

1，先在后面加上下述代码
2，全局安装 promises-aplus-tests插件 
>npm i promises-aplus-tests -g 

3，执行命令行 
>promises-aplus-tests [js文件名]   即可验证


``` javascript
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

```

### promise的优缺点

**优点**

>优雅解决异步问题，和异步并发

	
**缺点**
>内部也是基于回调的




### promise面试问题

-  then可以``链式调用``，多个then时，如果走到下一个then的``失败回调``？

>答：1，返回一个失败的promse  2，抛出一个错误
- then可以``链式调用``，多个then时，如何``终止``下一个then的调用？

>答：返回一个处于pending状态的promise

