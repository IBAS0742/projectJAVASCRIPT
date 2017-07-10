/**
 * Created by LJF on 2017/3/18.
 */
// var PROJECT_NAME = "zs";
//
// var USER_INFO;
/**
 * CookieManage : cookie 操作类
 * getParam : 获取 url 参数
 * compareTime : 对比时间
* */

/**
 * cookie 操作类
 * 方法           参数（依次）                      \   返回值
 * 增 set        字段名 值 时间（天） 作用域        \   操作类
 * 删 del        字段名 作用域                      \   操作类
 * 改 change     字段名 新值                        \   操作类
 * 查 get        字段名                             \   值
 * */
var CookieManage = (function(adv) {
    var defaultDomain = '';
    if (window.location.href.indexOf('localhost') + 1) {
        defaultDomain = "localhost";
    }
    //var this_ = window;
    var setCookie,
        delCookie,
        setCookieValue,
        getCookieValue;
    if (adv) {
        setCookie = function(cname, cvalue, exdays,Domain){
            var d = new Date();
            if(!Domain){Domain=defaultDomain};
            if (exdays) {} else {
                exdays = 1;
            }
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            if (cvalue instanceof Object) {
                document.cookie = cname + "=" + JSON.stringify(cvalue) + "; " + expires + ";" +
                    (Domain ? "path=/; domain="+Domain : '');
            } else {
                document.cookie = cname + "=" + cvalue + "; " + expires + ";" +
                    (Domain ? "path=/; domain="+Domain : '');
            }
            return this;
        };
        delCookie = function(name,Domain) {
            setCookie(name,"",-1,Domain);
            return this;
        };

        setCookieValue = function(cname, cvalue) {
            if (cvalue instanceof Object) {
                document.cookie = cname + "=" + JSON.stringify(cvalue) + "; path=/;" + 
                    (defaultDomain ? " domain="+defaultDomain : "");
            } else {
                document.cookie = cname + "=" + cvalue + "; path=/;" + 
                    (defaultDomain ? " domain="+defaultDomain : "");
            };
            return this;
        };
        getCookieValue = function(cookieName) {
            var cookieValue = document.cookie;
            var cookieStartAt = cookieValue.indexOf("" + cookieName + "=");
            if (cookieStartAt == -1) {
                cookieStartAt = cookieValue.indexOf(cookieName + "=");
            }
            if (cookieStartAt == -1) {
                cookieValue = null;
            } else {
                cookieStartAt = cookieValue.indexOf("=", cookieStartAt) + 1;
                cookieEndAt = cookieValue.indexOf(";", cookieStartAt);
                if (cookieEndAt == -1) {
                    cookieEndAt = cookieValue.length;
                }
                cookieValue = unescape(cookieValue
                    .substring(cookieStartAt, cookieEndAt));// 解码latin-1
            }
            try {
                return JSON.parse(cookieValue);
            } catch (e) {
                console.warn("JSON.parse ocu error");
                return cookieValue;
            }
        };
    } else {
        delCookie = function(name,Domain) {
                setCookie(name, "", -1,Domain);
        };
        setCookie = function(cname, cvalue, exdays,Domain) {
            var d = new Date();
            if(!Domain){Domain=defaultDomain};
            if (exdays) {} else {
                exdays = 1;
            }
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/; domain="+Domain;
        };

        setCookieValue = function(cname, cvalue) {
            document.cookie = cname + "=" + cvalue + ";path=/; domain="+defaultDomain;
        };
        getCookieValue = function(cookieName) {
            var cookieValue = document.cookie;
            var cookieStartAt = cookieValue.indexOf("" + cookieName + "=");
            if (cookieStartAt == -1) {
                cookieStartAt = cookieValue.indexOf(cookieName + "=");
            }
            if (cookieStartAt == -1) {
                cookieValue = null;
            } else {
                cookieStartAt = cookieValue.indexOf("=", cookieStartAt) + 1;
                cookieEndAt = cookieValue.indexOf(";", cookieStartAt);
                if (cookieEndAt == -1) {
                    cookieEndAt = cookieValue.length;
                }
                cookieValue = unescape(cookieValue
                    .substring(cookieStartAt, cookieEndAt));// 解码latin-1
            }
            return cookieValue;
        };
    };
    return {
        add : setCookie,
        del : delCookie,
        change : setCookieValue,
        get : getCookieValue
    }
})(true);
/* 同上但少了时间和作用域 */
var sessionStorageManage = (function () {
    var add = function (sname,svalue) {
        if (svalue instanceof Object) {
            sessionStorage.setItem(sname,JSON.stringify(svalue));
        } else {
            sessionStorage.setItem(sname,svalue);
        }
        return this;
    };
    var del = function (sname) {
        if (sname in sessionStorage) {
            delete sessionStorage[sname];
        }
        return this;
    };
    var change = function(sname,svalue) {
        this.add(sname,svalue);
        return this;
    };
    var get = function (sname) {
        if (sname in sessionStorage) {
            try {
                return JSON.parse(sessionStorage[sname]);
            } catch (e) {
                console.error('sname 对应于非对象值');
                return (sessionStorage[sname]);
            }
        } else {
            return null;
        }
    };
    return {
        add : add,
        del : del,
        change : change,
        get : get
    }
})();
/* 同上但少了时间和作用域 */
var localStorageManage = (function () {
    var add = function (sname,svalue) {
        if (svalue instanceof Object) {
            localStorage.setItem(sname,JSON.stringify(svalue));
        } else {
            localStorage.setItem(sname,svalue);
        }
        return this;
    };
    var del = function (sname) {
        if (sname in localStorage) {
            delete localStorage[sname];
        }
        return this;
    };
    var change = function(sname,svalue) {
        this.add(sname,svalue);
        return this;
    };
    var get = function (sname) {
        if (sname in localStorage) {
            try {
                return JSON.parse(localStorage[sname]);
            } catch (e) {
                console.error('sname 对应于非对象值');
                return (localStorage[sname]);
            }
        } else {
            return null;
        }
    };
    return {
        add : add,
        del : del,
        change : change,
        get : get
    }
})();
/**
 * 这个函数本来是为了 跟高级的包装以上几个函数的，当然也可以有其他用法，使用方法为
 * splitAttrForManage(fn/object,param1,param2,...);
 * 第一个参数必须是对象或者函数，另外函数必须放回一个对象
 * 第二个参数为对象的属性链，不同级属性见用点隔开，
 * 例如
 * splitAttrForManage(fn,'window.location.href',param1,param2,...);
 * 同时当第一个参数为函数时，属性连的第一个参数为函数的第一个参数，如果为空请使用(.)开头表示
 * 例如
 * splitAttrForManage(fn,'.window.location.href',param1,param2,...);
 * 但是一定程度上限制了函数的编写规则，同时函数对象被重写，不能在函数中使用this关键字，因为此时的关键字已经改为了window，
 * =================================================================================
 * splitAttrForManage({a : {name : 'ibas'}},'a.name')  => "ibas"
 * ==================================================================================
 * sessionStorageManage.add('a',{name:'ibas'});
 * splitAttrForManage(sessionStorageManage.get,'a.name') => 'ibas'
 * */
var splitAttrForManage = function () {
    var args = arguments;
    if (args.length > 1) {
        var fn = args[0];
        if (fn instanceof Function) {
            var params = [];
            for (var i = 1;i < args.length;i++) {
                params.push(args[i]);
            }
            if (params[0].indexOf('.') + 1) {
                var attrs = params[0].split('.');
                params[0] = attrs.shift();
                var ret = fn.apply(null,params);
                attrs.forEach(function (i) {
                    if (!ret) {
                        return;
                    }
                    if (i in ret) {
                        ret = ret[i];
                    } else {
                        ret = null;
                        return null;
                    }
                });
                return ret;
            } else {
                return fn.apply(null,params);
            }
        } else if (fn instanceof Object) {
            var top = fn;
            if (args[1]) {
                var attrs = args[1].split('.');
                attrs.forEach(function (i) {
                    if (i in fn) {
                        fn = fn[i];
                    } else {
                        return top;
                    }
                });
            }
            return fn;
        } else {
            throw new Error("第一个参数必须是一个函数或对象");
        }
    } else {
        throw new Error('参数个数不足');
    }
};

//用于获取到url中带入的参数
//url 为 localhost/zs?a=1&b=1&b=2 时
//var par = getParam();
//par = { a : 1 , b : [1,2]}
function getParam() {
    var param = window.location.href.split('?');
    if (param.length == 1) {
        return {};
    } else {
        var dic = {};
        param[1].split('&').forEach(function(i) {
            var p = i.split('=');
            if (dic[p[0]]) {
                if (dic[p[0]] instanceof Array) {
                    dic[p[0]].push(p[1]);
                } else {
                    dic[p[0]] = [dic[p[0]],p[1]];
                }
            } else {
                dic[p[0]] = p[1];
            }
        });
        return dic;
    }
}

//用于格式化时间
//(new Date()).format('yyyy-MM-dd hh:mm');
Date.prototype.format =function(format) {
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    };
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
//数字四舍五入
Number.prototype.ceil = function (bit) {
    if (!bit) {
        bit = 2;
    }
    var ret = parseFloat(this.toString());
    return Math.ceil(ret * Math.pow(10,bit)) / Math.pow(10,bit);
};
Number.prototype.round = function (bit) {
    if (!bit) {
        bit = 2;
    }
    var ret = parseFloat(this.toString());
    return Math.round(ret * Math.pow(10,bit)) / Math.pow(10,bit);
};

//判断日期，时间大小
function compareTime(startDate, endDate) {
    if (startDate.length > 0 && endDate.length > 0) {
        var startDateTemp = startDate.split(" ");
        var endDateTemp = endDate.split(" ");

        var arrStartDate = startDateTemp[0].split("-");
        var arrEndDate = endDateTemp[0].split("-");

        var arrStartTime = startDateTemp[1].split(":");
        var arrEndTime = endDateTemp[1].split(":");

        var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);
        var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);

        if (allStartDate.getTime() >= allEndDate.getTime()) {
            //alert("startTime不能大于endTime，不能通过");
            return false;
        } else {
            //alert("startTime小于endTime，所以通过了");
            return true;
        }
    } else {
        //alert("时间不能为空");
        return false;
    }
}






