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

    var banks={"904":"南京银行","920":"平安银行","921":"宁波银行","922":"北京银行","934":"邮储银行","938":"渤海银行","957":"东亚银行","002":"工商银行","005":"建设银行","003":"农业银行","007":"招商银行","004":"中国银行","006":"交通银行","009":"光大银行","010":"浦发银行","016":"广发银行","011":"兴业银行","014":"民生银行","015":"中信银行","012":"华夏银行"};
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
            accNo:$('#accno').getValue() || accNo,
            search:search
        }
        ajax.getDataSuccess(options,function(data){
            console.log(data)
            tbody.html(template('tblist',data));
            fw_page.pagination({
                ctr: page,
                totalPageCount: data.Total,
                pageSize: 10,
                accNo:accNo,
                current: options.pageIndex,
                fun: function (new_current_page, containers) {
                    getRecord(new_current_page,search);
                }, jump: {
                    text: '跳转'
                }
            });
        },'getDetail');
    }

    //注册自定义控件时间下拉菜单等
    var init=function($dielog){
        var startDate=$('#startDate1').setTime({
            maxDate:'#F{$dp.$D(\'endDate1\')}'
        });
        var endDate=$('#endDate1').setTime({
            minDate:'#F{$dp.$D(\'startDate1\')}'
        });
        $('.inorout').setSelect({
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

        //开户银行
        $('.bankofdeposit').setSelect({
            newi8select:'newi8-select m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked',
            style:"width:200px;",
            cbk:function(dom){
                setAccNoSel()
            }
        });
        $('.accno').setSelect({
            newi8select:'newi8-select m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked',
            style:"width:200px;",
            cbk:function(dom){

            }
        });

        //获取AccNo;
        accNoObj=_data.ReturnObject.AccNo;
        var bankarr=[];
        var cuBank='';//当前选择银行
        for(var i in accNoObj){
            bankarr.push(i);
            if(_.indexOf(accNoObj[i],accNo)!=-1){
                cuBank=i;
                break;
            }
        }
        for(var i=0;i<bankarr.length;i++){
            $('#bankofdeposit').find('.i8-sel-options').append('<em value="'+bankarr[i]+'">'+banks[bankarr[i]]+'</em>')
        }
        $('#bankofdeposit').setValue(cuBank);
        setAccNoSel()

        //<option value="002">工商银行</option>
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
                TradeType:$('#inorout').getValue(),
                Condition:$('#filter').getValue(),
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