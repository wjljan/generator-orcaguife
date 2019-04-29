import moment from 'moment';
import lang from 'Components/Language/lang';

const formatTimeLeft = (secondsNumber, needSecond = false) => {
    let second = 1;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;

    let result = '';

    let weekNum = secondsNumber / week;
    let dayNum = (secondsNumber % week) / day;
    let hourNum = (secondsNumber % week % day) / hour;
    let minutes = (secondsNumber % week % day % hour) / minute;
    let seconds = (secondsNumber % week % day % hour % minute) / second;

    if (weekNum >= 1){
        result += (parseInt(weekNum, 0) + lang(' 星期', ' Week(s)'));
    }
    if (dayNum >= 1){
        result += (parseInt(dayNum, 0) + lang(' 天', ' Day(s)'));
    }
    if (hourNum >= 1){
        result += (parseInt(hourNum, 0) + lang(' 小时', ' Hour(s)'));
    }
    if (minutes >= 1){
        result += (parseInt(minutes, 0) + lang(' 分钟', ' Min(s)'));
    }
    if (seconds >= 1){
        result += (parseInt(seconds, 0) + lang(' 秒', ' Second(s)'));
    }
    return result;
};

const formatTime = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
    if (!date) return '--';
    return moment(date).format(fmt);
    /*
    if (!date) return '--';
    let dateOrigin = new Date(date);
    let o = {
        "M+" : dateOrigin.getMonth() + 1,
        "d+" : dateOrigin.getDate(),
        "h+" : dateOrigin.getHours(),
        "m+" : dateOrigin.getMinutes(),
        "s+" : dateOrigin.getSeconds(),
        "q+" : Math.floor((dateOrigin.getMonth() + 3) / 3),
        "S"  : dateOrigin.getMilliseconds()
    };
    if (/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, String(dateOrigin.getFullYear()).substr(4 - RegExp.$1.length));
    }
    for (let k in o){
        if (new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
    */
};

export {formatTimeLeft, formatTime};