/**
* Created by chenshanlian on 2015/4/21.
*/
var template = function (a, b) { return template["object" == typeof b ? "render" : "compile"].apply(template, arguments) }; !function (a, b) { "use strict"; a.version = "2.0.1", a.openTag = "<%", a.closeTag = "%>", a.isEscape = !0, a.isCompress = !1, a.parser = null, a.render = function (a, b) { var c = d(a); return void 0 === c ? e({ id: a, name: "Render Error", message: "No Template" }) : c(b) }, a.compile = function (b, d) { function g(c) { try { return new k(c) + "" } catch (f) { return i ? (f.id = b || d, f.name = "Render Error", f.source = d, e(f)) : a.compile(b, d, !0)(c) } } var h = arguments, i = h[2], j = "anonymous"; "string" != typeof d && (i = h[1], d = h[0], b = j); try { var k = f(d, i) } catch (l) { return l.id = b || d, l.name = "Syntax Error", e(l) } return g.prototype = k.prototype, g.toString = function () { return k.toString() }, b !== j && (c[b] = g), g }, a.helper = function (b, c) { a.prototype[b] = c }, a.onerror = function (a) { var c = "[template]:\n" + a.id + "\n\n[name]:\n" + a.name; a.message && (c += "\n\n[message]:\n" + a.message), a.line && (c += "\n\n[line]:\n" + a.line, c += "\n\n[source]:\n" + a.source.split(/\n/)[a.line - 1].replace(/^[\s\t]+/, "")), a.temp && (c += "\n\n[temp]:\n" + a.temp), b.console && console.error(c) }; var c = {}, d = function (d) { var e = c[d]; if (void 0 === e && "document" in b) { var f = document.getElementById(d); if (f) { var g = f.value || f.innerHTML; return a.compile(d, g.replace(/^\s*|\s*$/g, "")) } } else if (c.hasOwnProperty(d)) return e }, e = function (b) { function c() { return c + "" } return a.onerror(b), c.toString = function () { return "{Template Error}" }, c }, f = function () { a.prototype = { $render: a.render, $escape: function (a) { return "string" == typeof a ? a.replace(/&(?![\w#]+;)|[<>"']/g, function (a) { return { "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "&": "&#38;" }[a] }) : a }, $string: function (a) { return "string" == typeof a || "number" == typeof a ? a : "function" == typeof a ? a() : "" } }; var b = Array.prototype.forEach || function (a, b) { for (var c = this.length >>> 0, d = 0; c > d; d++) d in this && a.call(b, this[d], d, this) }, c = function (a, c) { b.call(a, c) }, d = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined", e = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g, f = /[^\w$]+/g, g = new RegExp(["\\b" + d.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"), h = /\b\d[^,]*/g, i = /^,+|,+$/g, j = function (a) { return a = a.replace(e, "").replace(f, ",").replace(g, "").replace(h, "").replace(i, ""), a = a ? a.split(/,+/) : [] }; return function (b, d) { function e(b) { return o += b.split(/\n/).length - 1, a.isCompress && (b = b.replace(/[\n\r\t\s]+/g, " ")), b = b.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n"), b = u[1] + "'" + b + "'" + u[2], b + "\n" } function f(b) { var c = o; if (l ? b = l(b) : d && (b = b.replace(/\n/g, function () { return o++, "$line=" + o + ";" })), 0 === b.indexOf("=")) { var e = 0 !== b.indexOf("=="); if (b = b.replace(/^=*|[\s;]*$/g, ""), e && a.isEscape) { var f = b.replace(/\s*\([^\)]+\)/, ""); q.hasOwnProperty(f) || /^(include|print)$/.test(f) || (b = "$escape($string(" + b + "))") } else b = "$string(" + b + ")"; b = u[1] + b + u[2] } return d && (b = "$line=" + c + ";" + b), g(b), b + "\n" } function g(a) { a = j(a), c(a, function (a) { p.hasOwnProperty(a) || (h(a), p[a] = !0) }) } function h(a) { var b; "print" === a ? b = w : "include" === a ? (r.$render = q.$render, b = x) : (b = "$data." + a, q.hasOwnProperty(a) && (r[a] = q[a], b = 0 === a.indexOf("$") ? "$helpers." + a : b + "===undefined?$helpers." + a + ":" + b)), s += a + "=" + b + "," } var i = a.openTag, k = a.closeTag, l = a.parser, m = b, n = "", o = 1, p = { $data: !0, $helpers: !0, $out: !0, $line: !0 }, q = a.prototype, r = {}, s = "var $helpers=this," + (d ? "$line=0," : ""), t = "".trim, u = t ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"], v = t ? "if(content!==undefined){$out+=content;return content}" : "$out.push(content);", w = "function(content){" + v + "}", x = "function(id,data){if(data===undefined){data=$data}var content=$helpers.$render(id,data);" + v + "}"; c(m.split(i), function (a) { a = a.split(k); var b = a[0], c = a[1]; 1 === a.length ? n += e(b) : (n += f(b), c && (n += e(c))) }), m = n, d && (m = "try{" + m + "}catch(e){e.line=$line;throw e}"), m = "'use strict';" + s + u[0] + m + "return new String(" + u[3] + ")"; try { var y = new Function("$data", m); return y.prototype = r, y } catch (z) { throw z.temp = "function anonymous($data) {" + m + "}", z } } }() }(template, this), "function" == typeof define ? define(function (a, b, c) { c.exports = template }) : "undefined" != typeof exports && (module.exports = template), function (a) { a.openTag = "{", a.closeTag = "}", a.parser = function (b) { b = b.replace(/^\s/, ""); var c = b.split(" "), d = c.shift(), e = a.keywords, f = e[d]; return f && e.hasOwnProperty(d) ? (c = c.join(" "), b = f.call(b, c)) : a.prototype.hasOwnProperty(d) ? (c = c.join(","), b = "==" + d + "(" + c + ");") : (b = b.replace(/[\s;]*$/, ""), b = "=" + b), b }, a.keywords = { "if": function (a) { return "if(" + a + "){" }, "else": function (a) { return a = a.split(" "), a = "if" === a.shift() ? " if(" + a.join(" ") + ")" : "", "}else" + a + "{" }, "/if": function () { return "}" }, each: function (a) { a = a.split(" "); var b = a[0] || "$data", c = a[1] || "as", d = a[2] || "$value", e = a[3] || "$index", f = d + "," + e; return "as" !== c && (b = "[]"), "$each(" + b + ",function(" + f + "){" }, "/each": function () { return "});" }, echo: function (a) { return "print(" + a + ");" }, include: function (a) { a = a.split(" "); var b = a[0], c = a[1], d = b + (c ? "," + c : ""); return "include(" + d + ");" } }, a.helper("$each", function (a, b) { var c = Array.isArray || function (a) { return "[object Array]" === Object.prototype.toString.call(a) }; if (c(a)) for (var d = 0, e = a.length; e > d; d++) b.call(a, a[d], d, a); else for (d in a) b.call(a, a[d], d) }) }(template);

String.prototype.toDate = function () {
    return new Date(this.replace(/-/g, '/'));
};
var regObj = {
    passport: "^[a-zA-Z0-9_]{3,16}$",
    email: "^([a-zA-Z0-9_\\-\.])+@([a-zA-Z0-9_\-])+((\.[a-zA-Z0-9_\-]{2,10}){1,3})$",
    mobile: "^(0{0,1}1[3-9]{1}[0-9]{9})$",
    tel: "^([0-9]{3,4}-)*[0-9]{7,8}(-[0-9]{1,6})*$",
    username: "^[A-Za-z0-9\\u4e00-\\u9fa5_]{2,15}$",
    nametext: "^([A-Za-z0-9\\u4e00-\\u9fa5_]|[\(|\)|\[|\]|-|]|[（|）\.]| | ){2,15}$",
    password: "^[^ ]{8,20}$",
    contract: "(^1[0-9]{10}$)|(^([0-9]{3,4}-)[0-9]{7,8}(-[0-9]{1,6})*$)",
    num: "^[0-9]+$",
    text: "^\w*",
    groupname: "^[\\w\\u4e00-\\u9fa5]+[\\w\\u4e00-\\u9fa5\\s]*[\\w\\u4e00-\\u9fa5]+$",
    mobileortel: /(^1[0-9]{10}$)|(^([0-9]{3,4}-)*[0-9]{7,8}(-[0-9]{1,6})*$)/,
    //邮箱验证
    femailTest: function (str) {
        return regObj.ftest(str, regObj.email);
    },
    //手机验证
    fmobileTest: function (str) {
    //var strmatch = /^0?\\d{11}$/;
        return regObj.ftest(str, regObj.mobile);
    },
    //非空验证
    fNullTest: function (str) {
    var strmatch = /^[\s|\S]+$/;
        return regObj.ftest(str, strmatch);
    },
    //纯数字验证
    fDigitalTest: function (str) {
    var strmatch = /^[0-9]+$/;
        return regObj.ftest(str, strmatch);
    },
    //姓名验证
    fnameTest: function(str){
        return regObj.ftest(str, regObj.username);
    },
    ftest: function (str, strmatch) {
        var _regobj = RegExp(strmatch);
        if (_regobj.test(str)) {
            return true;
        } else {
            return false;
        }
    }
}
var utilfunc = function() {
/*创建cookie*/
var _setCookie = function (sName, sValue, days) {
_delCookie(sName);
if (!days) {
    document.cookie = sName + "=" + encodeURIComponent(sValue) + ';path=/;';
    return;
}
var exp = new Date();
exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
document.cookie = sName + "=" + encodeURIComponent(sValue) + ";path=/; expires=" + exp.toGMTString();
}
var _setCookie2 = function (sName, sValue, days) {
_delCookie(sName);
if (!days) {
    document.cookie = sName + "=" + encodeURIComponent(sValue) + ';path=/;';
    return;
}
var exp = new Date();
exp.setTime(exp.getTime() + days * 1000);
document.cookie = sName + "=" + encodeURIComponent(sValue) + ";path=/; expires=" + exp.toGMTString();
}
/*获取cookies*/
var _getCookie = function (sName) {
var aCookie = document.cookie.split("; ");
for (var i = 0; i < aCookie.length; i++) {
    var aCrumb = aCookie[i].split("=");
    if (sName == aCrumb[0])
        return decodeURIComponent(aCrumb[1]);
}
}
/*删除cookies*/
var _delCookie = function (sName) {
document.cookie = sName + "=" + encodeURIComponent("") + "; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
}
/*将json object对象转换成string*/
var _toJsonString = function (obj) {
var t = typeof (obj);
if (t != "object" || obj === null) {
    if (t == "string") obj = '"' + obj + '"'; /* simple data type*/
    return String(obj);
}
else {
    var n, v, json = [], arr = (obj && obj.constructor == Array); /* recurse array or object*/
    for (n in obj) {
        v = obj[n]; t = typeof (v);
        if (t == "function") continue; /*except function*/
        if (t == "string") v = '"' + v + '"';
        else if (t == "object" && v !== null) v = _toJsonString(v);
        json.push((arr ? "" : '"' + n + '":') + String(v));
    }
    return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
}
};
var _urlParamToJson = function (url, key, replace) {
url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
var json = {};
url.replace(/(^|&)([^&=]+)=([^&]*)/g, function (a, b, key, value) {
    if (!(key in json)) {
        json[key] = /\[\]$/.test(key) ? [value] : value; //如果参数名以[]结尾，则当作数组
    }
    else if (json[key] instanceof Array) {
        json[key].push(value);
    }
    else {
        json[key] = [json[key], value];
    }
});
return key ? json[key] : json;
};
/*
*公用提示方法
*btnobj:$对象,默认为空在屏幕中间显示，有传递对象则在按钮的上方显示,
*str:提示消息内容,
*type:1,提示类型，1为错误提示，2为警告，3为通过或者成功
*stype:默认为空，false 自动关闭，true 则手动关闭
*time:默认为2000(两秒)
*cbk:function() 回调函数
*/
var i8alert = function (json) {
var time = 2000;
var _color = " #FF690E";
var stypehtml = "";
if (!json.type) {
    json.type = 1;
}
//提示内容类型
if (json.type != 1) {
    _color = " #717276";
}
//显示方式
if (json.stype) {
    stypehtml = '<span class="lg_fm_close cl000 heit cur" style="font-size: 18px; padding: 0px 5px;">x</span>';
}
if (json.time) {
    time = json.time;
}
var domobj = document.getElementById("js_lg_tp_div");
if (domobj) {
    domobj = $(document.getElementById("js_lg_tp_div"));
    domobj.html('<i class="lg_fm_' + json.type + '"></i>' + json.str + stypehtml);
} else {
    var htmlstr = '<div id="js_lg_tp_div" style="position:absolute; z-index:11111; left:50%; top:50%;' +
        'font-size:12px;color:' + _color + '; border:1px solid #CFD0D0; padding:4px 10px 5px 10px; background:#fff;' +
        'box-shadow:2px 2px 2px -1px #C5C6C7; line-height:25px; display:none;">' +
        '<i class="lg_fm_' + json.type + '"></i>' + json.str + stypehtml + '</div>';
    $("body").append(htmlstr);
    domobj = $(document.getElementById("js_lg_tp_div"));
}
domobj.css({ "margin-left": 0 - domobj.width() / 2, "margin-top": 0 - domobj.height() / 2, color: _color, "position": "fixed" });
if (json.btnobj) {
    var _left = json.btnobj.offset().left;
    var _top = json.btnobj.offset().top - domobj.outerHeight() - 10;
    if (_top < 0)
        _top = 1;
    var _right = "auto";
    var wdwidht = $(window).width();
    var boxwidth = domobj.width();
    if (_left > (wdwidht - boxwidth)) {
        _left = "auto";
        _right = 0;
    }
    domobj.css({ margin: 0, left: _left, top: _top,right:_right, position: "absolute" });
}
domobj.show();
if (json.stype) {
    $(".lg_fm_close").click(function () {
        $(this).parent().hide();
    });
    return;
}
setTimeout(function () {
    domobj.hide();
    if (json.cbk) {
        json.cbk();
    }
}, time);
};
var formGuid = function(str){
if(!str || str.length != 36){
    return false;
}else{
    var reg = new RegExp("[a-z|A-Z|0-9]{8}-[a-z|A-Z|0-9]{4}-[a-z|A-Z|0-9]{4}-[a-z|A-Z|0-9]{4}-[a-z|A-Z|0-9]{12}");
    return reg.test(str);
}
}

/**
* 截取字符串
* @param str
* @param len
*/
var fnStringCut = function(str,len) {

var _str = str || '',
    _len = len || 0;

if(_str.length<len)
{
    return str;
}

return _str.substr(0,len-2)+'..';
}
var replaceSpecial=function(str,es){
var es=es||'';
var keyword=new RegExp("[\\ ,\\。,\\`,\\~,\\!,\\@,\\#,\\$,\\%,\\^,\\+,\\*,\\&,\\\\,\\/,\\?,\\|,\\:,\\.,\\<,\\>,\\{,\\},\\(,\\),\\'',\\;,\\=,\"]","gi")
return str.replace(keyword,function(word){
    return '\\'+word;
})
}

//关闭loading方法
var i8closeloading = function () {
$("#js_lg_tp_div").hide();
$("#fw_nomaskzhezhao").hide();
}
var oneDay = 3600 * 24 * 1000, oneHour = 3600 * 1000, oneMinute = 60 * 1000, week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

//分钟处理函数  ，当分钟小于10时，自动在分钟前补0
var fMinuteHandle = function (minute) {
if (minute < 10) {
    return '0' + minute;
}
return minute;
};
var fDayHandle = function (day) {
if (day < 10) {
    return '0' + day;
}
return day;
};
//日期处理函数
var fDateHandle = function (date, currentDate) {
var curDate = null;
if (currentDate) {
    if (typeof currentDate === 'string') {
        try {
            curDate = currentDate.toDate(); //尝试转化为 datetime对象
        }
        catch (e) {
            curDate = new Date();
        }
    }
    else {
        curDate = curDate || new Date();    //否则认为是传入的时间对象，此处可以考虑重构，判断curDate为 datetime对象
    }
}
curDate = curDate || new Date();
var msgDate = null;
try {
    msgDate = date.toDate();
} catch (e) {
    alert(e);
    return;
}
var timeTick = curDate - msgDate;
if (timeTick <= 0) {
    return '刚刚';
}
if ((timeTick / oneDay) >= 1 || (Math.abs((curDate.getDate() - msgDate.getDate())) >= 1)) {
    return msgDate.getFullYear() + '年' + (msgDate.getMonth() + 1) + '月' + msgDate.getDate() + '日' + " " + (msgDate.getHours() + ':' + fMinuteHandle(msgDate.getMinutes()));
}
if ((timeTick / oneHour) > 1) {
    return '今天 ' + msgDate.getHours() + ':' + fMinuteHandle(msgDate.getMinutes());
}
if ((timeTick / oneMinute) > 1) {
    return Math.ceil(timeTick / oneMinute) + '分钟前';
}
return '刚刚';
};
var _dateDiff = function (interval, date1, date2) {
var objInterval = { 'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60, 'M': 1000 * 60, 'S': 1000, 'T': 1 };
interval = interval.toUpperCase();
if (typeof (data1) == "Object") {
    date1 = date1.toDate();
    date2 = date2.toDate();
}
try {
    return Math.round((date2 - date1) / eval('(objInterval.' + interval + ')'));
}
catch (e) {
    return e.message;
}
};
var fw_request = function (paras) {
var url = location.href.indexOf("#") > 0 ? location.href.substring(0, location.href.indexOf("#")) : location.href;
var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
var paraObj = {}
for (i = 0; j = paraString[i]; i++) {
    paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1);
}
var returnValue = paraObj[paras.toLowerCase()];
if (typeof (returnValue) == "undefined") {
    return "";
} else {
    return returnValue;
}
}
function _loadsinglejs(url, callback) {
var head = document.getElementsByTagName("head")[0];
var script = document.createElement('script');
script.onload = script.onreadystatechange = script.onerror = function () {
    if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) return;
    script.onload = script.onreadystatechange = script.onerror = null;
    script.src = '';
    script.parentNode.removeChild(script);
    script = null;
    if (callback)
        callback();
}
script.charset = "utf-8";
script.src = url;
try {
    head.appendChild(script);
} catch (exp) { }
}
/*动态加载JS*/
function _loadjs(url, callback) {
if (Object.prototype.toString.call(url) === '[object Array]') {	//是否数组
    this.suc = 0;			//加载计数
    this.len = url.length;	//数组长度
    var a = this;
    for (var i = 0; i < url.length; i++) {
        _loadsinglejs(url[i], function () { a.suc++; if (a.suc == a.len) try { callback(); } catch (e) { } });
    }
} else if (typeof (url) == 'string') {
    _loadsinglejs(url, callback);
}
}
/*文件大小转换_byte字节*/
function _sizeFormat(_byte) {
var i = 0;
while (Math.abs(_byte) >= 1024) {
    _byte = _byte / 1024;
    i++;
    if (i == 4) break;
}
$units = new Array("Bytes", "KB", "MB", "GB", "TB");
$newsize = Math.round(_byte, 2);
return $newsize + $units[i];
}
function _dateConverter (_date) {
var date = _date.replace(/\-/g, "/");
var nDate = new Date(date);
var time = (nDate.getHours().toString().length == 1 ? ("0" + nDate.getHours().toString()) : nDate.getHours().toString()) +":"+ (nDate.getMinutes().toString().length == 1 ? ("0" + nDate.getMinutes().toString()) : nDate.getMinutes().toString());
var cn_str = (nDate.getYear().toString()).substr(1, 3) + "年" + (nDate.getMonth() + 1) + "月" + nDate.getDate() + "日 " + time;
return cn_str;
}
var _subString = function (str, n) {
var r = /[^\x00-\xff]/g;
if (str.replace(r, "mm").length <= n) { return str; }
var m = Math.floor(n / 2);
for (var i = m; i < str.length; i++) {
    if (str.substr(0, i).replace(r, "mm").length >= n) {
        return str.substr(0, i) + "...";
    }
}
return str;
}
var TxtBoxWarn = function (txtobj) {
var colors = ["rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)"];
var colorAnimate = function (cls) {
    var clrTimer = null;
    if (cls.length > 0) {
        clrTimer = setTimeout(function () {
            txtobj.css({ "background-color": cls.shift() });
            colorAnimate(cls);
        }, 100);
    } else {
        clearTimeout(clrTimer);
    }
}
colorAnimate(colors);
};
var _strFormat = function () {
var s = arguments[0];
var args = arguments;
if (s) {
    return s.replace(/\{(\d+)\}/ig, function (a, b) {
        var ret = args[(b | 0) + 1];
        return ret == null ? '' : ret;
    })
}
else {
    return "";
}
};
var _strLength=function(str) {
var len = 0;
for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        len++;
    }
    else {
        len += 2;
    }
}
return len;
}


/*import  重写window.alert*/
window._alert = window.alert;
window.alert = function (data) {
i8alert({str:data});
}
//转换时间格式（用于ajax获取数据后执行格式转换）
var dateformat=function dateformat(value, format) {
var date=new Date(value);
if(date=='Invalid Date'||isNaN(date)){
    date= new Date(value.replace(/-/g,'/'));
}
return date.format(format);
}
Date.prototype.format = function (format) {
/*
 * eg:format="yyyy-MM-dd hh:mm:ss";
 */
var o = {
    "M+": this.getMonth() + 1, // month
    "d+": this.getDate(), // day
    "h+": this.getHours(), // hour
    "m+": this.getMinutes(), // minute
    "s+": this.getSeconds(), // second
    "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
    "S": this.getMilliseconds()
    // millisecond
}

if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
        - RegExp.$1.length));
}

for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length));
    }
}
return format;
}
var _HtmlUtil = {
/*1.用正则表达式实现html转码*/
htmlEncodeByRegExp:function (str){
    var s = "";
    if(str.length == 0) return "";
    s = str.replace(/&/g,"&amp;");
    s = s.replace(/</g,"&lt;");
    s = s.replace(/>/g,"&gt;");
    s = s.replace(/ /g,"&nbsp;");
    s = s.replace(/\'/g,"&#39;");
    s = s.replace(/\"/g,"&quot;");
    return s;
},
/*2.用正则表达式实现html解码*/
htmlDecodeByRegExp:function (str){
    var s = "";
    if(str.length == 0) return "";
    s = str.replace(/&amp;/g,"&");
    s = s.replace(/&lt;/g,"<");
    s = s.replace(/&gt;/g,">");
    s = s.replace(/&nbsp;/g," ");
    s = s.replace(/&#39;/g,"\'");
    s = s.replace(/&quot;/g,"\"");
    return s;
}
};

var _fLoadCss = function (url) {
var head = document.getElementsByTagName('head')[0] || document.documentElement,
    css = document.createElement('link');
css.rel = 'stylesheet';
css.type = 'text/css';
css.href = url;
head.insertBefore(css, head.firstChild);
};
var faceLib = [["微笑", "weixiao.gif"], ["大笑", "ciya.gif"], ["花痴", "se.gif"], ["傲慢", "aoman.gif"], ["拜拜", "zaijian.gif"], ["悲剧", "ai.gif"], ["鄙视", "bishi.gif"], ["发呆", "fadai.gif"], ["闭嘴", "bizui.gif"], ["大哭", "daku.gif"], ["大骂", "zhouma.gif"], ["点头笑", "hanxiao.gif"], ["汗", "liuhan.gif"], ["惊恐", "jingkong.gif"], ["敲打", "qiaoda.gif"], ["抓狂", "zhuakuang.gif"], ["奋斗", "fengdou.gif"], ["鼓掌", "guzhang.gif"], ["打哈欠", "haqian.gif"], ["擦汗", "cahan.gif"], ["尴尬", "ganga.gif"], ["怒", "fanu.gif"], ["困", "kun.gif"], ["白眼", "baiyan.gif"], ["吃惊", "jingyan.gif"], ["哼", "nanguo.gif"], ["可怜", "kelian.gif"], ["泪", "liulei.gif"], ["害羞", "haixiu.gif"], ["坏笑", "huaixiao.gif"], ["左哼哼", "zuohenhen.gif"], ["右哼哼", "youhenhen.gif"], ["亲亲", "qinqin.gif"], ["吓", "xia.gif"], ["大兵", "dabin.gif"], ["酷", "ku.gif"], ["得意", "deyi.gif"], ["睡觉", "shui.gif"], ["疑问", "yiwen.gif"], ["偷笑", "touxiao.gif"], ["吐", "tu.gif"], ["调皮", "tiaopi.gif"], ["挖鼻屎", "koubi.gif"], ["无奈", "piezui.gif"], ["快哭了", "kuaikule.gif"], ["冷汗", "lenghan.gif"], ["可爱", "keai.gif"], ["糗大了", "qiudale.gif"], ["嘘", "xun.gif"], ["晕", "yun.gif"], ["阴险", "yinxian.gif"], ["委屈", "weiqu.gif"], ["美味", "jie.gif"], ["骷髅", "kulou.gif"], ["猪头", "zhutou.gif"], ["抱拳", "baoquan.gif"], ["胜利", "shengli.gif"], ["爱你", "aini.gif"], ["顶你", "qiang.gif"], ["弱", "ruo.gif"], ["不", "no.gif"], ["勾引", "gouying.gif"], ["握手", "woshou.gif"], ["拳头", "quantou.gif"], ["差劲", "chajing.gif"], ["好的", "ok.gif"], ["太阳", "taiyang.gif"], ["月亮", "yueliang.gif"]];
var faceBpath = "/default/images/face/";
//内容@人转换
var atUserFormate=function(str){
if(!str){
    return "";
}
if(str.length>0) {
    str = str.replace(/\$%\$([\w\-\,\u4E00-\ufa2d]+)\$%\$/g, function (str, info) {
        var infosry = info.split(',');
        var enType = infosry[2];//enType为0,人员；1，群组；2，组织；
        var newStr = '<a href="users/' + infosry[1] + '">@' + infosry[0] + '</a>';
        switch (enType) {
            case "1":
                newStr = '<a href="group/home?id=' + infosry[1] + '">@' + infosry[0] + '</a>';
                break;
            case "2":
                newStr = '<a>@' + infosry[0] + '</a>';
        }
        return newStr;
    });
    str=str.replace(/\[[\u4E00-\ufa2d]+\]/ig, function (m) {
        for (var i = 0; i < faceLib.length; i++) {
            var _faceName = m.replace(/[\[\]]/ig, "");
            if (faceLib[i][0] == _faceName) {
                return "<img src=\"" + faceBpath + faceLib[i][1] + "\" alt=\"" + _faceName + "\" />";
            }
        }
        return m;
    });
    str=str.replace(/%\$%(\S+),(\w{6,7})%\$%/ig,function(str,or,nw){
        if(or&&nw){
            return "<a href=\"/url/"+nw +"\" target=\"_blank\" title=\""+or+"\">http://i8xs.cn/"+nw+"</a>";
        }else{
            return str;
        }
    });
    //[url="/report/detail/decffb25-5abc-4925-8fdc-47cc0633f4cc";txt="2015年3月9日-2015年3月15日"]
    str=str.replace(/\[url="([\S^"]+)";txt="([\S^"]+)";target="([_\w]+)"\]/ig,function(str,href,txt,target){
        if(href&&txt){
            return "<a href=\""+href+"\"  target=\""+target+"\">"+txt+"</a>";
        }else{
            return str;
        }
    });
    str=str.replace(/#(.+?)#/g,function(str,or){
        return '<a href="search?keyword='+encodeURIComponent(or)+'#dynamic" target="_blank">#'+or+'#</a>';
    });
    str=str.replace(/[\r|\n]/g,"<br/>");
}
return str;
};
var _getLastUrlName=function(){
var fulUrl=window.location.href;
var target=fulUrl.substr(fulUrl.lastIndexOf('/')+1,fulUrl.length).split('?')[0];
return target;
}

//复制文本
var _copyToClipboard=function(txt) {
if(window.clipboardData) {
    window.clipboardData.clearData();
    window.clipboardData.setData("Text", txt);
} else if(navigator.userAgent.indexOf("Opera") != -1) {
    window.location = txt;
} else if (window.netscape) {
    try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    } catch (e) {
        alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
    }
    var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
    if (!clip)
        return;
    var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    if (!trans)
        return;
    trans.addDataFlavor('text/unicode');
    var str = new Object();
    var len = new Object();
    var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    var copytext = txt;
    str.data = copytext;
    trans.setTransferData("text/unicode",str,copytext.length*2);
    var clipid = Components.interfaces.nsIClipboard;
    if (!clip)
        return false;
    clip.setData(trans,null,clipid.kGlobalClipboard);
}
}
return {
getLastUrlName:_getLastUrlName,
atkkContent:atUserFormate,
htmlUtil:_HtmlUtil,
strLength:_strLength,
bgFlicker:TxtBoxWarn,
setCookies: _setCookie,
setCookies2: _setCookie2,
getCookies: _getCookie,
delCookies: _delCookie,
toJsonString: _toJsonString,
urlParamToJson: _urlParamToJson,
i8alert: i8alert,
formateDate: fDateHandle,
dateformat:dateformat,
getUrlParam: fw_request,
i8closeloading: i8closeloading,
i8loadjs: _loadjs,
dateDiff: _dateDiff,
sizeFormat: _sizeFormat,
dateConverter: _dateConverter,
subString: _subString,
strFormat: _strFormat,
stringCut:fnStringCut,
loadCss:_fLoadCss,
replaceSpecial:replaceSpecial,
formGuid: formGuid,
copyToClipboard:_copyToClipboard
};
};
var i8uifunc = function(){
var maskArr=[];
//显示遮罩层
var showMask = function(){
var jsMsk = "js_msk"+new Date().valueOf();
var domMsk = document.createElement('div');
domMsk.style.zIndex=999+maskArr.length;
domMsk.id = jsMsk;
domMsk.className = 'ct-msk';
maskArr.push(jsMsk);
document.body.appendChild(domMsk);
}
var closeMask = function(){
//var jsMsk = "js_msk";
document.getElementById(maskArr.splice(maskArr.length-1,1)[0]).style.display = 'none';
}
/*
*基本弹出层方法
*参数格式为json
* title 弹出层标题
* cont 弹出层内容
* btnDom 控制显示弹出层显示位置的 $对象按钮】
* noMask 不现实弹出层 默认为false
*/
var showbox = function(json){
var titleStr = '';
var isalert = '';
if(json.title){
    titleStr = '<span class="ct-close">×</span><div class="ct-ly-h1">'+json.title+'</div>';
}
if(json.isalert){
    isalert = ' is-alert'
}
var divDom = document.createElement('div');
divDom.style.zIndex=1000+maskArr.length;
divDom.id = new Date().valueOf(); //初始化弹出层的ID
divDom.className = 'ct-ly' + isalert;
divDom.innerHTML = titleStr + json.cont;
document.body.appendChild(divDom);

if(json.btnDom){
    json.noMask = true;
}
if(!json.noMask){
    showMask();
}

if(typeof json.success ==='function') {
    json.success();
}
if(typeof json.error === 'function') {
    json.error();
}
//关闭方法
divDom.close = function(){
    //divDom.parentNode.removeChild(divDom);
    $(divDom).remove();
    if(!json.noMask){
        closeMask();
    }
};
divDom.againShow = function () {
    var $box = $(divDom);
    var n_left = $(window).width() / 2 - $box.width() / 2;
    var n_top = $(window).height() / 2 - $box.height() / 2;
    $box.css({ top: n_top, left: n_left, margin: 0, position: "fixed" });
};
//定位方法
divDom.position = function(){
    var $divDom = $(divDom);
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    var winScrollTop = $(window).scrollTop();
    if(location != top.location){
        winHeight = $(window.parent).height();
        winScrollTop = $(window.parent).scrollTop();
    }
    //控制弹出层的位置
    var leftNum = winWidth / 2 - $divDom.width() / 2;
    var topNum = (winHeight / 2 - $divDom.height() / 2) + winScrollTop;
    if(json.btnDom){
        leftNum = json.btnDom.offset().left;
        if(leftNum + $divDom.width() >= winWidth){
            leftNum = winWidth - $divDom.width();
        }
        topNum = json.btnDom.offset().top - $divDom.height() - json.btnDom.height() + 10;
    }
    if (topNum < 0){
        topNum = 0;
    }
    if(leftNum < 0){
        leftNum = 0;
    }
    $divDom.css({left: parseInt(leftNum), top: parseInt(topNum)});
}
divDom.position();
//关闭事件
$(divDom).on('click','.ct-close,.gray96x32,.gray94x32',function(){
    divDom.close();
});
return	divDom;
};
//确定提示框
var i8Confirm = function(json,cbk,cancelcbk){
//json.body谁加的 我表示不知道干嘛的 先处理一下
var confirmHtml = (json.body? json.body : "")+'<div class="ct-ly-msg">'+ json.title +'</div>'+
    '<div class="tcenter">' +
    '<span class="ct-confirm ct-ly-btn col-blue">确定</span>'+
    '<span class="ct-cancel ct-ly-btn col-f1">取消</span>'+
    '</div>';
var divDom = showbox({ cont: confirmHtml,btnDom:json.btnDom?json.btnDom: null,title:json.bodytitle ? json.bodytitle : null});
//确定事件
$(divDom).delegate('.ct-confirm','click',function(){
    cbk(divDom);
    divDom.close();
});
//取消事件
$(divDom).delegate('.ct-cancel','click',function(){
    cancelcbk && cancelcbk();
    divDom.close();
});
return divDom
}
var i8alert = function (json) {
$('div.is-alert').remove();
if(!json.type){
    json.type = 1;
}
/*if(Object.prototype.toString.call(json) === '[object String]'){
 var _json=json;
 json={};
 json.type = 1;
 json.title=_json;
 };*/

var contHtml = '<div class="ct-alert ct-at-'+ json.type +'"><i></i>'+ json.title+'</div>';
var divDom = showbox({noMask: json.noMask == undefined ? true : json.noMask,isalert:true, btnDom:json.btnDom?json.btnDom: null, cont:contHtml});
setTimeout(function(){
    divDom.close();
    if(json.cbk){
        json.cbk();
    }
},json.time || 2000);
}
/*
title: 提示内容；
type: 1 or 2 or 3 显示颜色 默认1 红色 2 绿色 3 黑色
stype: 是否自动关闭
*/
var i9alert = function (json) {
var time = 2000;
var _color = " #FF690E";
var stypehtml = "";
if (!json.type) {
    json.type = 1;
}
//提示内容类型
if (json.type != 1) {
    _color = " #717276";
}
//显示方式
if (json.stype) {
    stypehtml = '<span class="lg_fm_close"></span>';
}
if (json.time) {
    time = json.time;
}
var domobj = document.getElementById("js_lg_tp_div");
if (domobj) {
    domobj = $(document.getElementById("js_lg_tp_div"));
    domobj.html('<i class="lg_fm_' + json.type + '"></i>' + json.title + stypehtml);
} else {
    var htmlstr = '<div id="js_lg_tp_div" style="position:absolute; z-index:1111; left:50%; top:50%;' +
        'font-size:12px;color:' + _color + '; padding:2px 2px;' +
        'line-height:20px; display:none;">' +
        '<i class="lg_fm_' + json.type + '"></i>' + json.title + stypehtml + '</div>';
    $("body").append(htmlstr);
    domobj = $(document.getElementById("js_lg_tp_div"));
}
domobj.css({ "margin-left": 0 - domobj.width() / 2, "margin-top": 0 - domobj.height() / 2, color: _color, "position": "fixed" });
if (json.btnDom && json.btnDom.length > 0) {
    var _left = json.btnDom.offset().left;
    var _top = json.btnDom.offset().top +json.btnDom.outerHeight()+2;
    if (_top < 0)
        _top = 1;
    var _right = "auto";
    var wdwidht = $(window).width();
    var boxwidth = domobj.width();
    if (_left > (wdwidht - boxwidth)) {
        _left = "auto";
        _right = 0;
    }
    domobj.css({ margin: 0, left: _left, top: _top, right: _right, position: "absolute" });
}
domobj.show();
if (json.stype) {
    $(".lg_fm_close").click(function () {
        $(this).parent().hide();
    });
    return;
}
setTimeout(function () {
    domobj.hide();
    if (json.cbk) {
        json.cbk();
    }
}, time);
};
var rightalert = function (json) {
var time = 2000;
var _color = " #FF690E";
var stypehtml = "";
if (!json.type) {
    json.type = 1;
}
//提示内容类型
if (json.type != 1) {
    _color = " #717276";
}
//显示方式
if (json.stype) {
    stypehtml = '<span class="lg_fm_close"></span>';
}
if (json.time) {
    time = json.time;
}
var domobj = document.getElementById("js_lg_tp_div");
if (domobj) {
    domobj = $(document.getElementById("js_lg_tp_div"));
    domobj.html('<i class="lg_fm_' + json.type + '"></i>' + json.title + stypehtml);
} else {
    var htmlstr = '<div id="js_lg_tp_div" style="position:absolute; z-index:1111; left:50%; top:50%;' +
        'font-size:12px;color:' + _color + ';' +
        ' display:none;">' +
        '<i class="lg_fm_' + json.type + '"></i>' + json.title + stypehtml + '</div>';
    $("body").append(htmlstr);
    domobj = $(document.getElementById("js_lg_tp_div"));
}
domobj.css({ "margin-left": 0 - domobj.width() / 2, "margin-top": 0 - domobj.height() / 2, color: _color, "position": "fixed"});
if (json.btnDom) {
    var _left = json.btnDom.offset().left +5+ json.btnDom.outerWidth();
    var _top = json.btnDom.offset().top;
    if (_top < 0)
        _top = 1;
    var _right = "auto";
    var wdwidht = $(window).width();
    var boxwidth = domobj.width();
    if (_left > (wdwidht - boxwidth)) {
        _left = "auto";
        _right = 0;
    }
    domobj.css({ margin: 0, left: _left, top: _top, right: _right, position: "absolute",lineHeight: json.btnDom.outerHeight()+"px" });
}
domobj.show();
if (json.stype) {
    $(".lg_fm_close").click(function () {
        $(this).parent().hide();
    });
    return;
}
setTimeout(function () {
    domobj.hide();
    if (json.cbk) {
        json.cbk();
    }
}, time);
};
    (function($){
        $.fn.setSelect = function(json){
            if($(this).length <= 0){
                return;
            }
            var json=json||{};
            var options = $(this).find("option");
            var thisInnerHTML = $(this).html();
            var _height = $(this).outerHeight();
            var _width = json.width || $(this).width();
            var _defaultValue = '';
            var _defualtHtml = '--请选择--';
            var selectedId = '';
            var selOption = $(this).find("option:selected");

            if(selOption.length > 0){
                _defualtHtml = selOption.html();
                _defaultValue = $(this).val();
            }else{
                if(options.length >0){
                    _defualtHtml = options[0].innerHTML;
                    _defaultValue = $(options[0]).attr('value');
                }
            }
            var labelDom = document.createElement('label');
            labelDom.className = 'i8-select '+json.newi8select;
            labelDom.id = $(this).attr('id');
            var optionsHtml = '<i class="i8-select-drop '+json.dropstyle+'"></i><span class="i8-select-cked '+json.ckedstyle+'" value="'+ _defaultValue +'">'+ _defualtHtml +'</span><span class="i8-sel-options">';
            var tpl = (thisInnerHTML.replace(/<option/g,"<em").replace(/<\/option>/g,'</em>').replace(/<OPTION/g,"<em").replace(/<\/OPTION>/g,'</em>'));

            optionsHtml += tpl + '</span>';
            labelDom.innerHTML = optionsHtml;

            $(this).replaceWith(labelDom);
            var $label = $(labelDom);
            $label.setValue(selectedId);
            //$label.css({'width':_width,'height': _height, lineHeight: _height+ 2+"px"});
            $label.css({'width':_width, lineHeight: _height+ 2 +"px"});
            if(json && json.style){
                $label.attr("style",json.style);
            }
            $label.find('.i8-sel-options').css('top',_height + 1);
            $label.delegate('em','click',function(){
                var spanDom = $(this);
                $label.find('span.i8-select-cked').html(spanDom.html()).attr('value',spanDom.attr('value'));
                $label.find('span.i8-sel-options').hide();
                if(json && json.cbk)
                    json.cbk(spanDom);
                return false;
            });
            $label.click(function(){
                var labs = $('label.i8-select');
                labs.each(function(){
                    if(!(this == labelDom)){
                        $(this).find('span.i8-sel-options').hide()
                    }
                });
                $label.find('span.i8-sel-options').toggle();
                return false;
            });
            $(document).on('click',function(){
                $('span.i8-sel-options').hide();
            });
            return this;
        }
        $.fn.getValue = function(){
            return $(this).find('span.i8-select-cked').attr('value');
        }
        $.fn.setValueByIndex = function(index){
            var selectDom = $(this).find('span.i8-select-cked');
            var $cu_option=$(this).find('span.i8-sel-options option').eq(index);
            selectDom.attr('value',$cu_option.attr('value')).html($cu_option.html());
            return;
        }
        $.fn.setValue = function(id){
            var hasSel=false;
            var selectDom = $(this).find('span.i8-select-cked');
            $(this).find('span.i8-sel-options em').each(function(){
                if($(this).attr('value') == id || $.trim($(this).text()) == $.trim(id)){
                    selectDom.attr('value', $(this).attr('value')).html($(this).html());
                    hasSel=true;
                    return;
                }
            });
            if(!hasSel){
                $(this).setValueByIndex(0);
            }
        }
        $.fn.setKey = function(text){
            var selectDom = $(this).find('span.i8-select-cked');
            $(this).find('span.i8-sel-options em').each(function(){
                if($.trim($(this).html()) == text){
                    selectDom.attr('value', $(this).attr('value')).html($(this).html());
                    return;
                }
            });
        }
        $.fn.getKey = function(){
            return $(this).find('span.i8-select-cked').html();
        }
        $.fn.getDom = function(){
            return $(this).find('span.i8-select-cked');
        }

        $.fn.setTime=function(json){
            json=json||{};
            this.addClass(!this.val()?'date-bg':'date-bg checked');
            this.on('focus',function(){
                WdatePicker(json);
                var _this=$(this);
                if(_this.val()==''){
                    _this.removeClass('checked');
                }else{
                    _this.addClass('checked');
                }
                var _t=_this.val();
                _this.val('').val(_t);

            });
            return this;
        }

        $.fn.setTextArea=function(json){
            var json= $.extend({
                l_height:'22',
                m_height:'36',
                color:'#f00',
                width:'698'
            },(json||{}));
            var _parent=this.parent();
            if(_parent.hasClass('textareaparent')) {
                return;
            }
            this.css({'line-height':json.l_height+'px','position':'absolute','height':'100%','width':json.width+'px'});
            //_parent=$('<div class="textareaparent" style="line-height: '+json.l_height+'px"></div>');
            this.wrap('<div class="textareaparent rel" style="line-height: '+json.l_height+'px"></div>');
            _parent=this.parent();
            _parent.append('<div class="textplace" style="word-break: break-all; min-height: '+json.m_height+'px; width:'+json.width+'px;"></div>')
            this.on('input propertychange',function(){
                var _this=$(this);
                _this.parent().find('.textplace').html(_this[0].value);
            });
        }
    })(jQuery);
//处理低版本placeHolder
(function($){
$.fn.placeholder=function(all){
    if(all){
        var isAdvBrowser = false;
    }else{
        var isAdvBrowser=!/msie [6,7,8,9]/.test(navigator.userAgent.toLowerCase());
    }
    this.each(function(){
        var _this=$(this);
        if(isAdvBrowser){
            return;
        }
        _this.placeVal=_this.attr('placeholder');
        _this.val(_this.placeVal);
        _this.focus(function(){
            if(_this.val()==_this.placeVal){
                _this.val('');
            }
        }).blur(function(){
            if(_this.val()=='' || _this.val()==null){
                _this.val(_this.placeVal);
            }
        })
    })
    return this;
}
})(jQuery);
//输入错误提示 闪动背景颜色效果
var TxtBoxWarn = function (txtobj) {
var colors = ["rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)"];
var colorAnimate = function (cls) {
    var clrTimer = null;
    if (cls.length > 0) {
        clrTimer = setTimeout(function () {
            txtobj.css({ "background-color": cls.shift() });
            colorAnimate(cls);
        }, 100);
    } else {
        clearTimeout(clrTimer);
    }
}
colorAnimate(colors);
};
var exports = {};
exports.showNoTitle = showbox;
exports.showbox = showbox;
exports.confirm = i8Confirm;
exports.alert = i8alert;
exports.formalert = i9alert;
exports.txterror = function(message,btnDom){
    i9alert({title:message,stype: true, btnDom: btnDom});
setTimeout(function(){
    $("#js_lg_tp_div").fadeOut(500);
},3000);
}
exports.trterror = function(message,btnDom){
    rightalert({title:message,stype: true, btnDom: btnDom});
setTimeout(function(){
    $("#js_lg_tp_div").fadeOut(500);
},3000);
}
exports.error = function(message,btnDom){
i8alert({title: message,btnDom:btnDom});
}
exports.write= function(message){
i8alert({title: message,type:2});
}
exports.simpleWrite= function(message,btnDom){
i8alert({title: message,type:2,btnDom:btnDom});
}
exports.successMask= function(message){
i8alert({title: message,type:2,noMask:false});
}
exports.simpleAlert= function(message,btnDom){
i8alert({title: message,type:1,btnDom:btnDom});
}
exports.txtBoxWarn = TxtBoxWarn;
exports.pagination=function(){
    /**
     * @class Class for calculating pagination values
     */
    $.PaginationCalculator = function(maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
    }

    $.extend($.PaginationCalculator.prototype, {
        /**
         * Calculate the maximum number of pages
         * @method
         * @returns {Number}
         */
        numPages : function() {
            return Math.ceil(this.maxentries / this.opts.items_per_page);
        },
        /**
         * Calculate start and end point of pagination links depending on
         * current_page and num_display_entries.
         * @returns {Array}
         */
        getInterval : function(current_page) {
            var ne_half = Math.floor(this.opts.num_display_entries / 2);
            var np = this.numPages();
            var upper_limit = np - this.opts.num_display_entries;
            var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
            var end = current_page > ne_half ? Math.min(current_page + ne_half + (this.opts.num_display_entries % 2), np) : Math.min(this.opts.num_display_entries, np);
            return {
                start : start,
                end : end
            };
        }
    });

    // Initialize jQuery object container for pagination renderers
    $.PaginationRenderers = {}

    /**
     * @class Default renderer for rendering pagination links
     */
    $.PaginationRenderers.defaultRenderer = function(maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
        this.pc = new $.PaginationCalculator(maxentries, opts);
    }
    $.extend($.PaginationRenderers.defaultRenderer.prototype, {
        /**
         * Helper function for generating a single link (or a span tag if it's the current page)
         * @param {Number} page_id The page id for the new item
         * @param {Number} current_page
         * @param {Object} appendopts Options for the new item: text and classes
         * @returns {jQuery} jQuery object containing the link
         */
        createLink : function(page_id, current_page, appendopts) {
            var lnk, np = this.pc.numPages();
            page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1);
            // Normalize page id to sane value
            appendopts = $.extend({
                text : page_id + 1,
                classes : ""
            }, appendopts || {});
            if (page_id == current_page) {
                lnk = $("<a class='" + (appendopts.current_cls || "selected") + "'>" + appendopts.text + "</a>");
            } else {
                lnk = $("<a>" + appendopts.text + "</a>").attr('href', this.opts.link_to.replace(/__id__/, page_id));
            }
            if (appendopts.classes) {
                lnk.addClass(appendopts.classes);
            }
            lnk.data('page_id', page_id);
            return lnk;
        },
        // Generate a range of numeric links
        appendRange : function(container, current_page, start, end, opts) {
            var i;
            for ( i = start; i < end; i++) {
                this.createLink(i, current_page, opts).appendTo(container);
            }
        },
        getLinks : function(current_page, eventHandler, cls) {
            var begin, end, interval = this.pc.getInterval(current_page), np = this.pc.numPages(), fragment = $("<div class='" + (cls || "pagination") + "'></div>");

            // Generate "Previous"-Link
            if (this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)) {
                fragment.append(this.createLink(current_page - 1, current_page, {
                    text : this.opts.prev_text,
                    classes : "prev",
                    current_cls : this.opts.prev_current_cls
                }));
            }
            // Generate starting points
            if (interval.start > 0 && this.opts.num_edge_entries > 0) {
                end = Math.min(this.opts.num_edge_entries, interval.start);
                this.appendRange(fragment, current_page, 0, end, {
                    classes : 'sp'
                });
                if (this.opts.num_edge_entries < interval.start && this.opts.ellipse_text) {
                    jQuery("<span>" + this.opts.ellipse_text + "</span>").appendTo(fragment);
                }
            }
            // Generate interval links
            this.appendRange(fragment, current_page, interval.start, interval.end);
            // Generate ending points
            if (interval.end < np && this.opts.num_edge_entries > 0) {
                if (np - this.opts.num_edge_entries > interval.end && this.opts.ellipse_text) {
                    jQuery("<span>" + this.opts.ellipse_text + "</span>").appendTo(fragment);
                }
                begin = Math.max(np - this.opts.num_edge_entries, interval.end);
                this.appendRange(fragment, current_page, begin, np, {
                    classes : 'ep'
                });

            }
            // Generate "Next"-Link
            if (this.opts.next_text && (current_page < np - 1 || this.opts.next_show_always)) {
                fragment.append(this.createLink(current_page + 1, current_page, {
                    text : this.opts.next_text,
                    classes : "next",
                    current_cls : this.opts.next_current_cls
                }));
            }

            if (this.opts.jump) {
                this.opts.jump.text=this.opts.jump.text||'go';
                jQuery('<input type="text" class="jumpnum" /><a class="jumpbtn">' + this.opts.jump.text + '</a>').appendTo(fragment);
            }
            $('a', fragment).click(eventHandler);
            return fragment;
        }
    });

    // Extend jQuery
    $.fn.pagination = function(maxentries, opts) {
        // Initialize options with default values
        opts = jQuery.extend({
            items_per_page : 10,
            num_display_entries : 11,
            current_page : 1,
            num_edge_entries : 0,
            link_to : "javascript:void(0)",
            prev_text : "prev",
            next_text : "next",
            ellipse_text : "...",
            prev_show_always : true,
            next_show_always : true,
            renderer : "defaultRenderer",
            cls : "pagination",
            callback : function() {
                return false;
            }
        }, opts || {});
        --opts.current_page;
        var containers = this, renderer, links, current_page;
        var totalPage=Math.ceil(maxentries / opts.items_per_page);
        /**
         * This is the event handling function for the pagination links.
         * @param {int} page_id The new page number
         */
        function paginationClickHandler(evt) {
            var target = $(evt.target);
            var links, new_current_page = target.data('page_id');
            if (isNaN(new_current_page)) {
                new_current_page = target.prev('input').val() - 1;
            }
            if (new_current_page>=0&&new_current_page<=totalPage-1) {
                var continuePropagation = selectPage(new_current_page);
                if (!continuePropagation) {
                    evt.stopPropagation();
                }
                return continuePropagation;
            }
        }

        /**
         * This is a utility function for the internal event handlers.
         * It sets the new current page on the pagination container objects,
         * generates a new HTMl fragment for the pagination links and calls
         * the callback function.
         */
        function selectPage(new_current_page) {
            // update the link display of a all containers
            containers.data('current_page', new_current_page);
            links = renderer.getLinks(new_current_page, paginationClickHandler, opts.cls);
            containers.empty();
            links.appendTo(containers);
            // call the callback and propagate the event if it does not return false
            var continuePropagation = opts.callback(new_current_page + 1, containers);
            return continuePropagation;
        }

        // -----------------------------------
        // Initialize containers
        // -----------------------------------
        current_page = opts.current_page;
        containers.data('current_page', current_page);
        // Create a sane value for maxentries and items_per_page
        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;

        if (!$.PaginationRenderers[opts.renderer]) {
            throw new ReferenceError("Pagination renderer '" + opts.renderer + "' was not found in jQuery.PaginationRenderers object.");
        }
        renderer = new $.PaginationRenderers[opts.renderer](maxentries, opts);

        // Attach control events to the DOM elements
        var pc = new $.PaginationCalculator(maxentries, opts);
        var np = pc.numPages();
        containers.bind('setPage', {
            numPages : np
        }, function(evt, page_id) {
            if (page_id >= 0 && page_id < evt.data.numPages) {
                selectPage(page_id);
                return false;
            }
        });
        containers.bind('prevPage', function(evt) {
            var current_page = $(this).data('current_page');
            if (current_page > 0) {
                selectPage(current_page - 1);
            }
            return false;
        });
        containers.bind('nextPage', {
            numPages : np
        }, function(evt) {
            var current_page = $(this).data('current_page');
            if (current_page < evt.data.numPages - 1) {
                selectPage(current_page + 1);
            }
            return false;
        });

        // When all initialisation is done, draw the links
        links = renderer.getLinks(current_page, paginationClickHandler, opts.cls);
        containers.empty();
        links.appendTo(containers);
        // call callback function
        //opts.callback(current_page, containers);
    }// End of $.fn.pagination block
    return function(opt) {
        if (!(opt && opt.totalPageCount && opt.pageSize)) {
            return false;
        }
        if (opt.totalPageCount > opt.pageSize) {
            jQuery(opt.ctr).pagination(opt.totalPageCount, {
                callback : opt.fun,
                prev_text : '<', //上一页按钮里text
                next_text : '>', //下一页按钮里text
                items_per_page : opt.pageSize, //显示条数
                num_display_entries : 3, //连续分页主体部分分页条目数
                current_page : opt.current, //当前页索引
                num_edge_entries : 1, //两侧首尾分页条目数
                cls : "cutepage",
                prev_current_cls : "disabled",
                next_current_cls : "disabled",
                jump : opt.jump || false
            });
        } else {
            $(opt.ctr).html('');
        }
    }
}
return exports;
};
var util = utilfunc();
var i8ui = i8uifunc();
//账号能否使用验证方法
function yzPassport(txtDom,type,cbk){
    var passport = $.trim(txtDom.val()).toLocaleLowerCase();
    if(!passport){
        passport = txtDom.html();
    }
    if(type && !regObj.femailTest(passport)){
        i8ui.txterror("邮箱格式不正确！", txtDom);
        i8ui.txtBoxWarn(txtDom);
        pubCodeDom.addClass("disabled");
        return;
    }
    if(!type && !regObj.fmobileTest(passport)){
        i8ui.txterror("手机号格式不正确！", txtDom);
        i8ui.txtBoxWarn(txtDom);
        pubCodeDom.addClass("disabled");
        return;
    }
    $.ajax({
        url: "/webajax/login/getIdentity",
        type: "get",
        dataType: "json",
        data: { jdata:{passport:passport}},
        success: function (data) {
            if (data.Result) {
                if(!data.ReturnObject){
                    if(pubCodeDom.html() == "获取验证码"){
                        pubCodeDom.removeClass("disabled");
                    }
                    if(cbk){
                        cbk();
                    }
                }else{
                    i8ui.txterror("该账号已存在",txtDom);
                    i8ui.txtBoxWarn(txtDom);
                    pubCodeDom.addClass("disabled");
                }
            }else {
                i8ui.error(data.Description)
            }
        },
        error: function () {
        }
    });
}
//账号能否使用验证方法
function yzPassportTwo(passport,type,cbk){
    passport = passport.toLocaleLowerCase();
    if(type && !regObj.femailTest(passport)){
        i8ui.txterror("邮箱格式不正确！", txtDom);
        i8ui.txtBoxWarn(txtDom);
        pubCodeDom.addClass("disabled");
        return;
    }
    if(!type && !regObj.fmobileTest(passport)){
        i8ui.txterror("手机号格式不正确！", txtDom);
        i8ui.txtBoxWarn(txtDom);
        pubCodeDom.addClass("disabled");
        return;
    }
    $.ajax({
        url: "/webajax/login/isJoined",
        type: "get",
        dataType: "json",
        data: { jdata:{passport:passport}},
        success: function (data) {
            if (data.Result) {
                if(!data.ReturnObject){
                    pubCodeDom.removeClass("disabled");
                    if(cbk){
                        cbk();
                    }
                }else{
                    i8ui.txterror("该账号已存在",txtDom);
                    i8ui.txtBoxWarn(txtDom);
                    pubCodeDom.addClass("disabled");
                }
            }else {
                i8ui.error(data.Description)
            }
        },
        error: function () {
        }
    });
}