define(function (require, exports,modules) {

    var i8reg=require('../../javascripts/common/i8reg');
    var i8ui=require('../../javascripts/common/i8ui');
    var fw_page=require('../common/fw_pagination');
    var ajax=require('./ajax');
    var tbody=$('#tbody');
    var page=$('#page');

    var getCompanyApplyList=function(pageIndex){
        tbody.html(template('tblist',{loading:true}));
        page.empty();
        var options={
            pageIndex:pageIndex||1
        }
        ajax.getData(options,function(data){
            if($.type(data)=='object'&&data.Result){
                tbody.html(template('tblist',data));
                if(data.ReturnObject){
                    $('#newApply').show();
                }
                fw_page.pagination({
                    ctr: page,
                    totalPageCount: data.Total,
                    pageSize: 10,
                    current: options.pageIndex,
                    fun: function (new_current_page, containers) {

                    }, jump: {
                        text: '跳转'
                    }
                });
            }else{
                tbody.html(template('tblist',{Description:data.Description||'网络异常，请重试'}));
            }
        },'getcompanyapplylist');
    }

    var init=function(){
        getCompanyApplyList();
    }

    init();
});