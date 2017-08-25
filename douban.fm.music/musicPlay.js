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
        //当前播放类型
        curTag = "动漫",
        //当前播放的列表的 id
        curMusicListId = "",
        //当前播放的是某一个列表的位置索引，即第几首
        curMusicListIndex = 0,
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
        showMethod,
        playMode = {
            0 : "单曲循环",
            1 : "当前列表循环",
            2 : "当前分类循环",
            3 : "全体循环",     //以后完善
            4 : "循环收藏歌曲" //以后完善
        },
        curPlayMode = 2,
        //作为获取歌词的前缀
        lyricPix;
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
        audio.onended = function () {
            //下一首
            playNextSong();
        };
        showLyricEle = $(tar);
    };
    var refleshLyric = function (ind) {
        if (curLyric.length == 1) {
            showLyricEle.html(showMethod("",curLyric[0][1],""));
            return;
        }
        if (ind > 0) {
            if (ind == curLyric.length - 1) {
            } else {
                ind--;
            }
        }
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
            '<div style="color: #7ac881;min-height: 1em;font-size: 1.4em;text-align: center;word-break: break-all">' + (a || "~~~") + '</div>' +
            '<div  style="color: #633bf9;min-height: 1em;font-size: 1.8em;text-align: center;word-break: break-all">' + (b || "~~~") + '</div>' +
            '<div  style="color: #7ac881;min-height: 1em;font-size: 1.4em;text-align: center;word-break: break-all">' + (c || "~~~") + '</div>'
        );
    };
    //获取大分类下的音乐列表
    /**
     * tag 分类名称
     * ind 分类的索引
     * */
    var initMusicListTag = function (tag,ind,cb) {
        if (tag in musicList) {
            return cb(musicList[tag]);
        }
        ind = ind + "";
        if (!ind) {
            for (var i = 0;i < musicTag.length;i++) {
                if (musicTag[i] == tag) {
                    ind = i + "";
                    break;
                }
            }
        }
        if (!ind) {
            return cb({});
        }
        var ret;$.ajax({
            url : "http://www.halahala.cn:3080/cor",
            data : {
                url : "https://douban.fm/j/v2/songlist/explore?type=hot&genre=" + ind + "&limit=100&sample_cnt=5",
                type : "豆瓣获取分类歌曲列表集合",
                ret : "false"
            },
            success : function(m) {
                try {
                    var js = JSON.parse(m.text);
                    var ids = [],
                        titles = [];
                    js.forEach(function (k) {
                        ids.push(k.id);
                        titles.push(k.title);
                    });
                    musicList[tag] = {
                        info : js,
                        list : {},
                        listId : ids,
                        titles : titles
                    };
                    return cb(musicList[tag]);
                } catch(e) {
                    console.warn("发生错误 tag = " + tag);
                    return cb({});
                }
            }
        });
    };
    //获取小分类下的音乐列表
    var getMusic = function (tag,id,cb) {
        if (tag in musicList) {
            if (id in musicList[tag].list) {
                cb(tag,id,0);
            }
        }
        $.ajax({
            url : "http://www.halahala.cn:3080/cor",
            data : {
                url : "https://douban.fm/j/v2/songlist/" + id + "/?kbps=128",
                type : "豆瓣获取某一分类的某一个列表内容",
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
    var getLyric = function (musicObj,musicId_) {
        if (musicObj) {
            curMusic = musicId_;
            if (musicObj.lyric) {
                curLyric = musicObj.lyric;
                curLyricInd = 0;
                curLyricLine = "";
                return musicObj.lyric;
            } else {
                curLyric = [[0,"正在获取歌词"]];
                curLyricInd = 0;
                curLyricLine = "";
                (function (musicId_) {
                    $.ajax({
                        url : "http://www.halahala.cn:3080/cor",
                        data : {
                            url : "https://douban.fm/j/v2/lyric?sid=" + musicObj.sid + "&ssid=" + musicObj.ssid,
                            type : "豆瓣获取歌词"
                        },
                        success : function(m) {
                            try {
                                var lyric = JSON.parse(m.text).lyric;
                                if (lyric == "暂无歌词") {
                                    musicObj.lyric = [[1000,"没有找到歌词"]];
                                    if (curMusic == musicId_) {
                                        curLyric = musicObj.lyric;
                                    }
                                } else {
                                    musicObj.lyric = parseLyric(lyric);
                                    if (curMusic == musicId_) {
                                        if (musicObj.lyric.length) {
                                        } else {
                                            musicObj.lyric = [[1000,"没有找到歌词"]];
                                        }
                                        curLyric = musicObj.lyric;
                                    }
                                }
                            } catch (e) {
                                console.log("获取歌词失败 musicId = " + musicId_);
                                curLyricInd = 0;
                                musicObj.lyric = [[1000,"没有找到歌词"]];
                                if (curMusic == musicId_) {
                                    curLyric = musicObj.lyric;
                                }
                            }
                        }
                    });
                })(musicId_);
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
        while (!pattern.test(lines[0]) && lines.length) {
            lines = lines.slice(1);
        };
        if (!lines.length) {
            return [];
        }
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
    var play = function (ind) {
        curMusicListIndex = ind || curMusicListIndex;
        var musicObj = curMusicList[ind];
        if (musicObj) {
            musicId = musicObj,lyricPix + ind + "_" + (new Date()).getTime();
            getLyric(musicId);
            audio.src = musicObj.url;
            audio.play();
        }
    };
    var playNextSong = function () {
        //默认为单曲循环
        curPlayMode = curPlayMode || 0;
        if (curTag && curMusicListId && curMusicListIndex.toString()) {
            //判断列表是否有下一首
            switch (curPlayMode) {
                case 0 :    //单曲
                    play(curMusicListIndex);
                    break;
                case 1 :    //列表
                    curMusicListIndex = (curMusicListIndex + 1) % curMusicList.length;
                    play(curMusicListIndex);
                    break;
                case 2 :    //分类
                    curMusicListIndex++;
                    if (curMusicList.length > curMusicListIndex) {
                        play(curMusicListIndex);
                    } else {
                        //加载新列表
                        showLyricEle.html(showMethod("","正在获取新列表",""));
                        var list = musicList[curTag].listId,
                            i = 0;
                        for (i = 0;i < list.length;i++) {
                            if (list[i] == curMusicListId) {
                                break;
                            }
                        }
                        i = (i + 1) % list.length;
                        changeMusicListId(list[i]);
                    }
                    break;
                case 3 :    //全体
                    break;
                case 4 :    //收藏内容
                    break;
            }
        } else {
            //没有足够信息让我知道下一首是什么
            console.warn("没有足够信息让我知道下一首是什么");
        }
    };

    /**
     * 在当前分类下修改音乐列表
     * */
    var changeMusicListId = function (id) {
        getMusic(curTag,id,function (tag,id) {
            curMusicListIndex = 0;
            playList(tag,id);
        });
    };

    /**
     * 初始化某一个歌单
     * */
    var showOneTag = function (tag,cb) {
        initMusicListTag(tag,"",cb);
    };

    /**
     * 修改播放的歌曲
     * tag 播放的类型
     * id 播放的列表
     * index 播放的歌词索引
     * */
    var playList = function (tag,id,index) {
        lyricPix = tag + "_" + id + "_";
        curMusicList = musicList[tag].list[id];
        curMusicListIndex = index || 0;
        play(curMusicListIndex);
    };

    var autoInit = function (tag) {
        if (tag) {
            curTag = tag;
        }
        initMusicListTag(curTag,"",function (obj) {
            curMusicListId = obj.info[0].id;
            getMusic(curTag,curMusicListId ,function (tag,id) {
                curMusicListIndex = 0;
                playList(tag,id);
            });
        });
    };
    //initMusicList();
    return {
        init : init,
        autoPlay : autoInit,
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
                playNextSong();
            },
            //单曲循环
            single : function () {
                curPlayMode = 0;
            },
            //当前列表循环
            loop : function () {
                curPlayMode = 1;
            },
            //当前分类循环
            allLoop : function () {
                curPlayMode = 2;
            },
            //播放另一个列表歌曲
            changeList : function (id) {
                //修改风格，小类
                changeMusicListId(id);
            },
            //获取分类内容
            showTag : function (tag,cb) {
                /**
                 * obj 为当前分类的 完整对象
                 * */
                showOneTag(tag,function (obj) {
                    cb(obj);
                });
            },
            showOneTag : showOneTag
        },
        // getMusic : getMusic,
        // audio : function () {
        //     return audio;
        // },
        // musicList : function () {
        //     return musicList;
        // }
    }
})();




