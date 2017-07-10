/**
 * Created by Administrator on 2017/7/6.
 */

/**
 * 基于 framework 7 的提示队列
 * */
/**
 * f7Obj : framework7 对象
 * topEle : 顶级元素（用于存放 popover 元素）
 * tipObj : {
 *      cb : [],        //回调数组
 *      tarEle : [],    //目标元素数组(提示将指向该元素)
 *      content : []    //内容数组
 * }
 * */
var tipQueue = (function (f7Obj,topEle,tipObj) {
    var baseTip = $$(
        '<div class="popover sidePanelStatement modal-in" style="width: auto;">' +
            '<div class="popover-angle on-top" style="left: 63.5px;"></div>' +
            '<div class="popover-inner">' +
                '<div class="content-block" tar="tipContent">' +
                '</div>' +
            '</div>' +
        '</div>'
    );
    $$(topEle).append(baseTip);
    var invoke = function () {
        if (tipObj.content.length) {
            baseTip.find('[tar="tipContent"]').html(tipObj.content.shift());
            var $this = this;
            var cb = tipObj.cb.shift();
            baseTip.once('popover:closed',function () {
                $this.invoke();
                if (cb) {
                    cb();
                }
            });
            setTimeout(function () {
                f7Obj.popover(baseTip,$$(tipObj.tarEle.shift()));
            },100);
        }
        return false;
    };
    return {
        invoke : invoke
    };
});
var tipQueueAt = function () {};

