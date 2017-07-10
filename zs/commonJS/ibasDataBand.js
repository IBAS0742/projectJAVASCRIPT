/**
 * 模仿 vue 的数据绑定，但是更多样化，同时修改之前的脚本 ibasConstructorForAutoObject.js
 * 降低服用难度
 */

var ibasDataBand = (function(){
    var opObject = {
        /*oneVarDic : { value },*/
        insert : defaultInsert,
        beforeRemove : function() {},
        remove : defaultRemove,
        afterRemove : function(){},
        isInit : false,
        set : defaultSet,
        get : defaultGet
    };
    //四个基础方法，增删改查
    /**
     * 1 增
     * name         : 对象名称
     * defaultValue : 对象默认值
     * opFn         : 操作函数集（见函数里说明）
     * isReWrite    : 是否重写
     */
    function defaultInsert(name,defaultValue,opFn,isReWrite) {
        /**
         * opFn : 里面有三个对象
         * 1    get 方法
         * 2    set 方法
         * 3    op  操作对象
         * 4    so  存放值的对象名称，默认为null
         * 5    init初始化so对象的方法
         * 6    isInit 设置是否后初始化，用于元素未完成创建
         * *************************************
         * so 和 op 不同，例如
         * 存放一个 input 对象
         * 其 so 为 input 对象
         * op 可以是 text 属性名称，表明要对text进行操作
         * 当然也可以通过修改set方法进行自定义
         * *******************
         * 当存放一个简单的string对象是，不需要一个op对象
         * 这时   so 为string对象    op 可以没有
         * *************************************************
         * 当存在op时不需要设置so
         * 当存在defaultValue时同样不需要so
         * so存在仅当需要使用init方法对so进行初始化时，这是的so为初始化前的内容
         * 而且一般仅仅在so的init方法无法立即执行时才给so进行设置
         * 例如dom加载完成前，希望将某一个元素加入到数据模型中，
         * 这时候直接的documnet.getElementById()可能无法获取到对象
         * 可以将id暂时存放到so中
         */
        if (!opFn) {
            opFn = {};
        }
        if (!this[name]) {
            this[name] = {
                set : opFn.set || defaultSet,
                get : opFn.get || defaultGet,
                op : opFn.op || null,
                so : opFn.so || ((opFn.init)?opFn.init(name) : defaultValue)
            };
        } else if (isReWrite) {
            this[name] = {
                set : opFn.set || defaultSet,
                get : opFn.get || defaultGet,
                op : opFn.op || null,
                so : opFn.so || ((opFn.init)?opFn.init(name) : defaultValue)
            };
        } else {
            console.warn(name + " 已经存在！");
        }
        if (opFn.isInit == undefined) {
            this[name].isInit = true;
        } else {
            this[name].isInit = opFn.isInit;
            this[name].init = opFn.init;
        }
    };
    /**
     * 2 删
     */
    function defaultRemove(name) {
        if (this[name]) {
            this.beforeRemove.call(this,name);
            delete this[name];
            this.afterRemove.call(this,name);
        }
    };
    /**
     * 3 改
     */
    function defaultSet(value) {
        if (!this.isInit) {
            if (this.init) {
                this.so = this.init(this.so);
            }
            this.isInit = true;
        }
        if (this.op) {
            this.so[this.op] = value;
        } else {
            this.so = value;
        }
    };
    /**
     * 4 查
     */
    function defaultGet() {
        if (!this.isInit) {
            if (this.init) {
                this.so = this.init(this.so);
            }
            this.isInit = true;
        }
        if (this.op) {
            return this.so[this.op];
        } else {
            return this.so;
        }
    };
    return opObject;
});

/* 将元素内容操作进行优化*/
//var idb = ibasDataBand();
/*
function eleIDB(idb) {
    idb.beforeRemove = function(name) {
        console.log(this[name]);
    }
    idb.afterRemove = function(name){
        console.log(name + " 对象已经删除");
    };
    return function(idb,name_,op,id) {
        var opFn = {
            init : function(id) {
                return document.getElementById(id);
            },
            op : op || "value",
            so : id,
            isInit : false
        };
        idb.insert(name_,null,opFn);
    }
}
*/
/**
 * 提示一个很好用的方法
   当需要封装一个请求时，可以使用一些方法
   var idb = ibasDataBand();
   var baseParam = 
            {
				url : "#",
				method : "post",
				complete : function(m) {
					console.log(m);
				}
			};
   idb.insert("ajaxData",baseParam,{op:"url"});
   这时可以通过
   idb.ajaxData.so.data = {};   //设置发送的内容
   idb.ajaxData.set("new url"); //设置请求位置
   在发送内容固定时，该方法有一定的简便性，只是实例较大
 */