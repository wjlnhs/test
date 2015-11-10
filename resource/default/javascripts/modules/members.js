/**
 *该文件逐步弃用，已整合到right-controls.js里
 */
define(function(require, exports){
    var pubjs = require('./public.js');
    var i8ui = require('../common/i8ui.js');
    var i8city = require("../plugins/i8city/i8city.js");
    function getMembers(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/members',
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {topn: 10},
            success: function(result){
                if(result.Result){
                    var countNum = result.List ?  result.List.length : 0;
                    var datas = result.List || [];
                    showPageCont.size = 0;
                    if(countNum > 0){
                        $("#members").addClass("show");
                    }
                    if(countNum > 2){
                        $("#js_members_page").show();
                        var prevBtn = $("#js_members_prev");
                        var nextBtn = $("#js_members_next")
                        //上一页
                        prevBtn.click(function(){
                            if(prevBtn.attr("class").indexOf('disabled')>=0){
                                return;
                            }
                            showPageCont.size = showPageCont.size - 2;
                            nextBtn.removeClass('disabled');
                            if(showPageCont.size <= 0){
                                prevBtn.addClass('disabled');
                            }else{
                                prevBtn.removeClass('disabled');
                            }
                            showPageCont(datas);
                        });
                        //下一页
                        nextBtn.click(function(){
                            if(nextBtn.attr("class").indexOf('disabled')>=0){
                                return;
                            }
                            showPageCont.size = showPageCont.size + 2;
                            prevBtn.removeClass('disabled');
                            if(showPageCont.size < countNum - 2){
                                nextBtn.removeClass('disabled');
                            }else{
                                nextBtn.addClass('disabled');
                            }
                            showPageCont(datas);
                        });
                    }
                    showPageCont(datas);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function getInfohtml(item){
        var rtHtml = '';
        if(item.BirthLocation && item.BirthLocation !=""){
            rtHtml += '<p><i class="spbg1 sprite-55"><b></b></i> 籍贯 '+ i8city.getCityByCode(item.BirthLocation) +'</p>';
        }
        if(item.Birthday){
            rtHtml += '<p><i class="spbg1 sprite-56"><b></b></i> 星座 '+ pubjs.getXingZuo(item.Birthday) +'</p>';
        }
        if(item.Labels.length > 0){
            rtHtml += '<p><i class="spbg1 sprite-57"></i> 爱好 '+ item.Labels.join('、') +'</p>';
        }
        if(item.Comment){
            rtHtml += '<p>我：'+ item.Comment +'</p>';
        }
        if(rtHtml == ""){
            if(item.ID == i8_session.uid){
                rtHtml = '<div class="tcenter"><a href="users/settings/info">立即完善信息！</a></div>'
            }else{
                rtHtml = '这个人很懒~<a class="members-at-ta" uid="'+ item.ID +'" uname="'+ item.Name +'">邀请TA尽快完善吧！</a>'
            }
        }
        return  rtHtml;
    }
    function getTimestring(timestr){
        if(timestr){
            var newstr = timestr.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
            return newstr[0].replace("-","年").replace("-","月") + "日";
        }
    }
    function getBirthday(timestr){
        if(timestr){
            var newstr = timestr.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
            return newstr[0].replace("-","年").substring(0,5);
        }else{
            return '';
        }
    };
    function showPageCont(datas){
        var mdHtml = $('#js-members-tpl').html();
        var listHtml = '';
        for( var i = showPageCont.size; i < showPageCont.size + 2; i++){
            var _item = datas[i];
            if(_item){
                listHtml += mdHtml.replace('{name}', _item.Name)
                    .replace('{headimg}', _item.HeadImage? _item.HeadImage:"")
                    .replace(/{ID}/g, _item.ID)
                    .replace('{datetime}', getTimestring(_item.CreateTime))
                    .replace('{orgname}',_item.OrgName)
                    .replace('{perinfo}',getInfohtml(_item));
            }
            console.log();
        }
        if(datas.length <= 0){
            $("#js-members-list").html('<div class="fz14-weight tcenter p10 cl999"><span class="icon icon-no-members"></span>最近都没有新同事哦~</div>');
            return;
        }
        $('#js-members-list').html(listHtml);
    }
    getMembers();
    $("#members").on("click","a.members-at-ta",function(){
        var $this = $(this);
        var uname = $this.attr("uname");
        var uid = $this.attr("uid");
        $.post(i8_session.ajaxHost+'webajax/kkcom/postblog',{scopeType:2,kankanContent:'$%$'+ uname +','+ uid +',0$%$麻烦您尽快完善个人信息，比如籍贯、个人标签、出生日期O(∩_∩)O！'},function(response){
            if(response.Result){
                i8ui.simpleWrite("邀请发送成功！", $this);
                $this.removeClass("members-at-ta").css({"color":"#999","cursor":"default"});
            }else{
                i8ui.simpleAlert(response.Description, $this);
            }
        },"json");
    });

});