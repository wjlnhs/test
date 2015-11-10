/**
 * Created by jialin on 2014/12/15.
 */

//防止不支持 console的浏览器出现js错误
if (!window.console) {
    window.console = {};
    window.console.log = function () { return; }
}

String.prototype.toDate = function () {
    return new Date(this.replace(/-/g, '/'));
};

var fw = {};
fw.cpec = {};
window.fw = fw;
window.cpec = fw.cpec;
var cpec = fw.cpec;
var doc = document;
var evt = window.event;

//var fw_globalConfig = {
//    root: '/',
//    cacheSeconds: 15,
//    ResourceRoot: '/Resource/default/',
//    LangResourceRoot: '/Resource/default/zh-cn/',
//    AccountLevel: -1,
//    LevelInfoLoad: function () {
//        if (fw_globalConfig.AccountLevel == -1) {
//            $.ajax({
//                url: fw_globalConfig.root + 'handler/AuthPassportHandler.ashx?r=verf',
//                type: 'post',
//                async: false,
//                dataType: 'json',
//                success: function (response) {
//                    if (response.Result) {
//                        if (response.ReturnObject) {
//                            fw_globalConfig.AccountLevel = response.ReturnObject;
//                        }
//                    }
//                },
//                error: function () {
//                    fw_globalConfig.AccountLevel = 0;
//                }
//            });
//        }
//    }
//};


cpec.common = function () {
    //var _fLoadCss = function (url) {
    //    var head = document.getElementsByTagName('head')[0] || document.documentElement,
    //		css = document.createElement('link');
    //    css.rel = 'stylesheet';
    //    css.type = 'text/css';
    //    css.href = url;
    //    head.insertBefore(css, head.firstChild);
    //}
    //var _fTip = function (option) {
    //    var option = option || {};
    //    var _html = option.html || '';
    //    var _showTime = option.showTime || 2000;
    //    var _sWidth = option.width;
    //    var _sHeight = option.height;
    //    var _left = (document.documentElement.clientWidth - parseFloat(_sWidth)) / 2 + document.documentElement.scrollLeft + "px";

    //    var _top = (document.documentElement.clientHeight - parseFloat(_sHeight)) / 2 + document.documentElement.scrollTop - 50 + "px";
    //    var _ele = option.ele;
    //    if (_ele) {
    //        _top = _ele.offset().top;
    //        _left = _ele.offset().left;
    //    }
    //    var _eTipDiv = document.createElement('div');
    //    _eTipDiv.id = "cpecTipDiv";
    //    _eTipDiv.style.top = _top;
    //    _eTipDiv.style.left = _left;
    //    _eTipDiv.style.zIndex = 400;
    //    _eTipDiv.style.border = '1px solid gray';
    //    _eTipDiv.innerHTML = _html;
    //    document.body.appendChild(_eTipDiv);
    //    setTimeout('document.body.removeChild(document.getElementById("cpecTipDiv"))', _showTime);
    //};
    //var _fDrag = function (options) {
    //    var isQuirk = document.documentMode ? document.documentMode == 5 : document.compatMode && document.compatMode != "CSS1Compat",
    //    options = options || {},
    //    container = options.container,
    //    moveContainer = options.moveContainer,
    //    handle = options.handle,
    //    scroll = options.scroll,
    //    coords = options.coords,
    //    onMoveStart = options.onMoveStart || function () { },
    //    onDrag = options.onDrag || function () { },
    //    onMoveEnd = options.onMoveEnd || function () { },
    //    cls,
    //    _handle,
    //    _top,
    //    _left,
    //    _html;
    //    container.style.position = "fixed";
    //    var dragstart = function (e) {
    //        e = e || window.event;
    //        container.offset_x = e.clientX - container.offsetLeft;
    //        container.offset_y = e.clientY - container.offsetTop;
    //        document.onmouseup = dragend;
    //        document.onmousemove = drag;
    //        onMoveStart();
    //    }
    //    var drag = function (e) {
    //        e = e || window.event;
    //        ! +"\v1" ? document.selection.empty() : window.getSelection().removeAllRanges();
    //        _left = e.clientX - container.offset_x;
    //        _top = e.clientY - container.offset_y;

    //        container.style.left = _left + "px";
    //        container.style.top = _top + "px";
    //        onDrag();
    //    }
    //    var domStorage = null; //暂存dom元素
    //    var domParent = null;  //dom的父元素
    //    var dragend = function () {
    //        document.onmouseup = null;
    //        document.onmousemove = null;
    //        container.style.left = _left + "px";
    //        container.style.top = _top + "px";
    //        onMoveEnd();
    //    }
    //    // _fDrag.z = options.zIndex||10000;
    //    moveContainer.style.cursor = "move";
    //    moveContainer.onmousedown = dragstart;
    //}

    //var _fColsePopUpDialog = function () {
    //    var _eCpecPopUpBg = document.getElementById('cpecPopUpBg');
    //    var _eCpecPopDiv = document.getElementById("fw_cpecPopDiv");
    //    //如果两个元素都不在在，则不执行任何操作
    //    if (!_eCpecPopUpBg && !_eCpecPopDiv) {
    //        return;
    //    }
    //    if (!!_eCpecPopDiv) {
    //        document.body.removeChild(_eCpecPopDiv);
    //    }
    //    if (!!_eCpecPopUpBg) {

    //        document.body.removeChild(_eCpecPopUpBg);
    //    }
    //    document.body.style.overflow = 'auto';
    //    if (!!domStorage && !!domParent) {
    //        domParent.appendChild(domStorage);
    //        domParent = null;
    //        domStorage = null;
    //    }
    //};

    //var _fOverLay = function (option) {
    //    //以下部分使整个页面至灰不可点击
    //    var ele = option.ele;
    //    if (!ele) {
    //        return;
    //    }
    //    var width = option.width || ele.width(),
    //    height = option.height || ele.height(),
    //    left = option.left || '0px',
    //    top = option.top || '0px';
    //    //var _position = ele.position();
    //    var _eShadeDiv = document.createElement("div"); //首先创建一个div
    //    _eShadeDiv.setAttribute("id", "jsOverLay"); //定义该div的id
    //    _eShadeDiv.style.background = "#ffffff";
    //    _eShadeDiv.style.width = width;
    //    _eShadeDiv.style.height = height;
    //    _eShadeDiv.style.top = top;
    //    _eShadeDiv.style.left = left;
    //    _eShadeDiv.style.position = "absolute";
    //    _eShadeDiv.style.zIndex = '99999';
    //    _eShadeDiv.style.opacity = "0.8";
    //    _eShadeDiv.style.filter = "Alpha(opacity=80)";
    //    //document.body.style.overflow = "fw_hidden"; //取消滚动条
    //    ele[0].appendChild(_eShadeDiv);
    //}

    //var _fPopUpDialog = function (option) {
    //    _fColsePopUpDialog(); //如果弹出层存在，则先关闭弹出层
    //    var opt = option || {};
    //    var _ele = opt.ele,
    //       _sHtml = opt.html || "";         //弹出层html代码
    //    if (!!opt.ele && opt.ele.nodeType === 1) {
    //        try {
    //            domStorage = opt.ele;
    //            domParent = opt.ele.parentNode;
    //            _sHtml = opt.ele.innerHTML; //有的元素无法使用innerHTML取到代码
    //            domParent.removeChild(domStorage);
    //        } catch (e) {
    //            alert(e);
    //        }
    //    }
    //    var _sWidth = opt.width,             //弹出层宽度
    //        _nZIndex = option.zIndex || 90,        //z-index值
    //        _sHeight = opt.height,           //弹出层高度

    //        _sTitle = opt.title,             //弹出层标题
    //        _bDragable = !!option.dragable;  //是否允许拖动，默认为false

    //    var _left = (document.documentElement.clientWidth - parseFloat(_sWidth)) / 2 + document.documentElement.scrollLeft + "px";
    //    var _top = (document.documentElement.clientHeight - parseFloat(_sHeight)) / 2 + document.documentElement.scrollTop - 50 + "px";

    //    //以下部分使整个页面至灰不可点击
    //    var _eShadeDiv = document.createElement("div"); //首先创建一个div
    //    _eShadeDiv.setAttribute("id", "cpecPopUpBg"); //定义该div的id
    //    _eShadeDiv.style.background = "#000000";
    //    _eShadeDiv.style.width = "100%";
    //    _eShadeDiv.style.height = "100%";
    //    _eShadeDiv.style.position = "fixed";
    //    _eShadeDiv.style.top = "0";
    //    _eShadeDiv.style.left = "0";
    //    _eShadeDiv.style.zIndex = _nZIndex;
    //    _eShadeDiv.style.opacity = "0.2";
    //    _eShadeDiv.style.filter = "Alpha(opacity=20)";
    //    document.body.style.overflow = "hidden"; //取消滚动条
    //    var _ePopDiv = document.createElement('div');
    //    _ePopDiv.setAttribute("id", "fw_cpecPopDiv");
    //    _ePopDiv.style.top = _top;
    //    _ePopDiv.style.left = _left; //class="fw_layerpanl"
    //    _ePopDiv.innerHTML = '<div class="fw_layerpanl" style="display:block;margin-top:0px;margin-left:0px;">' +
    //    '<div class="fw_layerpanl_content">' +
    //        '<div class="fw_layerpanl_title" id="cpecPopTitle">' +
    //            '<span>' + _sTitle + '</span>' +
    //        '</div>' +
    //        '<a class="fw_layerpanl_close" onclick="cpec.common.fColsePopUpDialog();"></a>' +
    //        '<div class="fw_layerpanl_text">' + _sHtml + '</div></div></div>'
    //    document.body.appendChild(_eShadeDiv);
    //    document.body.appendChild(_ePopDiv);
    //    if (_bDragable) { //如果允许拖动，则初始化拖动代码
    //        option.container = document.getElementById('fw_cpecPopDiv');
    //        option.moveContainer = document.getElementById('cpecPopTitle');
    //        _fDrag(option);
    //    }
    //};

    //表情对象数组
    var faceArr = [['微笑', 'xiao.gif'], ['大笑', 'daxiao.gif'], ['花痴', 'huachi.gif'], ['傲慢', 'aoman.gif'], ['拜拜', 'baibai.gif'], ['悲剧', 'beiju.gif'], ['弱', 'bishi.gif'], ['鄙视', 'bishiwuxian.gif'], ['发呆', 'biti.gif'], ['闭嘴', 'bizui.gif'], ['大哭', 'dakuyic.gif'], ['大骂', 'dama.gif'], ['顶你', 'dingni.gif'], ['点头笑', 'diantouxiao.gif'], ['汗', 'dihan.gif'], ['惊恐', 'chaojidihan.gif'], ['敲打', 'chuizi.gif'], ['抓狂', 'fapiqi.gif'], ['奋斗', 'fengdou.gif'], ['鼓掌', 'guzhang.gif'], ['打哈欠', 'dahaqi.gif'], ['擦汗', 'han.gif'], ['尴尬', 'hanhanhan.gif'], ['困', 'heiyanquan.gif'], ['白眼', 'hewowuguan.gif'], ['吃惊', 'jingya.gif'], ['惊讶', 'jinya.gif'], ['哼', 'jusang.gif'], ['可怜', 'kelian.gif'], ['泪', 'ku.gif'], ['骷髅', 'kulou.gif'], ['害羞', 'meimei.gif'], ['坏笑', 'meiyan.gif'], ['怒', 'nu.gif'], ['左哼哼', 'qie.gif'], ['亲亲', 'qingqing.gif'], ['吓', 'shengma.gif'], ['大兵', 'shibing.gif'], ['酷', 'shuai.gif'], ['睡觉', 'shuijiao.gif'], ['疑问', 'smwenhao.gif'], ['偷笑', 'touxiao.gif'], ['吐', 'tu.gif'], ['调皮', 'tushet.gif'], ['挖鼻屎', 'wabikong.gif'], ['无奈', 'wunaikuqi.gif'], ['右哼哼', 'wushibishi.gif'], ['快哭了', 'wuyu.gif'], ['冷汗', 'xiaodihan.gif'], ['可爱', 'xiusedexiao.gif'], ['糗大了', 'xiusedihan.gif'], ['嘘', 'xu.gif'], ['晕', 'yun.gif'], ['阴险', 'zeixiao.gif'], ['委屈', 'zhege.gif'], ['猪头', 'zhu.gif']];

    var imgPath = '/Resource/default/zh-cn/images/face/';
    //表情替换正则
    var faceReg = /\[[\u4e00-\u9fa5]{1,6}\]/g;
    //将表情数对象组转换成表情对象
    var faceObj = {};
    //------------- 华丽的分割线  -----------------
    for (var i = 0; i < faceArr.length; i++) {
        faceObj[faceArr[i][0]] = faceArr[i][1];
    }
    //替换表情字符, 添加图片tag  并且 , 替换其中的超链接
    var fFaceHandle = function (str) {
        var str = str || '';
        //        var result = str.match(faceReg);
        //        if (result != null) {
        //            for (var i = 0; i < result.length; i++) {
        //                str = str.replace(result[i], '<img src="' + imgPath + faceObj[result[i].slice(1, -1)] + '" width="24" height="24" alt="' + result[i] + '"/>');
        //            }
        //        }

        return str.replace(faceReg, function (data) {
            return '<img src="' + imgPath + faceObj[data.slice(1, -1)] + '" width="24" height="24" alt="' + data + '"/>';
        });
    };

    //取字符串长度
    var fGetCharacterCount = function (str, k) {
        var len = str.length;
        var count = 0;
        for (var i = 0; i < len; i++) {
            if (str[i] == k) {
                count++;
            }
        }
        return count;
    }
    //截断侃侃消息字符串　[微笑]
    var fTruncationStr = function (str, tlen) {
        if (!str)
            return "";
        var tlen = tlen || 20; //如果不传截断多少个字符，默认是20个字符
        var str = str.replace(/<[^>]*>/gi, '');
        var len = str.length;
        if (len <= tlen) {
            return str;
        }
        var match = (str.substr(tlen - 4, 4));
        var leftBracketCount = fGetCharacterCount(match, '[');
        if (leftBracketCount == 0) {
            return str.substr(0, tlen) + '...';
        }
        var rightBracketCount = fGetCharacterCount(match, ']');
        if (leftBracketCount == rightBracketCount) {
            return str.substr(0, tlen) + '...';
        }
        var index = match.lastIndexOf('[');
        return str.substr(0, (tlen - 4) + index) + '...';
    }

    return {
        //fPopUpDialog: _fPopUpDialog,
        //fColsePopUpDialog: _fColsePopUpDialog,
        //fOverLay: _fOverLay,
        fFaceHandle: fFaceHandle, //表情替换
        fTruncationStr: fTruncationStr //截断侃侃消息字符串
    };
} ();

//cpec.array = function () {
//    //类数组转换
//    var _fCon2Arr = function () {
//        return Array.prototype.slice.call(arguments);
//    };
//    return {
//        fCon2Arr: _fCon2Arr //类数组转换成数组
//    }
//} ();

//cpec.login =
//{
//    fAdjustContentHeight: function (option) {
//        var _option = option || {};
//        var _id = _option.id || "content";
//        var _ele = _option.ele || document.getElementById(_id);
//        var _sMinHeight = _option.minHeight || '300px';
//        var _nWinHeight = $(window).height();
//        var _nBodyHeight = $('body').height();
//        var _sHeight = _option.height || (_nWinHeight - 180 - 30 + 'px');
//        $(_ele).css("height", _sHeight); //
//        $(_ele).css('minHeight', _sMinHeight);
//    }
//};

//给href添加accountId
/*
 container: 需要处理链接的容器
 a: accountId的值(默认从url中取，如果取不到需要手动传递);
 */
cpec.operation = function () {
    var fAddAccountIdOnHref = function (option) {
        var option = option || {};
        var __aid = cpec.string.fParamToJson(window.location.href, "a") || option.a || '';
        if (!__aid) {
            return;
        }
        var _container = option.container || 'body';
        var _href = "";
        $(_container + " a").each(function (index, sender) {
            _href = sender.getAttribute('href');
            if (!_href) {
                return true;
            }
            if (_href.toLowerCase().indexOf('#') == 0 || _href.toLowerCase().indexOf("void(0)") >= 0 || _href.toLowerCase().indexOf("javascript:") >= 0 || _href.toLowerCase().indexOf('i8xs.cn') > -1) {
                return true;
            }
            sender.setAttribute('href', cpec.string.fSetUrlParam("a", __aid, _href, false));
        });
    }
    return {
        fAddAccountIdOnHref: fAddAccountIdOnHref
    }
} ();

cpec.string = function () {
    var fFormat = function () {
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
    }

    var fByteLength = function (b) {
        if (typeof b == "undefined") {
            return 0;
        }
        var a = b.match(/[\u4e00-\u9fa5]/g);
        return (b.length + (!a ? 0 : a.length));
    };
    /**
     * 解析url或search字符串。
     * @method queryUrl
     * @static
     * @param {String} s url或search字符串
     * @param {String} key (Optional) 参数名。
     * @return {Json|String|Array|undefined} 如果key为空，则返回解析整个字符串得到的Json对象；否则返回参数值。有多个参数，或参数名带[]的，参数值为Array。
     fParamToJson({url:location.url,key:'key','replace':true})
     fParamToJson(
     */
    var fParamToJson = function (url, key, replace) {
        url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
        var json = {};
        //考虑到key中可能有特殊符号如“[].”等，而[]却有是否被编码的可能，所以，牺牲效率以求严谨，就算传了key参数，也是全部解析url。
        url.replace(/(^|&)([^&=]+)=([^&]*)/g, function (a, b, key, value) {
            //            try {
            //                key = decodeURIComponent(key); //防止出现错误
            //                value = decodeURIComponent(value);
            ////            }
            ////            catch (e) {

            ////            }

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
    //如果url参数存在 不做任何操作，否则把参数增加到url中
    var fSetUrlParam = function (para_name, para_value, url, replace) {
        if (!replace) {
            replace = false;
        }
        var strUrl = url.substr(0, (url.indexOf("#") > 0 ? url.indexOf("#") : url.length));
        var sharp = url.indexOf("#") > 0 ? url.substr(url.indexOf("#")) : "";
        var index = strUrl.indexOf("?");
        var arr = [];
        if (index != -1) {
            var before = strUrl.substr(0, index); //?问号之前的数据
            var after = strUrl.substr(index + 1); //?问号之后的数据
            var json = fParamToJson(after);

            if (replace || !(para_name in json)) {
                json[para_name] = para_value;
            }
            for (var i in json) {
                arr.push(i + '=' + json[i]);
            }

            return before + '?' + arr.join('&') + (sharp.length > 0 ? sharp : "");
        }
        else {
            strUrl += "?" + para_name + "=" + para_value;
            return (strUrl + (sharp.length > 0 ? sharp : "")).toLowerCase();
        }
    };
    var oneDay = 3600 * 24 * 1000, oneHour = 3600 * 1000, oneMinute = 60 * 1000, week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    //分钟处理函数  ，当分钟小于10时，自动在分钟前补0
    var fMinuteHandle = function (minute) {
        if (minute < 10) {
            return '0' + minute;
        }
        return minute;
    }
    var fDayHandle = function (day) {
        if (day < 10) {
            return '0' + day;
        }
        return day;
    }
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
    }
    return {
        fFormat: fFormat, //格式化字符串
        fByteLength: fByteLength, //取字符串长度
        fParamToJson: fParamToJson, //将url格式的字符串转换成json
        fSetUrlParam: fSetUrlParam, //设置或替换url格式的字符串
        fDateHandle: fDateHandle    //侃侃消息日期显示格式化
    }
} ();
//cpec.ui = function () {
//    var doc = document;

//    var placeHolderPerfect = function () {
//                function isPlaceHolder() {  //判断浏览器是否支持placeholder
//                    var input = document.createElement("input");
//                    return "placeholder" in input;
//                }
//                if (!isPlaceHolder()) {
//                    function placeHolder(obj) {
//                        if (!obj) { return; }
//                        this.input = obj;
//                        this.label = document.createElement("label");
//                        this.label.innerHTML = obj.getAttribute("placeholder");
//                        this.label.className = "placeholder";
//                        if (obj.value != "") {
//                            this.label.style.display = "none";
//                        }
//                        this.init();
//                    }
//                    placeHolder.prototype = {
//                        getxy: function (obj) {
//                            if (document.documentElement.getBoundingClientRect) {
//                                var st = document.documentElement.scrollTop || document.body.scrollTop,
//                            sl = document.documentElement.scrollLeft || document.body.scrollLeft,
//                            ct = document.documentElement.clientTop || document.body.clientTop,
//                            cl = document.documentElement.clientLeft || document.body.clientLeft
//                                return { left: obj.getBoundingClientRect().left + sl - cl, top: obj.getBoundingClientRect().top + st - ct };
//                            }
//                            else {
//                                var l = t = 0;
//                                while (obj) {
//                                    l += obj.offsetLeft;
//                                    t += obj.offsetTop;
//                                    obj = obj.offsetParent;
//                                }
//                                return { top: t, left: l }
//                            }
//                        },
//                        getwh: function (obj) {
//                            return { w: obj.offsetWidth, h: obj.offsetHeight }
//                        },
//                        setStyles: function (obj, styles) {
//                            for (var p in styles) {
//                                obj.style[p] = styles[p] + 'px';
//                            }
//                        },
//                        init: function () {
//                            var label = this.label,
//                        input = this.input,
//                        xy = this.getxy(input),
//                        wh = this.getwh(input);
//                            this.setStyles(label, { 'width': wh.w, 'height': wh.h, 'lineHeight': wh.h, 'left': xy.left, 'top': xy.top });
//                            document.body.appendChild(this.label);
//                            label.setAttribute("for",input.id);
//                            label.onclick = function () {
//                                this.style.display = "none";
//                                input.focus();
//                            }
//                            input.onfocus = function () {
//                                label.style.display = "none";
//                            };
//                            input.onblur = function () {
//                                if (this.value == "") {
//                                    label.style.display = "";
//                                }
//                            };
//                        }
//                    }
//                    function init() {
//                        var inps = document.getElementsByTagName("input");
//                        for (var i = 0, len = inps.length; i < len; i++) {
//                            if (inps[i].getAttribute("placeholder")) {
//                                new placeHolder(inps[i]);
//                            }
//                        }
//                    }
//                    window.onload = init;
//                }

//    }

//    var placeHolderHandle = function () {
//                var input = doc.getElementsByTagName('input');
//                var textArea = doc.getElementsByTagName('textarea');
//                var inputs = [];
//                for (var i = 0; i < input.length; i++) {
//                    inputs.push(input[i]);
//                }
//                for (var j = 0; j < textArea.length; j++) {
//                    inputs.push(textArea[j]);
//                }
//                var supportPlaceholder = 'placeholder' in doc.createElement('input'),
//                placeholder = function (input) {
//                    var text = input.getAttribute('placeholder'),
//        			defaultValue = input.defaultValue;
//                    if (defaultValue == '') {
//                        input.value = text;
//                        $(input).css('color', '#A9A9A9');
//                    }
//                    else {
//                        $(input).css('color', '#575E6D');
//                    }

//                    cpec.eventUtil.addListener(input, 'focus', function (event) {
//                        var target = event.target || event.srcElement;
//                        if (target.value === text) {
//                            target.value = '';
//                        }
//                        $(target).css('color', '#575E6D');
//                    });
//                    cpec.eventUtil.addListener(input, 'blur', function (event) {
//                        var target = event.target || event.srcElement;
//                        if (target.value === '') {
//                            target.value = text;
//                            $(target).css('color', '#A9A9A9');
//                        }
//                    });
//                };
//                if (!supportPlaceholder) {
//                    for (var i = 0, len = inputs.length; i < len; i++) {
//                        var input = inputs[i], text = input.getAttribute('placeholder');
//                        if ((input.type === 'text' || input.tagName == 'TEXTAREA') && text) {
//                            placeholder(input)
//                        }
//                    }
//                }
//        fplaceholder();
//    };

//    /* 在body上点击click 移除弹出层 */

//    var fPopUpCloseHandle = function () {

//        var fRegisterHandle = function (callBackFn) {
//            $('body').bind('click', callBackFn);
//        }

//        var fRemoveHandle = function (callBackFn) {
//            $('body').unbind('click', callBackFn);
//        }
//        return {
//            fRegisterHandle: fRegisterHandle,
//            fRemoveHandle: fRemoveHandle
//        }
//    } ();

//    var fAdjustContentHeight = function (option) {
//        var _option = option || {};
//        var _id = _option.id || "content";
//        var _ele = _option.ele || document.getElementById(_id);
//        var _sMinHeight = _option.minHeight || '300px';
//        var _nWinHeight = $(window).height();
//        var _nBodyHeight = $('body').height();
//        var _sHeight = _option.height || (_nWinHeight - 180 - 30 + 'px');
//        var _nDocumentHeight = $(document).height();
//        var _nMaxHeight = Math.max(_nBodyHeight, _nDocumentHeight);
//        $(_ele).css("height", _sHeight); //

//        $(_ele).css('minHeight', _sMinHeight);
//    };

//    当失去焦点时清除提示信息
//    var fClearTipsWhenBlur = function (eleId) {
//        var element = document.getElementById(eleId);
//        if (!element) return;
//        $(element).focus(function () {
//            $(this).val('');
//        }).blur(function () {

//            var value = $(this).val();
//            if ($.trim(value).length == 0)
//                $(this).val(element.defaultValue);
//        }); ;
//    }

//    return {
//        placeHolderHandle: placeHolderHandle,  //模拟html5的placeHolder效果
//        fAdjustHeight: fAdjustContentHeight,    //调整页面的高度 @TODO
//        fClearTipsWhenBlur: fClearTipsWhenBlur
//    }
//} ();

//设置com块的最小高度
var setMainHeight = function () {
    var hobj = $(".fw_body_header"), cobj = $(".app_center,.app_center800"), fobj = $(".fw_body_footer");
    var bobj = $(".app_com")
    if (bobj.length <= 0) {
        bobj = $(".fw_body_center");
    }
    var headnum = hobj.outerHeight();
    var bodynum = bobj.outerHeight();
    var footdnum = fobj.outerHeight();
    var windownum = $(window).height();
    var centernum = cobj.outerHeight();
    if (headnum <= 0) {
        headnum = 38
    }
    var minheight = windownum - headnum - footdnum;
    if (minheight > bodynum) {
        bobj.css("min-height", minheight);
    }
    cobj.css("min-height", minheight);
}

//监听滚轮事件
$(window).scroll(function () {
    //当滚动条滚动100个像素时，出现回到顶部按钮
    if ($(document).scrollTop() > 100) {
        $("#fw_backtop").css({ display: "block" });
    } else {
        $("#fw_backtop").hide();
    }
});

$(window).load(function () {
    var shtml = "<a id='fw_backtop' class='fw_backtop' title='回到顶部'></a>";
    $(".app_com").append(shtml);
    $("#fw_backtop").click(function () {
        $(document).scrollTop(0);
    });
});

$(window).resize(function () {
    //设置页面com 块的最小高度
    setMainHeight();
});
//$(document).ajaxComplete(function () {
//    //设置页面com 块的最小高度
//    setMainHeight();
//});
$(window).load(function () {
    //设置页面com 块的最小高度
    setMainHeight();
});

//$.ajaxSetup({
//    cache: true,
//    beforeSend: function (xhr, s) {
//        var seconds = fw_globalConfig.cacheSeconds;
//        if (seconds) {
//            s.url = cpec.string.fSetUrlParam("rd", GetRandTicket(seconds), s.url, false);
//        }
//    }
//});

//function GetRandTicket(span) {
//    var d = new Date();
//    return (d.getTime() - (d.getTime() % (span * 1000))) / 1000;
//}
//创建cookie
function SetCookie(sName, sValue, days) {
    DelCookie(sName);
    if (!days) {
        document.cookie = sName + "=" + encodeURIComponent(sValue) + ';path=/;';
        return;
    }
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = sName + "=" + encodeURIComponent(sValue) + ";path=/; expires=" + exp.toGMTString();
}
//获取
function GetCookie(sName) {
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (sName == aCrumb[0])
            return unescape(aCrumb[1]);
    }
}
//删除
function DelCookie(sName) {
    document.cookie = sName + "=" + encodeURIComponent("") + "; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
}
//程序开发过程中需要的JS暂时写在这里，后期再整合
function fw_GoPage(url) {
    //原始页面跳转
    if (url.indexOf('?') > 0) {
        window.location.href = url.toLowerCase() + "&a=" + fw_request("a");
    }
    else {
        window.location.href = url.toLowerCase() + "?a=" + fw_request("a");
    }
}
function fw_GoNPage(url) {
    //新窗口打开
    window.open(url)
}
function fw_request(paras) {
    var url = location.href.indexOf("#") > 0 ? location.href.substring(0, location.href.indexOf("#")) : location.href;
    //var url = location.href;
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

var fw_CreateTurnPage = function(ctr, totalPageCount, current, fun, pageSize) {
    //<%-- 分页，PageCount是总条目数，这是必选参数，其它参数都是可选  --%>
    //
    if (totalPageCount > pageSize) {
        $("#" + ctr).pagination(totalPageCount, {
            callback: fun,
            prev_text: '上一页', //上一页按钮里text
            next_text: '下一页', //下一页按钮里text
            items_per_page: pageSize, //显示条数
            num_display_entries: 3, //连续分页主体部分分页条目数
            current_page: current, //当前页索引
            num_edge_entries: 1, //两侧首尾分页条目数
            cls: "cutepage",
            prev_current_cls: "disabled",
            next_current_cls: "disabled"
        });
    } else {
        $("#" + ctr).html("");
    }
};

//转换时间格式（用于ajax获取数据后执行格式转换）
function dateformat(value, format) {
    return new Date(+/\d+/.exec(value)).format(format);
}

Date.prototype.format = function (format,mean) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    var tomean=false;
    if(mean){
        switch (true){
            case new Date().getDate()==this.getDate():
                format=format.replace(/M|d|y/g,'').replace(/^[^hmsS]+/g,'');
                format="今天"+format
                break;
        }
    }
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate() , // day
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
//数据列表无数据时 调用的函数
var fw_nocontent = function (obj, title) {
    obj.html('<div class="fw_nocontent_tips_panl"><span>' + title + '</span></div>');
}
//组件无数据时调用的提示函数
var fw_group_nocontent = function (obj, title) {
    obj.html('<div class="fw_nocontent_tips_panl" style="color:#C8CACC; border:none; margin:0px;"><span>' + title + '</span></div>');
}
//左边组件无数据时
//var fw_left_group_nocontent = function (obj, title) {
//    obj.html('<div class="fw_nocontent_tips_panl" style="color:#C8CACC; border-width:1px; margin:0px;"><span>' + title + '</span></div>');
//}
encodeHTML = function (source) {
    source = source.replace(/[\n|\n\r]/g, "<br>");
    //    source = source.replace("\r", "<br>");
    source = source.replace(/[\t]/g, "    ");
    return source
};

//判断文件是否为图片
function fw_isImage(image) {
    var fileTypeReg = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
    return fileTypeReg.test(image);
}

Date.prototype.dateAdd = function (interval, number) {
    var d = this;
    var k = { 'y': 'FullYear', 'q': 'Month', 'm': 'Month', 'w': 'Date', 'd': 'Date', 'h': 'Hours', 'n': 'Minutes', 's': 'Seconds', 'ms': 'MilliSeconds' };
    var n = { 'q': 3, 'w': 7 };
    eval('d.set' + k[interval] + '(d.get' + k[interval] + '()+' + ((n[interval] || 1) * number) + ')');
    return d;
}


cpec.business = function () {
    var getFileSourceFromAppId = function (appkey) {

        //var appObj = fw_Resource.appList[appid] || {};
        switch (appkey) {
            case 'app_report':
                return '周日报';
            case 'app_schedule':
                return '日程日历';
            case 'app_group':
                return '社区';
            case 'app_workflow':
                return '工作流';
            case 'app_task':
                return '任务';
            case 'app_vote':
                return '投票';
            case 'app_vmail':
                return '微邮';
            case 'app_notice':
                return '提醒';
            case 'app_contacts':
                return '联系人';
            case 'app_docment':
                return '知识库';
            case 'app_activity':
                return '业务活动';
            default:
                return '社区';
        }
    }

    return {
        getFileSourceFromAppId: getFileSourceFromAppId
    }
} ();




//localstore

(function (window, undefined) {
    //如果已经支持了，则不再处理
    if (window.localStorage)
        return;
    /*
     * IE系列
     */
    var userData = {
        //存储文件名（单文件小于128k，足够普通情况下使用了）
        file: window.location.hostname || "localStorage",
        //key'cache
        keyCache: "localStorageKeyCache",
        //keySplit
        keySplit: ",",
        // 定义userdata对象
        o: null,
        //初始化
        init: function () {
            if (!this.o) {
                try {
                    var box = document.body || document.getElementsByTagName("head")[0] || document.documentElement, o = document.createElement('input');
                    o.type = "hidden";
                    o.addBehavior("#default#userData");
                    box.appendChild(o);
                    //设置过期时间
                    var d = new Date();
                    d.setDate(d.getDate() + 365);
                    o.expires = d.toUTCString();
                    //保存操作对象
                    this.o = o;
                    //同步length属性
                    window.localStorage.length = this.cacheKey(0, 4);
                } catch (e) {
                    return false;
                }
            };
            return true;
        },
        //缓存key，不区分大小写（与标准不同）
        //action  1插入key 2删除key 3取key数组 4取key数组长度
        cacheKey: function (key, action) {
            if (!this.init()) return;
            var o = this.o;
            //加载keyCache
            o.load(this.keyCache);
            var str = o.getAttribute("keys") || "",
                list = str ? str.split(this.keySplit) : [],
                n = list.length, i = 0, isExist = false;
            //处理要求
            if (action === 3)
                return list;
            if (action === 4)
                return n;
            //将key转化为小写进行查找和存储
            key = key.toLowerCase();
            for (; i < n; i++) {
                if (list[i] === key) {
                    isExist = true;
                    if (action === 2) {
                        list.splice(i, 1);
                        n--; i--;
                    }
                }
            }
            if (action === 1 && !isExist)
                list.push(key);
            //存储
            o.setAttribute("keys", list.join(this.keySplit));
            o.save(this.keyCache);
        },
        //核心读写函数
        item: function (key, value) {
            if (this.init()) {
                var o = this.o;
                if (value !== undefined) { //写或者删
                    //保存key以便遍历和清除
                    this.cacheKey(key, value === null ? 2 : 1);
                    //load
                    o.load(this.file);
                    //保存数据
                    value === null ? o.removeAttribute(key) : o.setAttribute(key, value + "");
                    // 存储
                    o.save(this.file);
                } else { //读
                    o.load(this.file);
                    return o.getAttribute(key) || null;
                }
                return value;
            } else {
                return null;
            }
            return value;
        },
        clear: function () {
            if (this.init()) {
                var list = this.cacheKey(0, 3), n = list.length, i = 0;
                for (; i < n; i++)
                    this.item(list[i], null);
            }
        }
    };
    //扩展window对象，模拟原生localStorage输入输出
    window.localStorage = {
        setItem: function (key, value) { userData.item(key, value); this.length = userData.cacheKey(0, 4) },
        getItem: function (key) { return userData.item(key) },
        removeItem: function (key) { userData.item(key, null); this.length = userData.cacheKey(0, 4) },
        clear: function () { userData.clear(); this.length = userData.cacheKey(0, 4) },
        length: 0,
        key: function (i) { return userData.cacheKey(0, 3)[i]; },
        isVirtualObject: true
    };
})(window);