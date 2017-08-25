# musicPlay.js
仅支持 H5

方法|解释
--|--
init|初始化播放器
autoPlay|自动初始化播放器
control|控制方法集，时间关系，基本没有实现，使用前请自行实现

讲解 init 方法的使用
```javascript
/**
* tar 表示显示当前歌词的 div 元素对象
* showMethod 显示歌词的方法，默认为空使用默认方法
*/
function init(tar,showMethod)
/**
* showMethod 例子
* a,b,c 表示当前播放位置的三句歌词，其中b为当前正在播放位置的歌词
* 返回值为一个 html 结构，将被自动作为 init 方法中 tar 元素的内容被添加
* 具体写法请阅读源码的 defaultShowLyric 方法
*/
ElementXML showMethod = function(a,b,c) {...};
```

讲解 autoPlay 方法使用
```javascript
/**
* tag 为分类的名称，将代码中的 musicTag
* 没有返回值
*/
void autoPlay(tag);
```

讲解 control 中的方法

方法|解释
--|--
play|播放（audio.play）
pause|暂停（audio.pause）
next|下一首（根据循环模式播放下一首）
single|单曲循环（修改播放模式）
loop|列表循环（修改播放模式）
allLoop|分类循环（修改播放模式）
changList|播放当前分类下的一个指定列表列表
showOneTag|获取新分类内容

稍微说明一下 changeList 和 showOneTag 的使用方法
```javascript
 /**
 * 这里需要先说明一下这里的音乐结构
 * 分类 -> 列表 -> 歌曲
 * 例如
 * 分类：动漫 -> 宫崎骏专辑 -> 移动的城堡主题曲
 */
 
 /**
 * id 为列表 id，而分类为当前分类，通过 showTag 修改分类
 * cb 回调函数（格式如下）
 * function (obj) {
 *    // obj 为当前分类的主体内容，可以通过调试查看其格式
 *    // 推荐将内容结合到前端展示中
 * }
 */
 void changeList(id,cb);
 
 /**
 * tag 分类名称
 * cb 格式如上 (changeList 中的 cb)
 */
 void showOneTag(tag,cb);
```

### Demo
```html
<!--使用到了JQ-->
<script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
<script src="musicPlay.js"></script>
<div id="lyricShow"></div>
<script>
    $(function () {
        musicPlay.init("#lyricShow");
    });
</script>
```