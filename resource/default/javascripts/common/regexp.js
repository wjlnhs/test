/**
 * Created by chenshanlian on 2015/3/2.
 */
define(function () {
    var fw_overification = {
        passport: "^[a-zA-Z0-9_]{3,16}$",
        email: "^([a-zA-Z0-9_\\-\.])+@([a-zA-Z0-9_\-])+((\.[a-zA-Z0-9_\-]{2,10}){1,3})$",
        mobile: "^(0{0,1}1[3-9]{1}[0-9]{9})$",
        tel: "^([0-9]{3,4}-)*[0-9]{7,8}(-[0-9]{1,6})*$",
        username: "^[A-Za-z0-9\\u4e00-\\u9fa5_]{2,15}$",
        nametext: "^([A-Za-z0-9\\u4e00-\\u9fa5_]|[\(|\)|\[|\]|-|]|[（|）\.]| | ){2,15}$",
        password: "^[^ ]{8,20}$",
        contract: "(^0{0,1}1[0-9]{10}$)|(^([0-9]{3,4}-)[0-9]{7,8}(-[0-9]{1,6})*$)",
        num: "^[0-9]+$",
        text: "^\w*",
        groupname: "^[\\w\\u4e00-\\u9fa5]+[\\w\\u4e00-\\u9fa5\\s]*[\\w\\u4e00-\\u9fa5]+$",
        mobileortel: /(^1[0-9]{10}$)|(^([0-9]{3,4}-)*[0-9]{7,8}(-[0-9]{1,6})*$)/,
        all: /[`~!@#$%^&*_+<>{}\/'[\]]/,
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
        //姓名验证
        fnameTest: function(str){
            return fw_overification.ftest(str, fw_overification.username);
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
    return fw_overification;
});