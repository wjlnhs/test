define(function (require, exports) {
    var util=require('../common/util');
    var i8ui=require('../common/i8ui');
    var ajaxHost=i8_session.ajaxHost;
    var uid=util.getLastUrlName();//util.getUrlParam('uid');

    //var expend=$('<span class="expend-content-line hide" style="display:block;bottom: 15px;right: 5px"><a class="expend-switch es-close" style="display: inline;"><span>展开</span><i></i></a></span>');
    var no_resultstr='';
    var isSelf=uid==i8_session.uid;//判断查看的人是不是本人
    if(isSelf){
        $('#isMyLabel').html('我');
        no_resultstr='<div class="no-label-result" ><i class="no-resulticon no-label"></i><div class="no-label-desc"><span>一个标签都没有哦~</span><a target="_blank" href="'+i8_session.baseHost+'users/settings/info" class="btn-blue-h32">添加标签</a></div></div>'
    }else{
        no_resultstr='<div class="no-label-result" ><i class="no-resulticon no-label"></i><div class="no-label-desc"><span class="l-h90">一个标签都没有哦~</span></div></div>'
    }

    //获取绑定标签数据
    var getLabel=function(list){
        var _label=$('#label');
        _label.html('<div class="ld-32-write"></div>');
        if(labels==null){   //判断标签数据是否在缓存中，如果为空重新获取
            $.ajax({
                url:ajaxHost+'webajax/ucenter_ajax/label',
                data:{uid:uid},
                type:'get',
                dataType: 'json',
                success:function(data){
                    if(data.Result&&data.ReturnObject){
                        if(data.ReturnObject.Labels.length==0||!data.ReturnObject.Labels[0]){
                            _label.html(no_resultstr);
                            return;
                        }
                        var tpl=require('../../template/ucenter/label.tpl');
                        var render=template(tpl);
                        var html=render({labels: data.ReturnObject.Labels});
                        i8ui.expendUI(_label.html(html),{
                            max_height:116,
                            height:116
                        });

                    }else{
                        _label.html('<div class="bd-dashed tcenter mg10 m-t10 m-b10">'+data.Description+'</div>');
                    }
                },error:function(err1){
                    _label.html('获取标签时请求超时，请检查网络！')
                }
            });
        }else{
            if(labels.length==0||!labels[0]){
                _label.html(no_resultstr);
                return;
            }
            var tpl=require('../../template/ucenter/label.tpl');
            var render=template(tpl);
            var html=render({labels: labels});
            i8ui.expendUI(_label.html(html),{
                max_height:116,
                height:116
            });
        }

    }
    getLabel();
});