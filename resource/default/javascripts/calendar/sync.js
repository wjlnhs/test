define(function (require, exports) {
    var qrcode=require('../common/qrcode');
    var common=require('./common');
    var i8ui=require('../../javascripts/common/i8ui');
    require('../common/jquery.zclip.min.js');

    var icsdomain=''//icsurl+'/';//ics文件域名
    var setUrl=function(url){
        qrcode.setCode($('#sync_code').empty()[0],{
            width:100,
            height:100,
            url:i8_session.resHost+'default/html/code.html#'+icsdomain+url
           // url:icsdomain+url
        });
        $('a#copyUrl').zclip({
            path:'default/swf/ZeroClipboard.swf',
            copy:function(){return icsdomain+url;},
            afterCopy:function(){
                i8ui.write('复制成功：'+icsdomain+url);
            }
        });
        $('#linkurl').attr('href',icsdomain+url);
    }

    var creatICS=function(){
        common.ajax.createICS(function(data){
            if($.type(data)=='object'&&data.Result){
                $('#beginSync').hide();
                $('#syncdetail').show();
                setUrl(data.ReturnObject);
                i8ui.write('生成成功！');
            }else{
                i8ui.error('生成失败，'+(data.Description||'请求超时！'));
            }
        });
    }
    exports.init=function(data,isLoad){

        if(isLoad){
            return;
        }
        $('#resendics,#beginSync').on('click',function(){
            creatICS();
        });
        if(!data||!data.ICS){
            $('#beginSync').show();
            return;
        }else{
            $('#syncdetail').show();
        }
        var url=data.ICS;
        setUrl(url);
    }
});