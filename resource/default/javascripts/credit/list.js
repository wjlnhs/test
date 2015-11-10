define(function (require, exports,modules) {
    var i8ui=require('../../javascripts/common/i8ui');
    var commom=require('./common').common;
    var ajax=commom.ajax;//ajax方法
    var fw_page=require('../common/fw_pagination');
    var banklist=$('#banklist');
    var page=$('#page');

    var getBankList=function(pageIndex){
        banklist.html(template('banktemp',{loading:true}));
        var options={
            pageIndex:pageIndex||1,
            pageSize:5
        }
        ajax.getDataSuccess(options,function(data){
            console.log(data)
            banklist.html(template('banktemp',data));
            if($.type(data)=='object'&&data.Result){
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

            }
        },'getProductList');

    }
    getBankList();

});