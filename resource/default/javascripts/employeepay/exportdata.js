define(function (require, exports,modules) {

    var i8reg=require('../../javascripts/common/i8reg');
    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('../../javascripts/common/util');
    var fw_page=require('../common/fw_pagination');
    var ajax=require('./ajax');
    var tbody=$('#tbody');
    var page=$('#page');

    var filelist=[];

    var date=new Date();
    var endval=util.dateformat(date,'yyyy-MM-dd')
    var startval=util.dateformat(new Date(date.getFullYear(),date.getMonth(),date.getDate()-7),'yyyy-MM-dd');
    var startTime=$('#startTime').val(startval).setTime({
        maxDate:'#F{$dp.$D(\'endTime\')}',
        onpicked:function(){
            setExoprtUrl();
        }
    });

    var endTime=$('#endTime').val(endval).setTime({
        minDate:'#F{$dp.$D(\'startTime\')}',
        onpicked:function(){
            setExoprtUrl();
        }
    });

    $('#filelist').find('a').each(function(i,item){
        var _item=$(item);
        filelist.push({
            elem:_item,
            link:_item.attr("href")
        })
    });



    var setExoprtUrl=function(){
        //startTime
        var param='&'+'starttime='+startTime.val()+'&'+'endtime='+endTime.val();
        for(var i=0;i<filelist.length;i++){
            var _item=filelist[i];
            _item.elem.attr('href',_item.link+param);
        }
    }



    var init=function(){
        //getCompanyApplyList();
        setExoprtUrl();
    }

    init();
});