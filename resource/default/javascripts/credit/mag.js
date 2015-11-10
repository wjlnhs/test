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


    template.helper('$setTime',function(time){
        time=time.replace(/-/g,'/');
        return new Date(time).format('yyyy-MM-dd');
    })

    template.helper('$setAccNo',function(AccNo){
        var _AccNo=0;
        for(var i in AccNo){
            _AccNo=AccNo[i][0]
        }
        return _AccNo;
    })



    var getRecord=function(pageIndex){
        tbody.html(template('tblist',{loading:true}));
        page.empty();
        var options={
            pageIndex:pageIndex||1,
            pageSize:10,
            key:FundCode,
            searchCName: $.trim($('#searchname').val())
        }
        ajax.getDataSuccess(options,function(data){
            console.log(data)
            tbody.html(template('tblist',data));
            fw_page.pagination({
                ctr: page,
                totalPageCount: data.Total,
                pageSize: 10,
                key:FundCode,
                current: options.pageIndex,
                searchCName: $.trim($('#searchname').val()),
                fun: function (new_current_page, containers) {
                    getRecord(new_current_page);
                }, jump: {
                    text: '跳转'
                }
            });
        },'getManageList');
    }

    //页面事件注册
    var init=function(){
        getRecord();
        $('#searchnamebtn').on('click',function(){
            getRecord();
        })
        $('#searchname').on('keydown',function(ev){
            if(ev.keyCode==13){
                getRecord();
            }
        })
    }
    init();
});