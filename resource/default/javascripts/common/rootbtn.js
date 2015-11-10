define(function (require, exports) {
    var i8ui=require('../common/i8ui');
    //管理员切换按钮
    var rootBtn=$('.rootbtn');
    var arrayHasItem=function(array,item){
        var result=false;
        if(Object.prototype.toString.call(array)!='[object Array]'){
            return false;
        }
        for(var i=0;i<array.length;i++){
            if(array[i].toString().toLocaleLowerCase()==item.toString().toLocaleLowerCase()){
                result=true;
            }
        }
        return result;
    }

    var setRootBtnUrl = function() {
        var utype=i8_session.utype;
        var appadmin=i8_session.appadmin;
        var baseHost=i8_session.baseHost;
        var wfbaseHost=i8_session.wfbaseHost;
        var _url=''+baseHost+'setcenter/corp-baseinfo';
        if(!(arrayHasItem(utype,'20') || arrayHasItem(utype,'4'))){
            _url=i8_session.baseHost+'introduction/baseset';
        }
        return _url;
    };

    i8ui.drag('.rootbtn',null,{
        imaxLeft:64,
        imaxT:'parent',
        upcbk:function(){
            $('.my-control').attr('_href',setRootBtnUrl())
            var _left=parseInt(rootBtn.css('left'));
            if(_left>32){
                rootBtn.animate({
                    left:64
                })
                if(!$(window).attr("onbeforeunload")){
                    $('body').fadeOut(300,function(){
                        window.location.href=$('.my-control').attr('_href');
                    })
                }else{
                    window.location.href=$('.my-control').attr('_href');
                    rootBtn.animate({
                        left:64
                    })
                }
            }else{
                rootBtn.animate({
                    left:0
                });
            }
        }
    });
    $('.my-control').on('click',function(){
        if($(this).find('.unrootbtn').length>0){
            return;
        }
        $('.my-control').attr('_href',setRootBtnUrl())
        rootBtn.animate({
            left:74
        })
        if(!$(window).attr("onbeforeunload")){
            $('body').fadeOut(300,function(){
                window.location.href=$('.my-control').attr('_href');
            })
        }else{
            window.location.href=$('.my-control').attr('_href');
            rootBtn.animate({
                left:74
            })
        }
    })
    rootBtn.on('click',function(ev){
        ev.stopPropagation();
    })
})