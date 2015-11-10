define(function (require, exports,modules) {

    var i8ui=require('../../javascripts/common/i8ui');
    var ajax=require('./ajax');
    var util=require('../common/util');
    var page=$('#page');
    var tbody=$('#tbody');
    var count=$('#count');
    var app_mapsite=$('#app_mapsite');
    var type=util.getUrlParam('type');
    app_mapsite.on('click','a',function(){
        app_mapsite.find('a').removeClass('current');
        var _type=$(this).addClass('current').attr('type');
        getReview(_type,1);
    })

    var getReview=function(type,pageIndex){
        tbody.html(template('tblist',{loading:true}));
        if(type==1){
            $('#status').hide();
        }else{
            $('#status').show();
        }
        page.empty();
        ajax.getData({
            pageIndex:pageIndex||1,
            pageSize:10,
            type:type
        },function(data){
            if(data.Result){
                if(type==1){
                    count.html('<span class="blue">'+data.Total+'</span> 条申请待审核')
                }else{
                    count.html('<span class="blue">'+data.Total+'</span> 条申请已审核')
                }
            }
            tbody.html(template('tblist',data));
        },'getapprovallist')
    }


    var init=function(){
        app_mapsite.find('a[type='+(type||1)+']').trigger('click');
    }
    init();
});