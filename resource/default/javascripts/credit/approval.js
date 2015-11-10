define(function (require, exports,modules) {

    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('../../javascripts/common/util');
    var ajax=require('./common').common.ajax;
    var fw_page=require('../common/fw_pagination');
    var page=$('#page');
    var tbody=$('#tbody');
    var date=new Date();
    var endval=util.dateformat(date,'yyyy-MM-dd')
    var startval=util.dateformat(new Date(date.getFullYear(),date.getMonth(),date.getDate()-7),'yyyy-MM-dd');



    template.helper('$setTime',function(time){
        time=time.replace(/-/g,'/');
        return new Date(time).format('yyyy年M月d日');
    })

    var changetype=$('#changetype').on('click','li',function(){
        changetype.find('li').removeClass('current');
        type=$(this).addClass('current').attr('type');
        getRecord();
    })

    var getRecord=function(pageIndex){
        tbody.html(template('tblist',{loading:true}));
        page.empty();
        var options={
            pageIndex:pageIndex||1,
            pageSize:10,
            key:FundCode,
            type:2
        }
        ajax.getDataSuccess(options,function(data){
            console.log(data)
            tbody.html(template('tblist',data));
            if($.isNumeric(data.Total)){
                $('.total').html(data.Total);
            }else{
                $('.total').html(0);
            }

            fw_page.pagination({
                ctr: page,
                totalPageCount: data.Total,
                pageSize: 10,
                key:FundCode,
                type:2,
                current: options.pageIndex,
                fun: function (new_current_page, containers) {
                    getRecord(new_current_page);
                }, jump: {
                    text: '跳转'
                }
            });
        },'getApprovalList');
    }

    var init=function(){
        getRecord();
    }
    init();
});