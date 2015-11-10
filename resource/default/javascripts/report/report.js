define(function (require, exports) {
    var dateoption = require('./getmonthdays.js');
    var i8ui=require('../common/i8ui');
    var util=require('../common/util');
    var i8selector=require('../plugins/i8selector/fw_selector.js');
    var seefile=require('../common/seefile');
    /*build(remove.start)*/
    require('../plugins/i8scrollbar/mscrollbar.js');
    require('../plugins/i8scrollbar/css/mscrollbar.css');
    /*build(remove.end)*/
    var getdatepicker=require('./getdatepicker.js')
    var weekname=['一','二','三','四','五','六']
    var ajaxHost = i8_session.ajaxHost;
    var resHost=i8_session.resHost;
    var resbaseHost=i8_session.baseHost;
    var score=require('./score.js');
    var addport=require('./addweekport');

    var report_load={//是否初次加载
        '#myreport':false,
        '#sharereport':false,
        '#reportset':false
    }

    //本周的起止日期和当前时间
    var getweekOptions=function(){
        var options={};
        var date=new Date();
        options.nowTime=util.dateformat(date,'yyyy-MM-dd');
        var day=(date.getDay()||7)-1;
        options.beginTime=util.dateformat(new Date(date.getFullYear(),date.getMonth(),date.getDate()-day),'yyyy-MM-dd');
        options.endTime=util.dateformat(new Date(date.getFullYear(),date.getMonth(),date.getDate()+6-day),'yyyy-MM-dd');
        return options;
    }
    //公用ajax方法
    var common =require('./common');

    var myReport=require('./myreport').myReport;


    //共享给我的
    var myShare=require('./myshare').myShare;

    //我的设置
    var mySet=require('./myset').mySet;


    var report_panel=$('.report-panel');
    var nav_item=$('.nav-item');
    var app_left=$('#app_left');
    var app_right=$('#app_right');
    var yesterday=$('#yesterday');
    var share_component=$('#share_component');
    var component=$('#component');
    var _score=$('#score');
    var jsonTitle={
        '#myreport':'我的周日报',
        '#sharereport':'分享给我的',
        '#reportset':'设置'
    }

    //hashchange事件
    var setHash=function(menutype){
        switch(menutype){
            case '#myreport':
                app_right.show();
                _score.show();
                yesterday.hide();
                app_left.removeClass('report-set');
                share_component.hide();
                component.show();
                getdatepicker.setshareDatePicker($('#datepicker'),common.ajax.getMyReportsByMonth);//周日报统计插件
                if(report_load[menutype]==false){
                    myReport(getweekOptions());
                    report_load[menutype]=true;
                };break;
            case '#sharereport':
                app_right.show();
                _score.hide();
                yesterday.show();
                app_left.removeClass('report-set');
                share_component.show();
                component.hide();
                myShare();
                break;
            case '#reportset':
                app_right.hide();
                app_left.addClass('report-set');
                mySet();
                break;
        }
        report_panel.hide();
        nav_item.removeClass('current');
        $('#dailynav').find('.nav-item[menutype='+menutype+']').addClass('current');
        $(menutype+'panel').show();
        document.title=jsonTitle[menutype];
    }

    //注册hash事件
    $(window).on('hashchange',function(){
        setHash(window.location.hash);
    });

    //点击按钮事件
    $('#dailynav').on('click','.nav-item',function(){
        var _this=$(this);
        if(_this.attr('menutype')){
            window.location.hash=$(this).attr('menutype');
        }
    });

    //调用hashchange事件
    setHash(window.location.hash);

    //格式化时间
    template.helper('getReportDate',function(startTime,endTime,rpType,reportID){
        var _startTime=new Date(startTime);
        var _endTime=new Date(endTime);
        if(_startTime=='Invalid Date'||isNaN(_startTime)){
            _startTime= new Date(startTime.replace(/-/g,'/'));
        }
        if(_endTime=='Invalid Date'||isNaN(_endTime)){
            _endTime= new Date(endTime.replace(/-/g,'/'));
        }
        if(rpType==0){
            return '<a target="_blank" href="'+resbaseHost+'report/detail/'+reportID+'">'+_startTime.getFullYear()+'年'+(_startTime.getMonth()+1)+'月'+_startTime.getDate()+'日'+' 日报</a>';
        }else{
            return '<a target="_blank" href="'+resbaseHost+'report/detail/'+reportID+'">'+_startTime.getFullYear()+'年'+(_startTime.getMonth()+1)+'月'+_startTime.getDate()+'日-'+_endTime.getFullYear()+'年'+(_endTime.getMonth()+1)+'月'+_endTime.getDate()+'日'+' 周报</a>';
        }
    });

    //格式化时间
    template.helper('getLastUpdateTime',function(date){
        return util.formateDate(date);
    });

    //判断是否已阅
    template.helper('isRead',function(userArr){
        return userArr.join(';').search(i8_session.uid)>=0;
    });

    //格式化时间
    template.helper('dateformat',function(datetime,format){
        return util.dateformat(datetime,format);
    });

    //格式化附件列表
    template.helper('getAtt',function(attachmentsArr){
        var html=seefile.ks.getHtml(attachmentsArr,null,null);
        seefile.ks.bindImgClick($(document),true);
        return html;
    })

    //新增周日报按钮
    $('#addweekdaily').on('click',function(e){
        var options=getweekOptions();

        addport.openaddweekdaily(options);
    });



    //添加洲日报按钮
    $(document).on('click','.adddaily',function(e){
        var options=getweekOptions();
        var _this=$(this);
        var beginTime=_this.attr('begintime');
        var endTime=_this.attr('endtime');
        if(beginTime&&endTime){
            options.beginTime=beginTime;
            options.endTime=endTime;
        }
        options.rptype= _this.attr('rptype')||0;
        addport.openaddweekdaily(options);
    });



    var sharereport=$('#sharereports');
    var commentlist=require('../plugins/i8bloglist/i8comments');
    //标记为已阅
    sharereport.on('click','.readit',function(){
        var reportdata = sharereport.data('report');
        var _this=$(this);
        var reportID = reportdata[_this.attr('index')].ID;
        common.fun.readreport(_this,reportID);
    });
    //评论
    sharereport.on("click",".comment-report",function(){
        var reportdata=sharereport.data('report')[parseInt($(this).parent().attr('index'))];
        var exDefUsr=[];
        var person={"uid":reportdata.UserID,"uname":"@"+reportdata.AuthorName,type:0};
        exDefUsr.push(person);
        var app_id="568d9564-09e0-40e6-945b-db2bd86854dd";
        var fatherCell=$(this).parents("div.weekcontent"),_this=this;
        if($(this).hasClass("showed")){
            fatherCell.find("div.right-comment").toggle(250,function(){
                $(this).removeClass("showed");
            })
        }else{
            var source_id=$(this).attr("optid");
            var commentData=[];
            var commentContainer=fatherCell.find("div.w-content-right");
            $.get(i8_session.ajaxHost+'webajax/kkcom/get-appscomments',{sourceid:source_id,appid:app_id,r:Math.random().toString()},function(response){
                if(response.Result){
                    commentlist({aTag:_this,rKey:"app_report",cmtContainer:commentContainer,datalist:response.ReturnObject,appID:app_id,defAtUsers:exDefUsr,sourceID:source_id,cmtsendType:"appcomment",replyModel:"replykk",lsModel:"kankanls"});
                }else{
                    alert('获取评论失败!<br/>'+response.Description);
                }
            },"json");
        }
    })

});