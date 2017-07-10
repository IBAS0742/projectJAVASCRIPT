/**
 * Created by Administrator on 2017/6/21.
 */

// a 为 textarea 描述的对象，可以是 class id Element tarname 获取其他能通过 $ 访问到的标志
var textAreaAutoHeight = function (a) {
    Array.prototype.slice.call($$(a)).forEach(function (i) {
        i.style.height = i.scrollHeight + "px";
    });
};

Date.prototype.dps = Date.prototype.setTime;
Date.prototype.setTime = function (intN) {
    if (!intN) {
        return this.setTime(intN);
    }
    if (intN.toString().length == 10) {
        return this.dps(intN * 1000);
    } else {
        return this.dps(intN);
    }
};

//2017-06-08T00:00
var toYyyyMmDdTHhMm = function (date_) {
    if (date_ && date_ instanceof Date) {
    } else {
        date_r = new Date();
        date_r.setTime(date_);
        date_ = date_r;
    }
    return date_.getFullYear().fullBit(4) + "-" +
            (date_.getMonth() + 1).fullBit(2) + "-" +
            date_.getDate().fullBit(2) + "T" +
            date_.getHours().fullBit(2) + ":" +
            date_.getMinutes().fullBit(2);
};
//将上面时间格式转为时间对象
var toDate = function (str) {
    var d = new Date(),
        dd = str.split("T"),
        dates = ['setYear','setMonth','setDate'],
        times = ['setHours','setMinutes'];
    dd[0].split('-').forEach(function (i,j) {
        if (j == 1) {
            d[dates[j]](i - 1);
        } else {
            d[dates[j]](i);
        }
    });
    dd[1].split(':').forEach(function (i,j) {
        d[times[j]](i);
    });
    return d;
};

//填满一定位数的数字
Number.prototype.fullBit = function (bit) {
    if (bit) {
        var len = this.toString().length;
        if (len > bit) {
            return this;
        } else {
            return (new Array(bit - len + 1).join(0)) + this;
        }
    } else {
        return this;
    }
};


