define(function (require, exports) {
    var util=require('../common/util');
    var group=require('../ucenter/group');
    var setImg = require('../group/setimg.js');//上传背景插件
    var i8ui=require('../common/i8ui')
    var ajaxHost=i8_session.ajaxHost;
    var uid=util.getLastUrlName();// util.getUrlParam('uid');
    var urlparamMenutype=util.getUrlParam('menutype') || ''
    var kankanlist=require('../plugins/i8bloglist/i8blogs');//侃侃
    var groupload=false;
    var kkload=false;
    var home_menu=$('#home_menu');
    var currentmenu=home_menu.find('.current');
    var allcontent=$('.menu-content');
    $('#allloading').remove();
    home_menu.on('click','.ta-tt',function(){
        currentmenu.removeClass('current');
        currentmenu=$(this).addClass('current');
        allcontent.hide();
        var menutype=currentmenu.attr('menutype');

        $('#'+menutype).show();
        if(menutype=='group'&&!groupload){
            groupload=true;
            group.GetAllMyGroups(1,$('#group'));
        }
        if(!kkload){
            $('#dynamic').removeClass('hide');
            showKankan=kankanlist({container:"#blog_list",listType:"personal",tuid:uid,listHeader:false});
            $('[menutype='+urlparamMenutype+']').addClass('current');
            showKankan.init();
            kkload=true;
        }
    });
    $(function(){
        //侃侃展示（如果没有urlparamMenutype 就是没有指定初始化渲染哪个tab='?menutype=vacation'）
        if(!urlparamMenutype){
            showKankan=kankanlist({container:"#blog_list",listType:"personal",tuid:uid,listHeader:false});
            currentmenu=$('[menutype=dynamic]').addClass('current');
            $('#dynamic').removeClass('hide');
            showKankan.init();
            kkload=true;
        }else{
            //初始化渲染假期tab
            currentmenu.removeClass('current');
            currentmenu=$('[menutype='+urlparamMenutype+']').addClass('current');
            allcontent.hide();
            var menutype=currentmenu.attr(urlparamMenutype);
            $('#'+urlparamMenutype).show();
        }
    });
    $(document).on('click','.iscover',function(){
        $(this).toggleClass('checked')
        var _oldwidth=$('#js_img_yulan').width() >800 ? 800 : $('#js_img_yulan').width();
        if($('.iscover').hasClass('checked')){
            $('#js_img_yulan').attr('m_oldwidth',_oldwidth).width('100%')
        }else{
            var _oldwidth=$('#js_img_yulan').attr('m_oldwidth') >800 ? 800 : $('#js_img_yulan').attr('m_oldwidth');
            $('#js_img_yulan').width(_oldwidth);
        }
        $('#js_img_yulan').css('top','0px');
    })

    //上传背景图片按钮
    $('#uploadImg').on('click','div.uploadbg',function(){
        var personData=$('#person').data();
        var box=setImg.showBox({oldImg:personData.CoverImg},function(json){
            if(document.getElementById("js_set_img_type1").style.display == "none"){
                var m_top=parseInt($('#js_img_yulan').css('top'));
                if(m_top>0){
                    m_top=0;
                }
                var _top=parseInt(Math.abs(m_top/0.666666))
                var parm={
                    'thumbnail':'1200x',
                    'crop':'!1200xa0a'+_top,
                    'top':_top,
                    'm_top':m_top,
                    'm_width':parseInt($('#js_img_yulan').width()),
                    'm_oldwidth':$('#js_img_yulan').attr('m_oldwidth'),
                    'iscover':$('.iscover').hasClass('checked') ? true : false
                }
                if(!$('.iscover').hasClass('checked')){
                    parm.thumbnail='1200x>';
                }
                json.setImgUrl=json.setImgUrl.split('?')[0]+"?"+setImg.joinQiNiuParm(parm,'imageMogr2');
            }

            personData.CoverImg=json.setImgUrl;
            $.ajax({
                url:ajaxHost+'webajax/ucenter_ajax/updateCoverImg',
                data:{personData:personData},
                type:'get',
                dataType: 'json',
                success:function(data){
                    if(data.Result){
                        i8ui.alert({title:'保存成功',type:2});
                        $('.ta-home-bg').css('background-image','url('+json.setImgUrl+')')
                        //$('#pf_img').attr('src',json.setImgUrl);
                    }else{
                        i8ui.alert({title:'保存背景图失败,'+data.Description});
                    }
                },error:function(err1){
                    i8ui.alert({title:'保存背景图时请求超时,请检查网络！'});
                }
            });
            json.box.close();
        });
    })
});