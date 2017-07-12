/**
 * Created by Administrator on 2017/6/19.
 */

/**
 * 执行单元，因为脚本为异步加载，不知道何时加载结束，该脚本的目的是使页面能正常执行函数
 * */

var execDock = (function (cb,params,$this) {
    return {
        id : null,
        cb : cb,
        params : params,
        $this : $this,
        maxTimes : 10,  //最多的测试次数
        curTime : 0,    //当前测试次数
        interval : 500, //每次测试延时
        // set : function () {
        //     clearTimeout(this.id);
        //     this.id = null;
        //     this.cb = cb;
        //     this.params = params;
        //     if ($this) {
        //         this.$this = $this;
        //     }
        //     return this;
        // },
        //参数使用数组
        execu : function (cbfn) {
            var tarFn = splitAttrForManage(window,this.cb);
            if (tarFn && (tarFn != window)) {
                tarFn.apply(splitAttrForManage(window,this.$this),this.params);
                clearTimeout(this.id);
                this.id = null;
                if (cbfn) {
                    cbfn();
                }
            } else {
                if (this.curTime > this.maxTimes) {
                    clearTimeout(this.id);
                    this.id = null;
                    return ;
                }
                this.curTime++;
                console.log("...");
                var e = this;
                this.id = setTimeout(function () {
                    e.execu.call(e,cbfn);
                },this.interval);
            }
        }
    };
});
