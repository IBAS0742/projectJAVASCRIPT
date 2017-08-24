/**
 * Created by scholarly on 2017/8/24.
 */

var musicPlay = (function () {
    var audio,
        musicTag = [
            "为你推荐","未分类","流行","摇滚",
            "民谣","原声","轻音乐","古典",
            "电子","华语","欧美","日语",
            "粤语","独立","动漫","新世纪",
            "中国摇滚","R&B"],
        musicList = {},
        //当前播放音乐列表
        curMusicList = {},
        //当前歌词位置
        curLyricInd = 0,
        //当前整首歌未用到的歌词部分
        curLyric = [],
        //当前播放歌曲唯一标记
        curMusic = "",
        //当前歌曲播放到的歌词
        curLyricLine = "",
        canPlay = false,
        showLyricEle = null,
        showMethod;
    //定义一个 audio 元素
    var init = function (tar,showMethod_) {
        init = function () {};
        showMethod = showMethod_ || defaultShowLyric;
        audio = document.createElement("audio");
        audio.style.display = "none";
        audio.setAttribute("controls","");
        document.body.appendChild(audio);
        audio.ontimeupdate = function(e) {
            //遍历所有歌词，看哪句歌词的时间与当然时间吻合
            var i = curLyricInd;
            while (curLyric.length > i) {
                if (this.currentTime <= curLyric[i][0]) {
                    refleshLyric(i);
                    return;
                } else {
                    i++;
                }
            }
        };
        showLyricEle = $(tar);
    };
    var refleshLyric = function (ind) {
        if (ind == curLyricInd) {
            if (!ind) {
                showLyricEle.html(showMethod("",curLyric[0][1],(ind < curLyric.length) ? curLyric[1][1] : ""));
            }
        } else {
            //上移
            curLyricInd = ind;
            console.log(curLyric[ind]);
            if (ind == 0) {
                showLyricEle.html(showMethod("",curLyric[0][1],(ind < curLyric.length) ? curLyric[1][1] : ""));
            } else if (ind == curLyric.length - 1) {
                showLyricEle.html(showMethod(((ind - 1 >= 0) ? curLyric[ind - 1][1] : ""),curLyric[ind][1],""));
            } else {
                showLyricEle.html(showMethod(curLyric[ind - 1][1],curLyric[ind][1],curLyric[ind + 1][1]));
            }
        }
    };
    var defaultShowLyric = function (a,b,c) {
        return (
            '<div style="color: gray;min-height: 1em;font-size: 1em;text-align: center;word-break: break-all">' + a + '</div>' +
            '<div  style="color: black;min-height: 1em;font-size: 1.4em;text-align: center;word-break: break-all">' + b + '</div>' +
            '<div  style="color: gray;min-height: 1em;font-size: 1em;text-align: center;word-break: break-all">' + c + '</div>'
        );
    };
    //获取大分类下的音乐列表
    var initMusicList = function () {
        musicTag.forEach(function (i,j) {
            var ret;$.ajax({
                url : "http://www.halahala.cn:3080/cor",
                data : {
                    url : "https://douban.fm/j/v2/songlist/explore?type=hot&genre=" + j + "&limit=100&sample_cnt=5",
                    type : "豆瓣测试",
                    ret : "false"
                },
                success : function(m) {
                    try {
                        var js = JSON.parse(m.text);
                        musicList[i] = {
                            info : js,
                            list : {}
                        };
                    } catch(e) {
                        console.warn("发生错误 tag = " + i);
                    }
                }
            });
        })
    };
    //获取小分类下的音乐列表
    var getMusic = function (tag,id,cb) {
        $.ajax({
            url : "http://www.halahala.cn:3080/cor",
            data : {
                url : "https://douban.fm/j/v2/songlist/" + id + "/?kbps=128",
                type : "豆瓣测试",
                ret : "false"
            },
            success : function(m) {
                try {
                    var arr = JSON.parse(m.text).songs;
                    if (arr.length) {
                        musicList[tag].list[id] = arr;
                        if (cb) {
                            cb(tag,id,0);
                        }
                    }
                } catch (e) {
                    console.warn("tag 为 " + tag + " 的音乐列表无法获取到 id 为 " + id + " 的音乐列表");
                }
            }
        });
    };
    var getLyric = function (musicObj,musicId) {
        if (musicObj) {
            curMusic = musicId;
            if (musicObj.lyric) {
                curLyric = musicObj.lyric;
                curLyricInd = 0;
                curLyricLine = "";
                return musicObj.lyric;
            } else {
                curLyric = [[0,"正在获取歌词"]];
                curLyricInd = 0;
                curLyricLine = "";
                (function (musicId) {
                    var ret;$.ajax({
                        url : "http://www.halahala.cn:3080/cor",
                        data : {
                            url : "https://douban.fm/j/v2/lyric?sid=" + musicObj.sid + "&ssid=" + musicObj.ssid,
                            type : "豆瓣测试"
                        },
                        success : function(m) {
                            try {
                                var lyric = JSON.parse(m.text).lyric;
                                if (lyric == "暂无歌词") {
                                    musicObj.lyric = [[0,"没有找到歌词"]];
                                    if (curMusic == musicId) {
                                        curLyric = musicObj.lyric;
                                    }
                                } else {
                                    musicObj.lyric = parseLyric(lyric);
                                    if (curMusic == musicId) {
                                        curLyric = musicObj.lyric;
                                    }
                                }
                            } catch (e) {
                                console.log("获取歌词失败 musicId = " + musicId);
                                musicObj.lyric = [[0,"没有找到歌词"]];
                                if (curMusic == musicId) {
                                    curLyric = musicObj.lyric;
                                }
                            }
                        }
                    });
                })(musicId);
            }
        } else {
            curLyric = [[0,"没有找到歌词"]];
            curLyricInd = 0;
            curLyricLine = "";
        }
    };
    var parseLyric = function(text) {
        //将文本分隔成一行一行，存入数组
        var lines = text.split('\n'),
            //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
            pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
            //保存最终结果的数组
            result = [];
        //去掉不含时间的行
        while (!pattern.test(lines[0])) {
            lines = lines.slice(1);
        };
        //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
        lines[lines.length - 1].length === 0 && lines.pop();
        lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
            //提取出时间[xx:xx.xx]
            var time = v.match(pattern),
                //提取歌词
                value = v.replace(pattern, '');
            //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
            if (!time) {
                result[result.length - 1][1] += v;
            } else {
                time.forEach(function(v1, i1, a1) {
                    //去掉时间里的中括号得到xx:xx.xx
                    var t = v1.slice(1, -1).split(':');
                    //将结果压入最终数组
                    result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
                });
            }
        });
        //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
        result.sort(function(a, b) {
            return a[0] - b[0];
        });
        return result;
    };
    var play = function (tag,id,ind) {
        var musicObj = musicList[tag].list[id][ind];
        if (musicObj) {
            getLyric(musicObj,tag + "_" + id + "_" + ind + "_" + (new Date()).getTime());
            audio.src = musicObj.url;
            audio.play();
        }
    };
    var autoInfo = {
        tag : "",
        id : "",
        ind : ""
    };
    var waitId = setInterval(function () {
        //自动播放音乐
        for (var i = 0;i < musicTag.length;i++) {
            if (musicTag[i] in musicList) {
                //
                getMusic(musicTag[i],musicList[musicTag[i]].info[0].id,function (tag,id) {
                    autoInfo = {
                        tag : tag,
                        id : id,
                        ind : 0
                    };
                    canPlay = true;
                });
                clearInterval(waitId);
                return;
            }
        }
    },1000);
    var waitPlayId = setInterval(function () {
        if (canPlay) {
            clearInterval(waitPlayId);
            play(autoInfo.tag,autoInfo.id,autoInfo.ind);
            return;
        }
    },1000);
    initMusicList();
    return {
        init : init,
        control : {
            play : function () {
                audio.play();
            },
            pause : function () {
                //暂停
                audio.pause();
            },
            next : function () {
                //下一首
            },
            single : function () {
                //单曲
            },
            loop : function () {
                //当前小类循环
            },
            changeList : function () {
                //修改风格，小类
            },
            changeStyle : function () {
                //修改风格，大类
            }
        }
        //initMusicList : initMusicList,
        //getMusic : getMusic,
        // audio : function () {
        //     return audio;
        // },
        // musicList : function () {
        //     return musicList;
        // }
    }
})();




