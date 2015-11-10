define(function (require, exports,modules) {
    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('../../javascripts/common/util');
    var ajax=require('./common').common.ajax;
    var page=$('#page');
    var $infobox=$('#infobox');
    var Today=new Date();
    var accNo=util.getLastUrlName();//交易账号
    /*build(remove.start)*/
    require('../plugins/i8scrollbar/mscrollbar.js');
    require('../plugins/i8scrollbar/css/mscrollbar.css');
    /*build(remove.end)*/

    //关闭页面
    $(document).on('click','#closeWindow',function(){
        window.open('','_parent','');
        window.close();
    })
    //获取企业信息
    var renderStatisticsQtr=function(year,type){
        var fn='getStatisticsQtr';//获取季试图
        if(type=='qtr'){//季视图
            $('#table2').hide();
            $('#table1').show();
            $('#table1').find('tbody').empty()
                .append(template('tblist1',{loading:true,TradeType:1}))
                .append(template('tblist1',{loading:true,TradeType:2}));
        }else{//月视图
            fn='getStatisticsMonth';//获取月视图
            $('#table1').hide();
            $('#table2').show();
            $('#table2').find('tbody').empty()
                .append(template('tbcenter_tp',{loading:true,TradeType:1}))
                .append(template('tbcenter_tp',{loading:true,TradeType:2}));
        }
        ajax.getDataSuccess({accNo:accNo,year:year},function(data){
            //$('.ld-64-write').remove();
            console.log(data)
            var inData={TradeType:2,rowspan:1}, outData={TradeType:1,rowspan:1};
            if($.isArray(data.ReturnObject)){
                inData.ReturnObject= _.filter(data.ReturnObject,function(item){
                    return item.TradeType==2;
                })
                inData.rowspan=inData.ReturnObject.length;
                if(inData.ReturnObject.length==0){
                    inData.ReturnObject=null;
                }
                outData.ReturnObject= _.filter(data.ReturnObject,function(item){
                    return item.TradeType==1;
                })
                outData.rowspan=outData.ReturnObject.length;
                if(outData.ReturnObject.length==0){
                    outData.ReturnObject=null;
                }
            }else{
                inData.ReturnObject=null;
                outData.ReturnObject=null;
            }

            if(type=='qtr'){//季视图
                $('#table1').find('tbody').empty()
                    .append(template('tblist1',inData))
                    .append(template('tblist1',outData));
            }else{//月视图
                $('#tbleft').find('tbody').empty()
                    .append(template('tbleft_tp',inData))
                    .append(template('tbleft_tp',outData));
                $('#tbcenter').find('tbody').empty()
                    .append(template('tbcenter_tp',inData))
                    .append(template('tbcenter_tp',outData));
                $('#tbright').find('tbody').empty()
                    .append(template('tbright_tp',inData))
                    .append(template('tbright_tp',outData));
            }
            //$infobox.prepend(template('tblist',data));
        },fn);
    }
    var init=function(){
        //初始化年份
        var years='';
        var nowYear=Today.getFullYear();
        for(var i=0;i<10;i++){
            var _val=nowYear-i;
            years+='<option value="'+_val+'">'+_val+'</option>'
        }
        $('#year').html(years).setSelect({
            newi8select:'newi8-select m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked',
            style:"width:180px;",
            cbk:function(dom){

            }
        })
        $('#year').find('.i8-sel-options').mCustomScrollbar({//添加滚动条功能
            theme: "dark-thin"
        });
        //
        $('.tbcenter-outbox').mCustomScrollbar({//添加滚动条功能
            theme: "dark-thin",
            advanced:{ updateOnContentResize:false },
            horizontalScroll:true
        });
//        $infobox.prepend(template('tblist',{loading:true}));
        renderStatisticsQtr(Today.getFullYear(),'qtr')
        $('[type=month]').on('click',function(){
            $('.a2').removeClass('selected');
            $('.a1').addClass('selected');
            renderStatisticsQtr($('#year').getValue(),'month')
        })
        $('[type=quarter]').on('click',function(){
            $('.a1').removeClass('selected');
            $('.a2').addClass('selected');
            renderStatisticsQtr($('#year').getValue(),'qtr')
        })
        //搜索
        $('#search').on('click',function(){
            if($('.a2').hasClass('selected')){
                renderStatisticsQtr($('#year').getValue(),'qtr')
            }else{
                renderStatisticsQtr($('#year').getValue(),'month')
            }

        })

    }
    init();


});