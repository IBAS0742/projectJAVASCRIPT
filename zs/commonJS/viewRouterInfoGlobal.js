/**
 * Created by Administrator on 2017/7/1.
 */

//全局的控制路由

// options = {
//     leftPanel : {
//         ele : HTMLElement,  //侧栏的 div 元素
//         tar : [{
//             $get : '$描述',
//             limit : 0,      //默认权限为 0 时可以访问，权限低于零时不可访问
//             unlimit : 1     //权限为 1 时不可访问
//         },...]
//     },
//     views : {
//         viewList : [{
//             name : '',  //视图名称
//             limit : 0,
//             unlimit : 1
//         },...]
//     }
// };

//默认登陆后的权限升为 1
var viewRouterInfoGlobal = (function (options) {
    viewRouterInfoGlobal = function () {
        console.log('该函数为单例');
    };
    var defaultLimit = 0,
        viewList,
        invokeOver = false;
    var opCookie = function () {
    };
    //将当前权限进行应用
    var invoke = function () {
        options.leftPanel.tar.forEach(function (i) {
            if (defaultLimit >= i.limit && defaultLimit < i.unlimit) {
                i.$get.css({display : 'block'});
            } else {
                i.$get.css({display : 'none'});
            }
        });
        invokeOver = true;
    };
    //判断是否有权加载页面
    var canLoadView = function (page,cb,defaultAction) {
        //修改页面默认事件
        if (defaultLimit >= viewList[page.name].limit && defaultLimit < viewList[page.name].unlimit) {
            cb(defaultAction);
        } else {
            //遣返
            myApp.alert("无法访问该页面",function () {
                cb("mainView.back");
            });
        }
    };
    function setLimit(limit_) {
        var t = parseInt(limit_);
        defaultLimit = t;
        invoke();
    }
    function gotoView(viewName,times) {
        if (times) {
            if (times > 10) {
                throw new Error("Something error!");
            }
        } else {
            times = 1;
        }
        if (invokeOver) {
            if (viewName in viewList) {
                mainView.router.loadPage(viewName);
            }
        } else {
            setTimeout(function () {
                gotoView(viewName,times + 1);
            },500);
        }
    }
    function init() {
        //初始化侧栏
        {
            var panel = options.leftPanel.ele;
            options.leftPanel.tar.forEach(function (i,j) {
                options.leftPanel.tar[j].$get = $$(i.$get);
            });
        }
        //获取权限值
        var userInfoObj = CookieManage.get('userInfoObj');
        indexMethod.userInfoObj = userInfoObj;
        if (userInfoObj) {
            indexMethod.getUserInfo(userInfoObj,function (isOk) {
                if (isOk) {
                    defaultLimit = 1;
                } else {
                    defaultLimit = 0;
                }
                invoke();
            });
        } else {
            defaultLimit = 0;
            invoke();
        }
        viewList = options.views.viewList;
        for (var i in viewList) {
            (function (i) {
                myApp.onPageInit(i,function (page) {
                    canLoadView(page,function (action) {
                        if (options.action[i]) {
                            execDock(action).execu();
                        }
                    },options.action[i]);
                });
            })(i);
        }
    };
    init();
    return {
        //canLoadView : canLoadView,
        setLimit : setLimit,
        options : options,
        //userInfo : userInfo,
        gotoView : gotoView,
        //invoke : invoke
    };
});//(options)

