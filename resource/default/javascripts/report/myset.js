define(function (require, exports) {
    var common =require('./common');
    var i8ui=require('../common/i8ui');
    var util=require('../common/util');
    var i8selector=require('../plugins/i8selector/fw_selector.js');
    var fw_page=require('../common/fw_pagination');
    var myset=require('../setrelation/set');



    var defaultpage=$('#defaultpage');
    defaultpage.on('click','.app-radio,.radio-label',function(){
        defaultpage.find('.app-radio').removeClass('checked');
        $(this).parent().find('.app-radio').addClass('checked');
    });

    //设置默认页
    $('#setdefaultpage').on('click',function(){
        common.ajax.saveReportSet(defaultpage.find('.app-radio.checked').attr('dtab'),function(data){
            if($.type(data)=='object'){
                if(data.Result){
                    i8ui.write('保存成功！');
                    defaultpage.find('.defaulttabtext').hide();
                    defaultpage.find('.app-radio.checked').parent().find('.defaulttabtext').show();
                }else{
                    i8ui.error('保存失败，'+data.Description);
                }
            }else{
                i8ui.error('保存失败，设置默认页是请求超时！');
            }
        });
    });

    exports.mySet=function(){
        myset.setRelation('App_Report','周日报',false,{
            "org": true, "user": true, "grp": false
        });
        updatetips('1dd14a67-9d36-4a74-850d-e26ebfc6cb85');
    }



});