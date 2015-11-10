/*
*该文件逐步弃用，已整合到right-controls.js里
*/
define(function(require){
    var i8ui = require('../common/i8ui');
    if(i8_session.portal == null || i8_session.portal == ""){
        i8_session.portal = "managenovice,novice,calendar,taskrpt,members,birthday,topic,bbs";
        //管理员引导、新手引导、我的日程、我的任务、新员工风采、生日祝福、热门话题、i8社区
    }
    var mdSet = i8_session.portal || "";

    var $blockSetCont=$("#js_options_block");
    var setBlockDom = $("#js_block_set");

//    if((i8_session.utype.join(",")+",").indexOf("4,") >= 0){
//        $("#js_ismanger").show();
//    }

    function showBlockSetCont(cbk){
        var rtsize = $(document.body).outerWidth() - setBlockDom.offset().left -16;
        $blockSetCont.css({top: setBlockDom.offset().top, right: rtsize});
        $blockSetCont.show().stop().animate({
            'width':138
        },function(){
            $blockSetCont.removeClass('hide')
        })
    }
    function hideBlockSetCont(){
        $blockSetCont.stop().animate({
            'width':0
        },function(){
            $blockSetCont.addClass('hide').hide();
        })
        $("#js_block_set_list").height(0);
    }
    function ladingclick(){
        var contTimer=null;
        var contDom = $("#js_block_set");

        $("#js_home_rt_block .rt-block").hover(function(){
            clearTimeout(contTimer);
            var blockDoms = $("div.app-rt").find("div.show");

            var thisDom = $(this);
            if(blockDoms.index(thisDom) == 0){
                $("#js_block_setcont").find("span").removeClass("ban");
                $("#js_block_setcont").find('span.set-first,span.set-up').addClass("ban");
            }else if(blockDoms.index(thisDom) == (blockDoms.length - 1)){
                $("#js_block_setcont").find("span").removeClass("ban");
                $("#js_block_setcont").find('span.set-last,span.set-down').addClass("ban");
            }else{
                $("#js_block_setcont").find("span").removeClass("ban");
            }
            contDom.show().css({
                "opacity":1,
                "filter":"alpha(opacity=100)"
            });
            contDom.stop().animate({left: thisDom.offset().left + 251, top: thisDom.offset().top})
                .attr("showid",$(this).attr("id"));
            hideBlockSetCont();
        },function(){
            clearTimeout(contTimer)
            contTimer=setTimeout(function(){
                contDom.fadeOut();
                hideBlockSetCont();
            },1000)
            hideBlockSetCont();
        });
        $("#js_block_set,#js_options_block").mouseover(function(){
            clearTimeout(contTimer);
            $("#js_block_set").show();
        });
        $("#js_block_set,#js_options_block").mouseout(function(){
            clearTimeout(contTimer)
            contTimer=setTimeout(function(){
                $("#js_block_set").fadeOut();
                hideBlockSetCont();
            },1000)
        });
        $("#js_block_setcont").on('click','.set-show',function(){
            if(mdSet){
                $blockSetCont.find('div.block-set-op').each(function(){
                    var tname = $(this).attr("name");
                    if(mdSet.indexOf(tname)>=0){
                        $(this).removeClass("close");
                    }
                });
            }else{
                $("#js_block_setcont").find('div.block-set-op').removeClass("close");
            }
            if($blockSetCont.hasClass('hide')){
                showBlockSetCont();
            }else{
                hideBlockSetCont();
            }
        });
        //上移
        $("#js_block_setcont").on('click','span.set-up',function(){
            if($(this).attr("class").indexOf("ban")>=0){
                return;
            }
            if($(this).attr("class").indexOf("dbd") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var prevDom = thisDom.prev();
            var newDom = thisDom.clone(true);
            thisDom.remove();
            prevDom.before(newDom);
            $("#js_block_set").fadeOut();
            updatePortal();
        });
        //下移
        $("#js_block_setcont").on('click','span.set-down',function(){
            if($(this).attr("class").indexOf("ban") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var nextDom = thisDom.next();
            var newDom = thisDom.clone(true);
            thisDom.remove();
            nextDom.after(newDom);
            $("#js_block_set").fadeOut();
            updatePortal();
        });
        //移动到最上面
        $("#js_block_setcont").on('click','span.set-first',function(){
            if($(this).attr("class").indexOf("ban") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var newDom = thisDom.clone(true);
            thisDom.remove();
            $("div.app-rt").prepend(newDom);
            $("#js_block_set").fadeOut();
            updatePortal();
        });
        //最下移
        $("#js_block_setcont").on('click','span.set-last',function(){
            if($(this).attr("class").indexOf("ban") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var newDom = thisDom.clone(true);
            thisDom.remove();
            $("div.app-rt").append(newDom);
            $("#js_block_set").fadeOut();
            updatePortal();
        });
        //打开或关闭
        $blockSetCont.on('click','.block-set-op',function(){

            var this$ = $(this);
            if(setForm() >=4 && this$.attr("class").indexOf("close")<0){
                i8ui.alert({title:"亲，别在关闭了！",btnDom: this$});
                return;
            }
            var appOption = this$.attr("name");
            if(this$.attr("class").indexOf("close") >=0 ){
                this$.removeClass("close");
                mdSet += (','+ appOption);
            }else{
                this$.addClass("close");
                mdSet = mdSet.replace(appOption,"");
                $("#"+appOption).animate({height: 0},500,function(){
                    $("#"+appOption).remove();
                });
            }
//            $("#js_block_setcont").find("div.block-set-op").each(function(){
//                if($(this).attr("class").indexOf("close") < 0){
//                    newArrs.push($(this).attr("name"));
//                }
//            });
            upSet(mdSet);
        });
        $("#js_block_setbtn").click(function(){
            $("#js_block_set_list").height(178);
        });
    }
    function setForm(){
        return $("div.block-set-cont").find("div.close").length;
    }
    ladingclick();
    function updatePortal(callback){
        var mds = $('div.app-rt').find('div.rt-block');
        var caChearrs = mdSet.split(",");
        var newAddArrs = [];
        mds.each(function(i){
            var v = $(this).attr('id');
            if(mdSet.indexOf(v)>= 0){
                newAddArrs.push(v);
            }
        });
        var newAstring = newAddArrs.join(",");
        for(var i=0; i<caChearrs.length; i++){
            if(newAstring.indexOf(caChearrs[i]) < 0){
                newAstring += (","+caChearrs[i]);
            }
        }
        if(newAddArrs.length <= 0 ){
            i8ui.error("最少要留一个组件");
            return;
        }
        upSet(newAstring,callback);
    }
    function upSet(newAstring,callback){
        var arrs = newAstring.split(",");
        var bars = [];
        for(var i=0; i<arrs.length; i++){
            var barstr = bars.join(",");
            if(barstr.indexOf(arrs[i])<0){
                bars.push(arrs[i]);
            }
        }
        newAstring = bars.join(",");
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/update-set',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{portal: newAstring},
            success: function(result){
                if(result.Result){
                    i8ui.alert({title:"更新成功",type:2, btnDom: $("#js_block_setcont")});
                    mdSet = newAstring;
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
});