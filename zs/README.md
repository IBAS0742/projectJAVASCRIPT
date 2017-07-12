# autoFillData (强依赖 common.js 和 jQuery)
自动数据填充，用于自动填写页面元素信息，每次运行只进行一次。
### 属性
- autoFillData.stack 记录当前填充的内容，有两个子属性 sync 和 async ，分别记录同步和异步执行信息。
- autoFillData.src 一般源，有 cookie、session、localStorage 三种源，同时可以自己配置，但是建议不要删除原有源。
### 方法
- autoFillData.setOptions(opt)，opt写法请如下
```javascript
var options = {
        'src' : 'data-src',                 //源标记
        'fn' : 'data-src-fn',               //源函数标记
        'tag' : 'data-src-tag',             //源对象的索引路径
        'data' : 'data-pre-data',           //预先数据（优先级高于src）
        'default' : 'data-src-default',     //默认数据
        'tarAttr' : 'data-src-tarAttr',     //修改目标属性
        'fillFn' : 'data-src-fillFn',       //填写函数
        'once' : 'data-once',               //是否只写一次
        'errorMsg' : 'error-msg'            //错误提示信息
    };
```
- autoFillData.refleshSource()，刷新源，可能源没有加载完成时该函数已经加载结束，运行该函数会返回一个 bool 值，表示源是否加载结束。[注：源对应的文件是 common.js ]
- autoFillData.auto() 开启自动补全
- autoFillDate.setShowError(fn) 设置错误消息提示方法，默认为 framework7 的 toast ，但是不存在 framework 时使用 console.log 

### options 属性说明
字段名称|解释
--|--
src | 源，可以是 cookie、sessionStorage、localStorage、fn、ajaxFn 或者自定义的源，通过修改 src 属性
fn | 如果源是 fn 或者 ajaxFn ，表示源的求值函数，fn 要求返回一个 object , ajaxFn 要求格式为 fn(cb) ，cb 为回调函数，cb 会被传入 object 对象。
tag | 对象索引路径，例如 "location.href"，或 源里面对应的位置，例如 Cookie 对应为 '[cookie键][.索引路径]'
data | 预留数据，如果该数据存在，则忽略 src 的指向，但依旧使用 tag 作索引
default | 求值失败后的默认值
tarAttr | 默认为一个元素对象的 text 或 innerHTML
fillFn | 默认将会填充到 tarAttr 指向位置，如果函数有效则使用该函数填值，为跨元素使用，函数编写看例子
once | 默认为否，如果为是（任意值表示是），则屏蔽从第二次起的填值
errorMsg | 错误信息(默认为找不到值时使用)


### 使用demo (属性只需要写需要的部分)
```html
    <!--模拟cookie值-->
    <div 
        data-src = 'cookie',
        data-src-fn = '',
        data-src-tag = 'dataSrc.dataOne.a',
        data-pre-data = '',
        data-src-default = '10',
        data-src-tarAttr = '',
        data-src-fillFn = '',
        data-once = '',
        error-msg = ''
    ></div>
    <!--模拟cookie值，并使用自定义函数-->
    <div 
        data-src = 'cookie',
        data-src-fn = '',
        data-src-tag = 'dataSrc.dataTwo',
        data-pre-data = '',
        data-src-default = '10',
        data-src-tarAttr = '',
        data-src-fillFn = 'inHere',
        data-once = '',
        error-msg = ''
    ></div>
    <!--模拟cookie值，并使用自定义函数及默认值-->
    <div 
        data-src = 'cookie',
        data-src-fn = '',
        data-src-tag = 'dataSrc.dataThree',
        data-pre-data = '',
        data-src-default = '默认值',
        data-src-tarAttr = '',
        data-src-fillFn = 'inHere',
        data-once = '',
        error-msg = ''
    ></div>
    <!--模拟cookie值，并发生错误-->
    <div 
        data-src = 'cookie',
        data-src-fn = '',
        data-src-tag = 'dataSrc.dataFour',
        data-pre-data = '',
        data-src-default = '',
        data-src-tarAttr = '',
        data-src-fillFn = 'inHere',
        data-once = '',
        error-msg = '找不到对应数据也没有设定默认值'
    ></div>
    <!--模拟 同步函数-->
    <div 
        data-src = 'fn',
        data-src-fn = 'getData',
        data-src-tag = 'fn',
        data-pre-data = '',
        data-src-default = '',
        data-src-tarAttr = '',
        data-src-fillFn = 'inHere',
        data-once = '',
        error-msg = '找不到对应数据也没有设定默认值'
    ></div>
    <!--模拟 异步函数-->
    <div 
        data-src = 'ajaxFn',
        data-src-fn = 'getAjaxData',
        data-src-tag = 'ajax',
        data-pre-data = '',
        data-src-default = '取不到值',
        data-src-tarAttr = '',
        data-src-fillFn = 'inHere',
        data-once = '',
        error-msg = '找不到对应数据也没有设定默认值'
    ><span style="color : red;">2 s 后会赋值</span></div>
    <!--模拟 默认数据段 和 默认属性-->
    <div 
        style = "border : 2px solid"
        data-src = 'cookie',
        data-src-fn = '',
        data-src-tag = 'dataSrc.dataOne.a',
        data-pre-data = 'dataPreData',
        data-src-default = 'id10',
        data-src-tarAttr = 'id',
        data-src-fillFn = '',
        data-once = '',
        error-msg = ''
    >值附到了该元素的 id</div>
    <script>
        var dataSrc = {
            dataOne : {
                a : 1
            },
            dataTwo : {
                a : 3,
                b : 4
            }
        };
        var dataPreData = {
            dataSrc : {
                dataOne : {
                    a : 'id5'
                }
            }
        };
        //obj 为回传对象
        //i 为标记元素
        var inHere = function(obj,i) {
			i.innerHTML = JSON.stringify(obj);
        }
        CookieManage.add('dataSrc',dataSrc);
        function getData() {
            return {
                "fn" : "同步数据"
            };
        };
        function getAjaxData(cb) {
            setTimeout(function(){
                cb({
                    ajax : '异步数据'
                });
            },2000);
        };
        autoFillData.auto();
    </script>
```

# checkFields.js (强依赖 common.js 和 jQuery)
## 本脚本仅适应于 input textarea
#### 该文件包含了三个可用函数，下面分别介绍
## checkFields
该函数有一个参数，但是默认不填，该参数表示是否为二次调用，默认尝试执行两次，失败就不再测试。

## autoCheckFields
该函数有一个参数，同上面函数。

## checkFieldsAndSubmit
第一个参数为jquery.ajax 的参数除 data 部分，第二个参数如果存在则表示，使用自定义的请求函数，该函数将有一个参数，值为 jaquery.ajax 的 data 部分。
```javascript
checkFieldsAndSubmit({
    url : '',
    type : '',
    success : function() {},
    error : function() {},
    complete : function() {},
},function(ajaxParam){
    dearWith ajaxParam
})
```

## 属性解释
属性名 | 解释
--|--
data-check|该属性有三种取值，分别为 true、类型、元素对象 (下面解释)
error-msg|错误信息
ajax-name|jQuery.ajax.data 中对应的字段名称
ajax-data|值的来源（函数）
data-check-before|字段检查前处理函数 (接受当前input的值并返回一个对象)
type|字段类型
#### 解释data-check 属性
值|解释
--|--
true|表示该对象需要经过检查，并使用 type 字段作为检查的类型
类型|该值对应与 regExt 的字段，regExt 可以自行扩展
元素|用 # 标识，对应为另一个元素的 ajax-name ，可以用于密码重复检查，请看例子

#### data-check-before 例子
```javascript
//这里的 obj 对应于当前元素的 内容，inputElement.vaule
function checkBeforeExampleOne(obj) {
    // to do
    return {
        isOk : true,
        value : obj
    };
}
function checkBeforeExampleTwo(obj) {
    return {
        isOk : false,
        errMsg : '错误信息',
        fvalue : '新的值'
    };
}
```

### demo
```html
    <!--简单检查-->
    <input 
        placeholder = "值不为空测试"
        data-check = 'true'
        error-msg = '字段不能为空'
        ajax-name = 'first'
        ajax-data = ''
        data-check-before = 'firstCheckBefore'
        type = 'text' />
    <!--按类型检查-->
    <input 
        placeholder = "邮箱格式测试"
        data-check = 'email'
        error-msg = '邮箱格式不正确'
        ajax-name = 'second'
        ajax-data = ''
        data-check-before = ''
        type = 'text' />
    <!--按元素检查-->
    <div style = "border : 2px solid">
        <input 
            placeholder = ""
            ajax-name = 'third'
            ajax-data = 'getData'
            data-check-before = ''
            type = 'text' />
        <input 
            placeholder = "检查元素值相等"
            data-check = '#third'
            error-msg = '邮箱格式不正确'
            ajax-name = 'forth'
            ajax-data = ''
            data-check-before = ''
            type = 'text' />
    </div>
    <div id = "result"></div>
    <button onclick = "checkFieldsAndSubmit({},outputResult)">输出结果</button>
    <script>
        function firstCheckBefore(o) {
            if (!o) {
                alert("该值被清空");
            } else {
                alert("当前值为 ： " + o.toString());
            }
            return {
                isOk : true,
                value : o
            }
        }
        function getData() {
            return 123;
        }
        function outputResult(obj) {
            result.innerText = JSON.stringify(obj);
        }
        autoCheckFields();
    </script>
```

# execDock.js(强依赖 common.js)
执行异步加载函数的内容

### 属性
属性名称|解释
--|--
id| setInterval 对象，开始为 null
cb| 默认的执行函数
params| 执行函数所需的参数
$this| 执行函数 this 对象
maxTimes| 最大尝试次数
curTime | 当前尝试次数
interval| 每次测试的延时
execu| 默认的执行函数

#### Demo
```javascript
var mockFn = null;
execDock("mockFn").execu(function(){
    console.log("mockFn 已经执行");
});
setTimeout(function(){
    mockFn = function() {
        console.log("mockFn 执行过程");
    }
},3000);
```

# eventQueue.js
执行函数队列，方法本身带两个参数：
参数|说明
--|--
events| 将要运行的函数数组集合
tipObj| 对象，一个 show 属性用于展现信息，一个 tipList 对象，有 before 和 after 两个数组属性，用于给 show 展示函数执行前后的信息。
```javascript
tipObj = {
    show : console.log,
    tipList : {
        before : new Array(events.length),
        after : new Array(events.length)
    }
}
```

# 属性方法解释
属性|解释
--|--
steps| 这个属性只有 steps[0] 是对外操作开发的，并且是控制函数执行的属性。
error| 当流程出错时，用户自定义的错误(Error)对象
msg| 当流程出错时，用户定义的错误信息对象
errorcb| 当流程出错时，用户定义的错误回调
invoke| 用于开启队列执行
setIntervalTime| 传递一个参数用于设置循环等待判断是否执行下一个函数的时间

### 解释 setp[0] 如何控制函数执行
执行 invoke() 后，执行器会每隔 一段时间(默认为500ms，活着通过 setIntervalTime 设定的时间长度)检查当前 steps[0] 的值：
```javascript
          / 小于零 执行出错，停止队列
setps[0] = | 等于零 执行下一个函数
          \ 大于零 继续等待
```
出错时，执行器会检查是否设置了错误参数，并以恰当的方式进行展现。
错误参数|展现方式
--|--
error| throw error
msg | msg.show(msg.msg);
errorcb | errorcb()

### Demo
```javascript
var eq = null;
eq = eventQueue([
    function () {
        eq.steps[0] = 1;
        console.log("第一个函数");
        eq.steps[0] = 0;
    },
    function () {
        eq.steps[0] = 1;
        setTimeout(function(){
            console.log("第二个函数");
            eq.steps[0] = 0;
        },1000);
    },
    function () {
        eq.steps[0] = 1;
        try {
            throw new Error("错误");
        } catch (e) {
            eq.steps[0] = -1;
            eq.error = new Error("错误");
            eq.msg = {
                show : console.log,
                msg : "发生错误"
            },
            eq.errorcb = function() {
                console.log("错误回调");
            }
        }
    }
]).invoke();
```

# javascriptQueue.js
脚本加载队列，方法本身带两个参数：
参数|解释
--|--
jsList| 脚本列表 （脚本路径数组）
cb| 回调（加载完全部脚本后回调函数）

就只有一个函数 next ，相当于启动函数。

### Demo
```javascript
    var jsList = [
        'jsFile1.js',
        'jsFile2.js',
        'jsFile3.js',
        'jsFile4.js'
    ];
    jsQueue(jsList,function(){
        console.log("加载完成");
    });
```

