/**
 * Created by jialin on 2014/12/11.
 */
define(function (require, exports,module) {
    var i8ui=require('./i8ui');
    function checkIsEmpty(str) {
        return $.trim(str)!="";
    }
    function checkMail(str) {
        var re  = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
        return re.test(str);
    }
    function checkQQ(str){
        var  re=/^\d{5,14}$/;
        return re.test(str);
    }
    function checkPostalCode(str){
        var  re=/^[1-9]\d{5}$/;
        return re.test(str);
    }
    function checkMobile(str){
        var  re=/0?(13|14|15|18|17)[0-9]{9}/;
        return re.test(str);
    }
    function checkCID(str){
        var  re=/^\d{17}[\d|x]$|^\d{15}$/;
        return re.test(str);
    }
    function checkUname(str){
        var  re=/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/;
        return re.test(str);
    }
    function checktrueName(str){
        var  re=/^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        return re.test(str);
    }
    function checkDate(str){
        var  re=/^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}$/;
        return re.test(str);
    }

    function checkPhone(str){
        var  re=/[0-9-()（）]{7,18}/;
        return re.test(str);
    }

    function checkPsw(str){
        var re=/^[^ ]{8,20}$/;
        return re.test(str);
    }
    function checksixPsw(str){
        var re=/^\d{6}$/;
        return re.test(str);
    }
    function checkZXKH(str){
        var re=/^(6217)\d{12}$/;
        return re.test(str);
    }


    function checkYzm(str){
        var re=/^[a-zA-Z0-9_]{6}$/;
        return re.test(str);
    }

    function checkNum(str){
        str= $.trim(str);
        var re=/^\d+$/;
        return re.test(str);
    }
    function isEmptySelector($input){
        var $this=$input;
        var result=true;
        var selector=$this.parents('.fw_ksninput').eq(0);
        if($(selector).find('em').length==0){
            result= false;
        }
        return result;

    }

    function checkAll(parent,input){
        var through=true;
        console.log($(parent).find('[i8formtype]'))
        $(parent).find('[i8formtype]').each(function(){
            var $this=$(this);
            var _value= $.trim($this.val());
            var _attr=$this.attr('i8formtype').split(':');
            var _type=_attr[0];
            var _desc=_attr[1];
            if($this.attr('isSelector') ? !isEmptySelector($this) : !_value){
                if($this.attr('isnotrequire')){
                    through=true;
                }else{
                    $this.focus();
                    i8ui.simpleAlert('请输入'+_desc,$this);
                    through=false;
                }
            }else{
                switch (_type){
                    case 'mail':
                        if(!checkMail(_value)){
                            _desc=_desc || '邮箱';
                            i8ui.simpleAlert(_desc+'的格式不正确，请重新输入!',$this);
                            $this.focus();
                            through=false;
                        }
                        break;
                    case 'phone':
                        if(!checkPhone(_value)){
                            _desc=_desc || '座机';
                            i8ui.simpleAlert(_desc+'的格式不正确，请重新输入!',$this);
                            $this.focus();
                            through=false;
                        }
                        break;
                    case 'date':
                        if(!checkDate(_value)){
                            _desc=_desc || '日期';
                            i8ui.simpleAlert(_desc+'的格式不正确，请重新输入!',$this);
                            //$this.focus();
                            through=false;
                        }
                        break;
                    case 'mobile':
                        if(!checkMobile(_value)){
                            _desc=_desc || '手机';
                            i8ui.simpleAlert(_desc+'的格式不正确，请重新输入!',$this);
                            $this.focus();
                            through=false;
                        }
                        break;
                    case 'required':
                        if(($this).attr('isSelector')){
                            var selector=$this.parents('.fw_ksninput').eq(0);
                            if($(selector).find('em').length==0){
                                i8ui.simpleAlert(_desc+'不能为空',$this);
                                $this.focus();
                                through=false;
                            }
                        }else{
                            if(!checkIsEmpty(_value)){
                                i8ui.simpleAlert(_desc+'不能为空',$this);
                                //不是时间
                                if(!$this.hasClass('date-bg')){
                                    $this.focus();
                                }
                                through=false;
                            }
                        }

                        break;
                    case 'psw':
                        if(!checkPsw(_value)){
                            _desc=_desc ||'';
                            i8ui.simpleAlert(_desc+'密码由8~20个字符组成，区分大小写且不能有空格',$this);
                            $this.focus();
                            through=false;
                        }
                        break;
                    case 'sixpsw':
                        if(!checksixPsw(_value)){
                            _desc=_desc ||'';
                            i8ui.simpleAlert(_desc+'由6个数字组成，不能有空格',$this);
                            $this.focus();
                            through=false;
                        }
                        break;
                    case 'zxkh':
                        if(!checkZXKH(_value.replace(/[ ]/g,''))){
                            _desc=_desc ||'中信银行卡号';
                            i8ui.simpleAlert('请输入正确的'+_desc,$this);
                            $this.focus();
                            through=false;
                        }
                        break;
                    case 'pcode':
                        if(!checkPostalCode(_value)){
                            _desc=_desc ||'';
                            i8ui.simpleAlert(_desc+'由6位数字组成，不能有空格',$this);
                            $this.focus();
                            through=false;
                        }
                        break;
                    case 'num':
                        if(!checkNum(_value)){
                            _desc=_desc ||'';
                            i8ui.simpleAlert(_desc+'内容必须为数字',$this);
                            $this.focus();
                            through=false;
                        }
                        break;

                }
            }

            if(!through){
                return false;
            }
        })
        return through;
    }
    module.exports={
        checkIsEmpty:checkIsEmpty,
        checkIsPostalCode:checkPostalCode,
        checkMail:checkMail,
        checkDate:checkDate,
        checkPhone:checkPhone,
        checkMobile:checkMobile,
        checkQQ:checkQQ,
        checkCID:checkCID,
        checkUname:checkUname,
        checktrueName:checktrueName,
        checkPsw:checkPsw,
        checksixPsw:checksixPsw,
        checkYzm:checkYzm,
        checkAll:checkAll,
        checkZXKH:checkZXKH
    }
})