define(function (require, exports) {
    var fw_overification = {
        passport: "^[a-zA-Z0-9_]{3,16}$",
        email: "^([a-zA-Z0-9_-|\.])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,3})$",
        mobile: "^(0{0,1}1[3-9]{1}[0-9]{9})$",
        tel: "^([0-9]{3,4}-)*[0-9]{7,8}(-[0-9]{1,6})*$",
        username: "^[A-Za-z0-9\u4e00-\u9fa5_\. ]{2,15}$",
        nametext: "^([A-Za-z0-9\\u4e00-\\u9fa5_]|[\(|\)|\[|\]|-|]|[（|）\.|\/]| | )*$",
        password: "^[^ ]{8,20}$",
        contract: "(^1[0-9]{10}$)|(^([0-9]{3,4}-)[0-9]{7,8}(-[0-9]{1,6})*$)",
        num: "^[0-9]*[1-9][0-9]*$",
        text: "^\w*",
        groupname: "^[\\w\\u4e00-\\u9fa5]+[\\w\\u4e00-\\u9fa5\\s]*[\\w\\u4e00-\\u9fa5]+$",
        mobileortel: /(^1[0-9]{10}$)|(^([0-9]{3,4}-)*[0-9]{7,8}(-[0-9]{1,6})*$)/,
        createNew: function (brbol) {
            var reg = {};
            reg.strmatch = /^\s+$/; //验证正则表达式
            reg.strfocus = "请输入";
            reg.strerror = "输入的内容不正确";
            reg.objlist = [];
            reg.arrmatch = {
                passport: fw_overification.passport,
                email: fw_overification.email,
                mobile: fw_overification.mobile,
                tel: fw_overification.tel,
                username: fw_overification.username,
                nametext: fw_overification.nametext,
                password: fw_overification.password,
                num: fw_overification.num,
                contract: this.contract,
                text: fw_overification.text,
                groupname: fw_overification.groupname,
                mobileortel: fw_overification.mobileortel
            };
            reg.results = {};
            //开始绑定
            reg.matching = function (jsonObj) {
                reg.fbegin(jsonObj);
                reg.fclickevent(jsonObj);
            };
            //验证初始化
            reg.fbegin = function (jsonObj) {
                reg.objinput = jsonObj.obj;
                for (var i = 0; i < jsonObj.obj.length; i++) {
                    var obj = $(jsonObj.obj[i]);
                    var _style = "";
                    if (brbol) {
                        _style = "style='position:relative; width:auto; line-height:25px;'";
                    } else {
                        _style = "style='margin-left:" + (obj.width() + 20) + "px; margin-top:-" + obj.outerHeight() + "px; line-height:" +
                            obj.outerHeight() + "px;*+margin-left:20px; *+margin-top:0px;'";
                    }
                    var shtml = "";
                    if (obj.data("options") == null)
                        return false;
                    if (obj.data("options").isNull != true) {
                        shtml = "<div>" + obj.parent().html() + "<div class='fw_form_fous fw_hidden' " + _style + ">" +
                            obj.data("options").strfocus + "</div></div>";
                    } else {
                        shtml = "<div>" + obj.parent().html() + "<div class='fw_form_fous fw_hidden' " + _style + ">" +
                            obj.data("options").strfocus + "</div></div>";
                    }
                    //为验证表单套一层容器
                    obj.parent().html(shtml);
                }
                //指定添加容器的样式
                //reg.objinput.parent().append("<div class='fous fw_hidden'>" + reg.strfocus + "</div>");
                reg.freturn(jsonObj.obj); //初始化验证结果

            }
            //样式函数
            reg.fstyleshow = function (obj, bol, message, isbr) {
                var hasvalue = obj.attr("id") && obj.val();
                var objID = [];
                var curValue = [];
                if (hasvalue) {
                    objID = obj.attr("id");
                    curValue = obj.val();
                }
                var init = obj.parent().attr("init");
                if (init !== 'true') {
                    var style = "style=' margin-top:-" + obj.height() + "px; line-height:" +
                        obj.height() + "px; *+margin-top:0px; font-size:12px;" + (bol ? "display:none;" : "") + "'";
                    if (isbr) {
                        style = "style=' margin-top:-" + obj.height() + "px; line-height:20px; *+margin-top:0px; font-size:12px; position:relative;" + (bol ? "display:none;" : "") + "'";
                    }

                    var shtml = "<div init='true'>" + obj.parent().html() + "<div class='fw_form_error' " + style + ">" + (bol ? "&nbsp;" : message) + "</div></div>";
                    //为验证表单套一层容器
                    obj.parent().html(shtml);
                }

                if (bol) {
                    obj.parent().find(".fw_form_error").text("");
                    obj.parent().find(".fw_form_error").hide();
                }
                else {
                    obj.parent().find(".fw_form_error").text(message);
                    obj.parent().find(".fw_form_error").show();
                }

                if (hasvalue) {
                    $("#" + objID).val(curValue);
                }
            };
            //初始化验证结果默认验证失败 并将验证对象放入验证列表
            reg.freturn = function (objlist) {
                for (var i = 0; i < objlist.length; i++) {
                    var bol = false;
                    if ($(objlist[i]).data("options").isNull) {
                        bol = true;
                    }
                    if ($(objlist[i]) && $(objlist[i]).attr("id") != "" && $(objlist[i]).attr("id") != null) {
                        reg.objlist.push($(objlist[i]));
                        reg.results[$(objlist[i]).attr("id")] = bol//{ "id": $(objlist[i]).attr("id"), "$object": $(objlist[i]), "bol": bol };
                    }
                }
            };
            //绑定事件
            reg.fclickevent = function (jsonObj) {
                //绑定获得焦点事件
                jsonObj.obj.live("focus", function () {
                    if (brbol) {
                        //return false;
                    } else {
                        var options = $(this).data("options");
                        if (!options) {
                            return;
                        }
                        $(this).css({ "border-color": " " });
                        $(this).next("div").attr("class", "fw_form_fous").html(options.strfocus);
                        $(this).next("div").show();
                    }
                });
                //失去焦点事件
                jsonObj.obj.live("blur", function () {
                    var objthis = $(this);
                    reg.fVerification(objthis); //调用验证函数
                });
            };
            //验证函数
            reg.fVerification = function (objthis,focus) {
                var options = objthis.data("options");
                var str = $.trim($("#" + objthis.attr("id")).val());
                $("#" + objthis.attr("id")).val(str);
                objthis.css({ "border-color": "#E2E5E7" });
                //如果为空并且允许为空
                if (/^\s+$/.test(str) | str == "" | str == null) {
                    if (options && options.isNull && options.isNull == true) {
                        if (typeof window[options.callback] === "function") {
                            window[options.callback](objthis); //执行回调函数
                            //                        if (window[options.callback](objthis)) {
                            //                            reg.callback_end(objthis, true);
                            //                        } else {
                            //                            reg.callback_end(objthis, false);
                            //                        }
                        } else {
                            reg.callback_end(objthis, true);
                        }
                    }
                    else {
                        reg.callback_end(objthis, false);
                    }
                }
                //反之匹配验证
                else {
                    //判断最大长度
                    if (options.maxLength) {
                        if (str.length > options.maxLength) {
                            reg.failure(objthis); //长度超出
                            return false;
                        }
                    }
                    //判断最小长度
                    if (options.minLength) {
                        if (str.length < options.minLength) {
                            reg.failure(objthis); //长度太短
                            return false;
                        }
                    }
                    var strmatch = RegExp(options.strmatch); //获取正则表达式
                    if (reg.arrmatch[options.strmatch] != null) {//判断是否属于通用库
                        strmatch = RegExp(reg.arrmatch[options.strmatch]);
                    }
                    if (fw_overification.ftest(str, strmatch)) {
                        if (typeof window[options.callback] === "function") {
                            window[options.callback](objthis); //执行回调函数
                            //                        if (window[options.callback](objthis)) {
                            //                            reg.callback_end(objthis, true);
                            //                        } else {
                            //                            reg.callback_end(objthis, false);
                            //                        }
                        } else {
                            reg.callback_end(objthis, true);
                        }
                    } else {
                        if(focus){
                            reg.failure(objthis,null,true); //验证不通过添加focus
                        }else{
                            reg.failure(objthis); //验证不通过
                        }

                    }
                }
            };
            //验证失败后执行操作
            reg.failure = function (obj, message,focus) {
                //判断参数是否为空
                if (obj) {
                    var options = obj.data("options");
                    var _$obj = $("#" + obj.attr("id"));
                    if (options == null) {
                        _$obj.next("div").attr("class", "fw_form_error").html("输入错误请重新输入").show();
                    } else {
                        _$obj.next("div").attr("class", "fw_form_error").html(message || options.strerror).show();
                    }
                    _$obj.css("border-color", "red");
                    if(focus){
                        _$obj.focus();
                        _$obj.blur();
                    }
                    reg.results[obj.attr("id")] = false; //记录验证未通过
                }
            }
            //回调验证结束操作
            reg.callback_end = function (obj, bol, message) {
                if (bol == true) {
                    obj.next("div").attr("class", "fw_form_error").html(" ").hide(); ;
                    reg.results[obj.attr("id")] = true; //记录通过
                } else {
                    reg.failure(obj, message);
                    //                obj.next("div").attr("class", "error").html(message|obj.data("options").strerror);
                    //                reg.results[obj.attr("id")] = false; //记录验证未通过
                }
            };
            //返回是否通过验证
            reg.result = function () {
                //首先进行所有验证
                for (var _rt_obj in reg.objlist) {
                    reg.fVerification($(reg.objlist[_rt_obj]),true);
                }
                //在返回验证结果
                for (var i in reg.results) {
                    if (i != "undefined") {
                        if (reg.results[i] == false) {
                            return false;
                            break;
                        }
                    }
                }
                return true;
            };
            return reg;
        },
        //邮箱验证
        femailTest: function (str) {
            return fw_overification.ftest(str, fw_overification.email);
        },
        //手机验证
        fmobileTest: function (str) {
            //var strmatch = /^0?\\d{11}$/;
            return fw_overification.ftest(str, fw_overification.mobile);
        },
        //非空验证
        fNullTest: function (str) {
            var strmatch = /^[\s|\S]+$/;
            return fw_overification.ftest(str, strmatch);
        },
        //纯数字验证
        fDigitalTest: function (str) {
            var strmatch = /^[0-9]+$/;
            return fw_overification.ftest(str, strmatch);
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
    exports.fw_overification=fw_overification;
})
