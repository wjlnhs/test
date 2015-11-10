define(function (require, exports,modules) {
    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('../../javascripts/common/util');
    var ajax=require('./common').common.ajax;
    var page=$('#page');
    var $infobox=$('#infobox');
    //获取企业信息
    var init=function(){
        $infobox.prepend(template('tblist',{loading:true}));
        ajax.getData({fundCode:FundCode},function(data){
            console.log(data)
            $('.ld-64-write').remove();
            if(data.Code){
                $infobox.prepend(data.Description);
            }else{
                $infobox.prepend(template('tblist',data));
            }

        },'getcompanyinfo');
    }
    init();
});