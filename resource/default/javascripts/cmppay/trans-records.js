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
    var startDate=$('#startDate').val(startval).setTime({
        maxDate:'#F{$dp.$D(\'endDate\')}'
    });
    var endDate=$('#endDate').val(endval).setTime({
        minDate:'#F{$dp.$D(\'startDate\')}'
    });
    template.helper('$transtime',function(time){
        return time.split(' ')[0];
    })
    template.helper('$setStatus',function(type,Status,ApplyNumber){
        var typeCNA='';
        var StatusCNA='';
        switch (type){
            case 0:
                typeCNA='申购';
                break;
            case 1:
                typeCNA='赎回';
                break;
            default:
                typeCNA='收益';
                break;
        }
        switch (Status){
            case 0:
                StatusCNA='申请中';
                break;
            case 1:
                StatusCNA=typeCNA+'成功';
                break;
            case 2:
                StatusCNA=typeCNA+'失败';
                break;
            case 3:
                StatusCNA='已撤销';
                break;
            case 4:
                StatusCNA='延时到帐';
                break;
            default:
                StatusCNA=typeCNA;
                break;
        }
        return StatusCNA;
    })

    var type=1;//0:申购 1.赎回:2收益
    var pageIndex=1;
    var search=$('#search').on('click',function(){
        if(type==1){//赎回
            getRecord(1,1);
        }else if(type==0){
            getRecord(1,0);
        }else{//收益
            getMyIncomeByDate();
        }

    })

    var changetype=$('#changetype').on('click','li',function(){
        pageIndex=1;
        changetype.find('li').removeClass('current');
        type=$(this).addClass('current').attr('type');
        search.trigger('click');
        //getRecord();
    })
    var getMyIncomeByDate=function(pageIndex){
        tbody.html(template('tblist',{loading:true}));
        page.empty();
        var options={
            pageIndex:pageIndex||1,
            pageSize:10,
            startDate:startDate.val(),
            endDate:endDate.val()
        }
        ajax.getData(options,function(data){
            if(!data.Result){
                tbody.html('<tr><td>'+data.Description+'</td></tr>');
                return;
            }
            tbody.html(template('tblist',data));
            fw_page.pagination({
                ctr: page,
                totalPageCount: data.Total,
                pageSize: 10,
                current: options.pageIndex,
                fun: function (new_current_page, containers) {
                    getMyIncomeByDate(new_current_page);
                }, jump: {
                    text: '跳转'
                }
            });
        },'getmyincomebydate');
    }

    var getRecord=function(pageIndex,type){
        tbody.html(template('tblist',{loading:true}));
        page.empty();
        var options={
            pageIndex:pageIndex||1,
            pageSize:10,
            startDate:startDate.val(),
            endDate:endDate.val(),
            type:type
        }
        ajax.getData(options,function(data){
            tbody.html(template('tblist',data));
            fw_page.pagination({
                ctr: page,
                totalPageCount: data.Total,
                pageSize: 10,
                current: options.pageIndex,
                fun: function (new_current_page, containers) {
                    getRecord(new_current_page,type);
                }, jump: {
                    text: '跳转'
                }
            });
        },'getmytradebydate');
    }

    var init=function(){
        //getRecord();
        getMyIncomeByDate();

    }
    init();
});