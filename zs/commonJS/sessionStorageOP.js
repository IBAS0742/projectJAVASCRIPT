/**
 * Created by IBAS on 2017/2/24.
 */
/***
 * 编写理由：
 *      方便字段的修改和查询插入操作
 */
/**
 * 事先引入 ibasDataBand.js 文件
 * */
var sessionStorageOP = (function(){
    ress = ibasDataBand({
        opObject : sessionStorage,
        set : function(val){
            if (val instanceof Object) {
                sessionStorage.setItem(this.name,JSON.stringify(val));
            } else {
                sessionStorage.setItem(this.name,val);
            }
        },
        get : function() {
            return sessionStorage.getItem(this.name);
        }
        //remove : function(name_) {
        //    sessionStorage.removeItem(name_);
        //}
    });
    return ress;
})();