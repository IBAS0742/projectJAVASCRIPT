/*
需要使用到的js有commonReg.js
用于存放默认的输入检查事件
*/
var commonCheck = (function(){
	/*
		这里只是对检查事件进行二次封装，
		检查规则在commonRex.js中进行了定义
	*/
	var dic = {		//邮箱检查
		"email" : {
			event : "onchange",
			fn : function(obj) { return emailRx.test(obj)},
			attr : "value",
			msg : "邮箱格式不正确"
		},
		//密码检查
		"password" : {
			event : "onchange",
			fn : function(obj) { return pwd1Rx.test(obj)},
			attr : "value",
			msg : "密码格式不正确"
		},
		//金钱检查
		"money" : {
			event : "onchange",
			fn : function(obj) { return moneyRx.test(obj)},
			attr : "value",
			msg : "金钱格式为123.45"
		},
		//非空检查
		"notNull" : {
			event : "onchange",
			fn : function(obj) { return notNullRx.test(obj)},
			attr : "value",
			msg : "金钱格式为123.45"
		}
	};

	return function(type) {
		return dic[type];
	}
})();

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





