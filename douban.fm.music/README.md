# musicPlay.js
仅支持 H5

方法|解释
--|--
init|初始化播放器
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

