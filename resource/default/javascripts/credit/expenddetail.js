define(function (require, exports,modules) {
    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('../../javascripts/common/util');
    var ajax=require('./common').common.ajax;
    var fw_page=require('../common/fw_pagination');
    var page=$('#page');
    var tbody=$('#tbody');
    var date=new Date();
    var accNo=util.getLastUrlName();
    var accNoObj={};
    var endval=util.dateformat(date,'yyyy-MM-dd')
    var startval=util.dateformat(new Date(date.getFullYear(),date.getMonth(),date.getDate()-7),'yyyy-MM-dd');
    var $infobox=$('#infobox');
    var startDate=$('#startDate').val(startval).setTime({
        maxDate:'#F{$dp.$D(\'endDate\')}'
    });
    var endDate=$('#endDate').val(endval).setTime({
        minDate:'#F{$dp.$D(\'startDate\')}'
    });

    template.helper('$toFixed',function(num){
        return num.toFixed(2);
    })
    //关闭页面
    $(document).on('click','#closeWindow',function(){
        window.open('','_parent','');
        window.close();
    })


    var getRecord=function(pageIndex,search){
        tbody.html(template('tblist',{loading:true}));
        page.empty();
        var options={
            pageIndex:pageIndex||1,
            pageSize:10,
            search:search
        }
        ajax.getDataSuccess(options,function(data){
            console.log(data)
            if(data.ReturnObject && data.List){
                data.List.unshift(data.ReturnObject);
            }
            tbody.html(template('tblist',data));
            fw_page.pagination({
                ctr: page,
                totalPageCount: data.Total,
                pageSize: 10,
                search:search,
                current: options.pageIndex,
                fun: function (new_current_page, containers) {
                    getRecord(new_current_page,search);
                }, jump: {
                    text: '跳转'
                }
            });
        },'getExpendDetail');
    }

    //注册自定义控件时间下拉菜单等
    var init=function($dielog){
        var startDate=$('#startDate1').setTime({
            maxDate:'#F{$dp.$D(\'endDate1\')}'
        });
        var endDate=$('#endDate1').setTime({
            minDate:'#F{$dp.$D(\'startDate1\')}'
        });
        $('.expendtype').setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked',
            style:"width:180px;",
            cbk:function(dom){

            }
        });
        $('.filter').setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked',
            style:"width:180px;",
            cbk:function(dom){

            }
        });
        var setAccNoSel=function(){//设置银行
            $('#accno').find('.i8-sel-options').empty();
            var bankKey=$('#bankofdeposit').getValue()//选中的银行代号
            for(var i=0;i<accNoObj[bankKey].length;i++){//遍历当前银行的账号
                var _val=accNoObj[bankKey][i];
                $('#accno').find('.i8-sel-options').append('<em value="'+_val+'">'+_val+'</em>')
            }
            $('#accno').setValue(accNoObj[bankKey][0]);
            $('#accno').find('.newselectcked').attr('value',accNoObj[bankKey][0]).text(accNoObj[bankKey][0]);
        }

        getRecord();
        $('#search').on('click',function(){
            var Amount= $.trim($('#amount').val());
            var isNumeric=$.isNumeric(Amount);
            if(Amount && !isNumeric){
                i8ui.error('您输入的金额有误，请重新输入!')
                return false;
            }
            var search={
                StartDate:$('#startDate1').val(),
                EndDate:$('#endDate1').val(),
                TradeType:0,
                Condition:$('#filter').getValue(),
                Item:$('#expendtype').getValue(),
                Amount:Amount
            }
            getRecord(1,search);
        })
        $('#amount').on('keydown',function(ev){
            if(ev.keyCode==13){
                $('#search').trigger('click');
            }
        })
    }

    init();
});