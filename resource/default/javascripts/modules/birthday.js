define(function(require, exports){
    var i8ui = require('default/javascripts/common/i8ui');
    var pubjs = require('default/javascripts/modules/public.js');
    //获取生日列表
    function getBirthdayList(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/birthday?',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{fn:'getlist',topn:10},
            success: function(result){
                if(result.Result){
                    $("#js_birthday_ld_div").hide();
                    $("#js_birthday_cont").show();
                    var countNum = result.List? result.List.length : 0;
                    var datas =result.List || [];
                    if(countNum > 0){
                        $("#birthday").show();
                    }
                    $("#js_birthday_num").html(countNum);
                    showPageCont.size = 0;
                    if(countNum > 2){
                        $("#js_birthday_page").show();
                        var prevBtn = $("#js_birthday_prev");
                        var nextBtn = $("#js_birthday_next");
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
                            showBirthPageCont(datas);
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
                            showBirthPageCont(datas);
                        });
                    }
                    showBirthPageCont(datas);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function getBirthdayDate(birthday){
        if(birthday){
            var dtime = new Date(birthday.replace(/-/g,"/"));
            var month = dtime.getMonth() + 1;
            var day = dtime.getDate();
            return (month < 10 ? "0" + month : month) + '.' + (day < 10 ? '0' + day : day);
        }else{
            return '';
        }
    }
    function showBirthPageCont(datas){
        var mdHtml = $('#js_birthday_tpl').html();
        var listHtml = '';
        var uids = [];
        for( var i = showPageCont.size; i < showPageCont.size + 2; i++){
            var _item = datas[i];
            if(_item){
                listHtml += mdHtml.replace(/\{name\}/g, _item.Name)
                    .replace('{headimg}', _item.HeadImage)
                    .replace(/\{birthday\}/g, getBirthdayDate(_item.Birthday))
                    .replace(/\{bid\}/g, _item.ID)
                    .replace("{btime}",_item.Birthday)
                    .replace('{imgs}',getZhufuimgs(_item.Pleasure))
                    .replace('{xingzuo}',pubjs.getXingZuo(_item.Birthday));
                uids.push(_item.ID);
            }
        }
        if(datas.length <= 0){
            $("#js_birthday_cont").html('<div class="fz14-weight tcenter p10 cl999"><span class="icon icon-no-birthday"></span>最近都没有人过生日哦~</div>');
            return;
        }
        $('#js_birthdays').html(listHtml);
        if(uids.length>0){
            getListParam(uids);
        }
    }
    //获取生日祝福列表
    function getListParam(ids){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/getzan?',
            type: 'get',
            dataType: 'json',
            data:{uids: ids},
            success: function(result){
                if(result.Result){
                    var Items = result.ReturnObject;
                    if(Items.length <= 0){
                        return;
                    }
                    $("#js_birthdays").find("span.zhu-fu").each(function(){
                        var btnDom = $(this);
                        var zanDom = btnDom.nextAll('div.rt-birthday-persons');
                        var zanNames = zanDom.find("label");
                        var bid = btnDom.attr("bid");
                        for(var i=0; i<Items.length; i++){
                            if(bid == Items[i].ID){
                                var zanHtml = Items[i].SendUserNames.join(" ");
                                zanNames.html(zanHtml);
                                if(zanHtml.indexOf(i8_session.uname)>=0){
                                    btnDom.addClass("disabled");
                                }
                                zanDom.show();
                            }
                        }
                    });
                    //zanNames.append(' '+ cpec_si8_session);
                    //zanDom.show();
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    //生日快乐
    $("#js_birthdays").on("click","span.zhu-fu",function(){
        var $this = $(this);
        var zanDom = $this.nextAll('div.rt-birthday-persons');
        var zanNames = zanDom.find("label");
        var bid = $this.attr("bid");
        var btime = $this.attr("btime");
        var names = zanNames.html();
        if(names.indexOf(i8_session.uname)>=0){
            return;
        }
        $(this).addClass("disabled");
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/zan?',
            type: 'get',
            dataType: 'json',
            data:{bid: bid, btime: btime},
            success: function(result){
                if(result.Result){
                    zanNames.prepend(i8_session.uname+' ');
                    zanDom.show();
                }else{
                    i8ui.alert({title: result.Description, btnDom: $this});
                }
            },
            error: function(e1,e2,e3){
            }
        });
    });
    //赠送礼物

    var gifBox = null;
    $("#js_birthdays").on("click","span.send-gift",function(){
        var to_name=$(this).attr("to-name");
        var to_id=$(this).attr("to-id");
        if(gifBox){
            gifBox.close();
        }
        gifBox = i8ui.showbox({
            title:'送TA礼物',
            noMask: true,
            cont: '<div class="send-gift-boxer" id="send-gift-box"></div>'
        });
        var giftDom = $(gifBox);
        giftDom.css({top: $(this).offset().top, left: $(this).offset().left - 580});
        var blogPoster=require('../plugins/i8poster/js/i8poster');
        var postBloger=blogPoster({
            container:"#send-gift-box",
            enableHeader:false,
            header:{kankan:true,schedule:false,daily:false},
            kkConfig:{attachment:false,gift:true,face:true,topic:true,scope:false,defalultScope:2,attachid:"btn_attachment",attaContainer:"upContainer",attabtnContainer:"btn_attachment_container",kid:"ksn_gift",kkplaceholder:"送礼物想说点什么...",faceitem:"",appid:"460fdf91-952d-4bef-b3d7-51e975c3045e"},//appid,生日礼物
            postCompleted:function(data) {
                i8ui.write('礼物已发送成功！');
                gifBox.close();
            }
        });
        postBloger.init();
        postBloger.defAddTxt2Box("@"+to_name+" #祝"+to_name+"生日快乐#");
        postBloger.addUser2Cache({uid:to_id,uname:"@"+to_name,type:0,type:0});
        $(".kk-sub",giftDom).removeClass("post-btn-disabled");//默认开启发布按钮
    });
    function getZhufuimgs(imgs){
        var classhide = 'hide';
        if(imgs && imgs.length > 0){
            classhide = '';
        }else{
            imgs = [];
        }
        var imghtml = '<div class="rt-birthday-persons '+ classhide +'"><i class="spbg1 sprite-53 lt"></i><label></label><span class="rt-linj">◆<span>◆</span></span>';
        for(var i=0; i< imgs.length; i++){
            imghtml += '<img src="'+ imgs[i] +'">';
        }
        imghtml += '</div>';
        return imghtml;
    }
    getBirthdayList();
});