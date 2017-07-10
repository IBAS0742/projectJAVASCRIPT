/**
 * Created by Administrator on 2017/6/21.
 */
//该对象用于自动填充字段信息
//例如问题详情页自动填充问题标题和问题详情等信息
//需要引入 common.js 使用其中的cookie

var autoFillData =  (function () {
    var options = {
        'src' : "data-src",
        'fn' : "data-src-fn",
        'tag' : "data-src-tag",
        'data' : 'data-pre-data',
        'default' : 'data-src-default',
        'tarAttr' : 'data-src-tarAttr',
        'fillFn' : 'data-src-fillFn',
        'once' : 'data-once',
        'errorMsg' : 'error-msg'
    };
    //这里的存放格式为 类型 ： 元素数组
    //
    var stack = {
        //同步函数
        sync : {},
        //异步函数
        async : {}
    };
    if ($ && !$$) {
        $$ = $;
    }
    if (!$$) {
        throw new Error("$$ 为定义");
    }
    var showError = (
            (splitAttrForManage(window,'toast.show') == window) ?
                function(err) {
                    console.log("error info : " + err);
                } : 
                toast.show
            );
    //这里的 CookieManage sessionStorageManage localStorageManage 都已经统一了接口形式
    var src = {
        cookie : CookieManage || {},
        sessionStorage : sessionStorageManage || {},
        localStorage : localStorageManage || {},
        //fn : function () {}
    };
    var autoScan = function (cb) {
        var $this = this;
        this.stack = {
            sync : {
            },
            async : {
            }
        };
        Array.prototype.slice.call($$('[' + options['src'] + ']')).forEach(function (i) {
            var $$ele = $$(i);
            var $$eleTag = $$ele.attr(options['tag']);
            var $$elePre = $$ele.attr(options['data']);
            if ($$elePre) {
                if ($$elePre in $this.stack.sync) {
                    $this.stack.sync[$$elePre].push(i);
                    return;
                } else {
                    var p = splitAttrForManage(window,$$elePre);
                    if (p != window && p) {
                        $this.stack.sync[$$elePre] = [];
                        $this.stack.sync[$$elePre].push(i);
                        return;
                    }
                }
            }
            if (!$$eleTag) {
                console.error("未设置 " + options["tag"] + " 字段");
                return ;
            }
            if ($$ele.attr(options['src']) in $this.src) {
                var ret = splitAttrForManage($this.src[$$ele.attr(options['src'])].get,$$eleTag);
                ret = ret ? ret : $$ele.attr(options['default']);
                if (!ret) {
                    showError("发生错误 字段[" + $$eleTag + "]");
                    console.info("发生错误 字段[" + $$eleTag + "]");
                    return ;
                }
                var attr = i.getAttribute(options['tarAttr']);
                if (!attr) {
                    var tarFn = i.getAttribute(options['fillFn']);
                    if (tarFn) {
                        splitAttrForManage(window,tarFn)(ret,i);
                        return ;
                    } else {
                        if (i.value == undefined) {
                            attr = 'innerText';
                        } else {
                            attr = 'value';
                        }
                    }
                }
                i[attr] = ret;
            } else if ($$ele.attr(options['src']) == 'fn') {
                if ($$ele.attr(options['fn']) in $this.stack.sync) {
                    $this.stack.sync[$$ele.attr(options['fn'])].push(i);
                } else {
                    $this.stack.sync[$$ele.attr(options['fn'])] = [];
                    $this.stack.sync[$$ele.attr(options['fn'])].push(i);
                }
            } else if ($$ele.attr(options['src']) == 'ajaxFn') {
                if ($$ele.attr(options['fn']) in $this.stack.async) {
                    $this.stack.async[$$ele.attr(options['fn'])].push(i);
                } else {
                    $this.stack.async[$$ele.attr(options['fn'])] = [];
                    $this.stack.async[$$ele.attr(options['fn'])].push(i);
                }
            }
            if ($$ele.attr(options['once'])) {
                $$ele.removeAttr(options['src']);
            }
        });
        stack = this.stack;
        for (var i in stack.sync) {
            (function (fn,tarEle) {
                var ret;
                if (fn instanceof Function) {
                    ret = fn();
                } else {
                    ret = fn;
                }
                tarEle.forEach(function (i) {
                    var retV = splitAttrForManage(ret,i.getAttribute(options['tag']));
                    retV = retV ? retV : i.getAttribute(options['default']);
                    if (!retV) {
                        var err = i.getAttribute(options['errorMsg']);
                        showError(err ? err : "发生错误");
                        console.info("发生错误");
                        return ;
                    }
                    var attr = i.getAttribute(options['tarAttr']);
                    if (!attr) {
                        var tarFn = i.getAttribute(options['fillFn']);
                        if (tarFn) {
                            splitAttrForManage(window,tarFn)(retV,i);
                            return ;
                        } else {
                            if (i.value == undefined) {
                                attr = 'innerText';
                            } else {
                                attr = 'value';
                            }
                        }
                    }
                    i[attr] = retV;
                });
            })(splitAttrForManage(window,i),stack.sync[i]);
        }
        for (var i in stack.async) {
            (function (fn,tarEle) {
                //myApp.showIndicator();
                fn(function (ret,cb) {
                    tarEle.forEach(function (i) {
                        var retV = splitAttrForManage(ret,i.getAttribute(options['tag']));
                        retV = retV ? retV : i.getAttribute(options['default']);
                        if (!retV) {
                            var err = i.getAttribute(options['errorMsg']);
                            if (err != '#') {
                                showError(err ? err : "发生错误");
                            }
                            console.info("发生错误");
                            return ;
                        }
                        var attr = i.getAttribute(options['tarAttr']);
                        if (!attr) {
                            var tarFn = i.getAttribute(options['fillFn']);
                            if (tarFn) {
                                splitAttrForManage(window,tarFn)(retV,i);
                                return ;
                            } else {
                                if (i.value == undefined) {
                                    attr = 'innerText';
                                } else {
                                    attr = 'value';
                                }
                            }
                        }
                        i[attr] = retV;
                    });
                    if (cb) {
                        cb();
                    }
                    //myApp.hideIndicator();
                });
            })(splitAttrForManage(window,i),stack.async[i]);
        }
        if (cb instanceof Function) {
            cb();
        }
    };
    return {
        stack : stack,
        src : src,
        auto : autoScan,
        setOptions : function(opt) {
            for (var i in opt) {
                options[i] = opt[i];
            }
            return this;
        },
        refleshSource : function() {
            var isOk = true;
            src = {
                cookie : (
                        CookieManage ? 
                            (CookieManage) : 
                            (isOk = false,{})
                    ),
                sessionStorage : (
                            sessionStorageManage ? 
                            (sessionStorageManage) : 
                            (isOk = false,{})
                        ),
                localStorage : (
                    localStorageManage ?
                        (localStorageManage) :
                        (isOk = false,{})
                    ),
                //fn : function () {}
            };
        },
        setShowError : function(fn) {
            showError = fn;
        }
    }
})();



