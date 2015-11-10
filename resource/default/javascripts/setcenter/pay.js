/**
 * Created by kusion on 2015/4/16.
 */
define(function(require){
    var util=require('../common/util');
    var i8ui=require('../common/i8ui');
    $(function(){
        $("#txt-payvalue").blur(function(){
            var moneyValue=$(this).val();
            if(!$.isNumeric(moneyValue)){
                alert('充值金额请输入纯数字!');
            }
        });

        $("#btn_pay").click(function(){
            var moneyValue=$("#txt-payvalue").val();
            if($.isNumeric(moneyValue)){
                var boxer=i8ui.showNoTitle({"title":"登录支付宝充值","cont":'<div class="msgcon-txt">请在新打开的支付宝页面输入相当口令进行充值！</div><div class="btns-lne"><button class="yellow94x32" id="btn_paycompleted">充值完成</button>　<button class="yellow94x32 btn-disenable" id="btn_payfaild">充值失败</button></div>'})
                $("#btn_paycompleted").click(function(){
                    boxer.close();
                    window.location.reload();
                });
                $("#btn_payfaild").click(function(){
                    boxer.close();
                });
                $.ajax({async:false,type:"post",data:{money:moneyValue},dataType:"json",url:i8_session.ajaxHost+"webajax/appcom/authmoney",
                    success:function(res){
                        if(res.Result){
                            var code=res.ReturnObject.authCode;
                            var url=location.protocol+"//"+window.location.host+i8_session.baseHost+'apps/com/pay/'+code+'/toi8';
                            var a = document.createElement("a");
                            a.setAttribute("href", url);
                            a.setAttribute("target", "_blank");
                            a.setAttribute("id", "openwin");
                            document.body.appendChild(a);
                            a.click();
                        }
                    }
                })
            }
        })
    });
})