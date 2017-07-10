/**
 * Created by Administrator on 2017/6/19.
 */

/**
 * 需要事先引入 commonCheck.js 和 commonRegex.js
 * */
if ($ && !$$) {
    $$ = $;
}
if (!$$) {
    throw new Error("$$ 没有定义");
};
var ts = (
            (splitAttrForManage(window,'toast.show') == window) ?
                console.log : 
                toast.show
            );

//邮箱
var emailRx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//手机号
var mphoneRx =/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
//邮件
var postRx = /^[a-zA-Z0-9 ]{3,12}$/;
//6-16只能包含字符和数字
var pwd1Rx = /[0-9 | A-Z | a-z]{6,16}/;
//金钱的正则表达式
var moneyRx = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
//输入过程中的金钱的正则表达式
var inMoneyRx = /(^.([0-9]{1,2})?$)|(^[1-9]([0-9]+)?.$)|(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
//检查非空
var notNullRx = /^$/;
//检查昵称格式
var nickNameRx = /^[0-9a-zA-Z]*$/;//g

var regExt = {
    "email" : function(obj) { return emailRx.test(obj)},
    "password" : function(obj) { return pwd1Rx.test(obj)},
    "money" : function(obj) { return moneyRx.test(obj)},
	'notNull' : function (obj) {
		return !notNullRx.test(obj);
	},
	"default" : function (obj) {
		return !notNullRx.test(obj);
	},
	//这个专门为重复验证开启(需要参数为回调函数)
	"repeat" : function (cb) {
		return cb();
	},
	//字符串长度大于等于4
	"nickName" : function (obj) {
		return (obj.toString().length >= 4 && obj.toString().length < 15 && nickNameRx.test(obj));
	},
	//无限制
	"none" : function (obj) {
		return true;
	}
};

/**
 * 统一检查所有字段是否符合规定
* */
function checkFields(t) {
    var isOk = true;
    var arr;
    try {
        arr = Array.prototype.slice.call($$("[data-check]"));
    } catch (e) {
        console.log(e);
        if (t) {
            return ;
        } else {
            checkFields(1);
        }
    }
    arr.forEach(function (target) {
        if (!isOk) {
            return;
        }
        var k = $$(target);
        var tarExt;
        var dataCheck = k.attr("data-check");
        if (!dataCheck) {
            return ;
        } else if (dataCheck == "true") {
            tarExt = k.attr("type");
        } else {
            tarExt = k.attr("data-check");
        };
        if (tarExt[0] == '#') {
            if ($$("[ajax-name='" + tarExt.substring(1) + "']").length) {
                isOk = checkOneFieldHelp($$("[ajax-name='" + tarExt.substring(1) + "']")[0],k[0]);
            };
            return;
        };
        if (tarExt in regExt) {} else {
            tarExt = "default";
        };
        isOk = checkOneFieldHelp(tarExt,target);
    });
    return isOk;
};

/**
 * 自动检查每一个字段
 * */
function autoCheckFields(t) {
    var arr;
    try {
        arr = Array.prototype.slice.call($$("[data-check]"));
    } catch (e) {
        console.log(e);
        if (t) {
            return ;
        } else {
            autoCheckFields(1);
        }
    }
    arr.forEach(function (i) {
        var k = $$(i);
        var tarExt;
        var dataCheck = k.attr("data-check");
        if (!dataCheck) {
            return ;
        } else if (dataCheck == "true") {
            tarExt = k.attr("type");
        } else {
            tarExt = k.attr("data-check");
        };
        if (tarExt[0] == '#') {
            if ($$("[ajax-name='" + tarExt.substring(1) + "']").length) {
                checkOneFieldClosure($$("[ajax-name='" + tarExt.substring(1) + "']")[0],k);
            };
            return;
        };
        if (tarExt in regExt) {} else {
            tarExt = "default";
        };
        checkOneFieldClosure(tarExt,k);
    });
};

/**
 * 检查完成字段后自动提交
 * obj 为 ajax 数据对象
 * submit 默认为 undefined 则使用默认方法进行提交，但设定为方法时，使用指定方法提交
 * */
function checkFieldsAndSubmit(obj,submitFn) {
    if (!obj) {
        throw new Error("obj 为空");
    }
    obj.data = {};
    if (obj._data) {
        for (var i in obj._data) {
            obj.data[i] = obj._data[i];
        }
    }
    if (checkFields()) {
        Array.prototype.slice.call($$("[ajax-name]")).forEach(function (i) {
            var ii = $$(i);
            if (ii.attr('ajax-data')) {
                var tarFn = getFnFromString(ii.attr('ajax-data'));
                if (tarFn instanceof Function) {
                    obj.data[ii.attr('ajax-name')] = tarFn();
                } else {
                    console.error(ii + " 不是正确的函数名称");
                }
            } else {
                obj.data[ii.attr('ajax-name')] = i.value;
            }
        })
    } else {
        console.log("参数有误");
        return ;
    };
    if (!submitFn) {
        $$.ajax(obj);
    } else {
        submitFn(obj);
    }
};

var getFnFromString = function (str) {
    var tarFn = window;
    str.split('.').forEach(function (iii) {
        if (iii in tarFn) {
            tarFn = tarFn[iii];
        }
    });
    return tarFn;
};

//检查子段函数封闭为闭包
var checkOneFieldClosure = (function (targetEle,k) {
    return checkOneField(targetEle,k)
});
//检查字段
var checkOneField = function (tarExt,k) {
    k.on('change',function (e) {
        checkOneFieldHelp(tarExt,e.target);
    });
};
//辅助函数，目的是代码分离更完整
//tarExt    正则名称，对应于 commonCheck.js 中 regExt 中的属性名称
//          或者也可以是元素(Element)对象，用于检查值是否一致，例如 重复密码，则该值为将提交服务器字段的元素对象
//target    检查的对象元素(Element)对象
//返回值为检查的结果
var checkOneFieldHelp = function (tarExt,target) {
    var t = $$(target);
    var isRight = false;
    target.value = target.value.toString().trim();
    if (t.attr('data-check-before')) {
        var obj_ = getFnFromString(t.attr('data-check-before'))(target.value);
        if (obj_.isOk) {
            target.value = obj_.value;
        } else {
            if (obj_.errMsg) {
                ts(obj_.errMsg);
            }
            if (obj_.fvalue) {
                target.value = obj_.fvalue;
            }
            return ;
        }
    }
    if (tarExt instanceof Element) {
        if (target.value == tarExt.value) {
            isRight = true;
        }
    } else if (regExt[tarExt](target.value)) {
        isRight = true;
    };
    if (isRight) {
        target.style.color = 'green';
        target.style.textDecoration = 'none';
    } else {
        ts(t.attr('error-msg') ? t.attr('error-msg') : "红色标记部分错误！");
        target.style.color = 'red';
        target.style.textDecoration = 'line-through';
        if (t.one) {
            t.one('keypress',function (e) {
                target.style.color = 'green';
                target.style.textDecoration = 'none';
            });
        } else if (t.once) {
            t.once('keypress',function (e) {
                target.style.color = 'green';
                target.style.textDecoration = 'none';
            });
        } else {
            throw new Error("one 和 once 都不存在。");
        }
    }
    return isRight;
};