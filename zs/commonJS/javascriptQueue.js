/**
 * Created by Administrator on 2017/7/3.
 */

/**
 * 脚本的顺序加载，默认无回调
 * 使用方法
 * jsQueue(['js1Url','js2Url','js3Url',...],cb).next();
 */

var jsQueue = (function (jsList,cb) {
    var called = false;
    if (!cb) {
        cb = function () {};
    }
    if (jsList instanceof Array) {} else {
        throw new Error("jsList is not an array!");
    }
    var next = function () {
        if (jsList.length) {
            var script = document.createElement("script");
            script.src = jsList.shift();
            script.onload = function () {
                next();
            };
            document.head.appendChild(script);
        } else {
            if (cb) {
                cb();
            }
        }
    };
    return {
        next : function () {
            if (!called) {
                called = true;
                next();
            }
        }
    }
});

