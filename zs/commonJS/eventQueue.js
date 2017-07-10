/**
 * Created by Administrator on 2017/7/2.
 */

/**
 * 该脚本是用于加载多个函数，但是函数间必须一个个结束后才能进行下一个
 * 例如函数 a,b,c,d,e
 * a 没结束不能执行 b ，b 没执行完不能执行 c ,...
 * 使用方法为
 * var e_q;
 * e_q = eventQueue([a,b,c,d,e]).invoke();//.setIntervalTime(1000);
 * 另外 函数 a,b,c,d,e 的默认方法为
 * function a() {
 *  e_q.steps[0] = 1;   //只要该值不为 false 类别即可 (false,0,null,undefined,...)
 *  //自然逻辑
 *  //逻辑接受后
 *  e_q.steps[0] = 0;   //也可以是 false,null,undefined,...
 * }
 * 另外 e_q.steps[0] 可以写入到回调当中
 * */

/**
 * events 为函数数组
 * tipObj 为消息对象 { show : function(){} , tipList : { before : [],after : [] } }
 *          show 为显示消息的方法
 *          tipList 为消息内容
 *                  before : 函数执行前消息
 *                  after : 函数执行结束后消息
 * 发生错误时可以将 steps[0] 设置为小于零的数值，并且设定 error 和 msg 和 errorcb 三个对象
 * error 为 ERROR 对象
 * msg 为 { show :fn , msg : "错误信息" }
 * errorcb 为错误回调函数
* */
var eventQueue = (function (events,tipObj) {
    var steps = [],
        inter,
        interTime = 500;
    if (events instanceof Array) {
        //events = [function () {}].concat(events);
        steps.push(0);
        for (var i = 0;i < events.length;i++) {
            steps.push(1);
        }
        //steps[0] = 0;
    }
    if (!tipObj) {
        tipObj = {
            show : console.log,
            tipList : {
                before : new Array(events.length),
                after : new Array(events.length)
            }
        }
    }
    var next = function (e) {
        var start = true,
            $this = e;
        inter = setInterval(function () {
            if (steps.length) {
                if (steps[0] < 0) {
                    //console.log("?");
                    //队列执行遇到错误
                    if ($this.error) {
                        throw $this.error;
                    }
                    if ($this.msg) {
                        $this.msg.show($this.msg.msg);
                    }
                    if ($this.errorcb) {
                        try {$this.errorcb();}catch (e){};
                    }
                    clearInterval(inter);
                } else if (steps[0]) {
                    console.log("加载中");
                } else {
                    if (start) {
                        start = false;
                    } else {
                        tipObj.show(tipObj.tipList.after.shift());
                    }
                    steps.shift();
                    if (events.length) {
                        events[0]();
                        tipObj.show(tipObj.tipList.before.shift());
                        events.shift();
                    } else {
                        tipObj.show(tipObj.tipList.after.shift());
                        clearInterval(inter);
                    }
                }
            } else {
                clearInterval(inter);
            }
        },interTime);
    };
    var setIntervalTime = function (time) {
        time = parseInt(time);
        if (time > 0) {
            interTime = time;
        }
    };
    return {
        steps : steps,
        invoke : function () {
            if (inter) {
                return;
            }
            next(this);
            return this;
        },
        setIntervalTime : setIntervalTime,
        error : null,
        msg : null,
        errorcb : null
    }
});

/* forDebug
function eventQueue_test() {
    var enq = eventQueue([
        function(){
            console.log(enq.steps[0]);
            setTimeout(function(){
                enq.steps[0] = 0;
            },2000);
        }
    ]).invoke();
}
*/

/*
eventQueue([
    function(){console.log(eventQueue.steps[0]);setTimeout(function(){
        eventQueue.steps[0] = 0;
    },2000)}
]).invoke();
*/
