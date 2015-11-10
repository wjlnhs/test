define(function (require, exports) {
    var commentlist=require('../plugins/i8bloglist/i8comments');
    var score=require('./score.js');
    var util=require('../common/util');
    var i8ui=require('../common/i8ui');
    //公用ajax方法
    var common =require('./common');
    var dateoption = require('./getmonthdays.js');
    var weekname=['一','二','三','四','五','六'];
    var addweekport=require('./addweekport');
    //我的周日报
    var myReport=function(weekOptions){
        //report_load['#myreport']=true;

        //获取上周开始结束时间
        var getLastWeek=function(beginDay){
            var returnjson={}
            var beginarr=beginDay.split('-');
            var beginDay=new Date(beginarr[0],beginarr[1]-1,beginarr[2]);
            beginDay.setDate(beginDay.getDate()-1);
            returnjson.endTime=util.dateformat(beginDay,'yyyy-MM-dd');
            beginDay.setDate(beginDay.getDate()-6);
            returnjson.beginTime=util.dateformat(beginDay,'yyyy-MM-dd');
            return returnjson;
        }


        //获取我的周日报 本周工作目标
        var getWeekTarget=function(beginTime,endTime){
            var weektarget=$('#weekTarget');
            var returnjson=getLastWeek(beginTime);
            var _date={
                beginarr:beginTime.replace(/[-]0/g,'-').split('-'),
                endarr:endTime.replace(/[-]0/g,'-').split('-')
            }
            var target_tpl=require('../../template/report/weektarget.tpl');
            var render=template(target_tpl)
            var html=render({beginTime:_date.beginarr[1]+'月'+_date.beginarr[2]+'日',endTime:_date.endarr[1]+'月'+_date.endarr[2]+'日'});
            weektarget.html(html);
            common.ajax.getMyReportsByWeek({
                startDay:returnjson.beginTime,
                endDay:returnjson.endTime,
                rpType:1
            },function(data){
                if($.type(data)=='object'){
                    if(data.Result){
                        var arr=data.ReturnObject.length!=0?data.ReturnObject[0].NextPlan:[];
                        var html=render({beginTime:_date.beginarr[1]+'月'+_date.beginarr[2]+'日',endTime:_date.endarr[1]+'月'+_date.endarr[2]+'日',NextPlan:arr,addBeginTime:returnjson.beginTime,addEndTime:returnjson.endTime});
                        weektarget.html(html);
                    }else{
                        weektarget.html('<div class="tcenter">'+data.Description+'</div>');
                    }
                }else{
                    weektarget.html('<div class="tcenter">请求本周工作目标超时，请检查网络！</div>');
                }
            });
        }

        //获取我的周日报 本周周日报
        var getWeekReport=function(beginTime,endTime){
            var myreports=$('#myreports');
            myreports.html('<div class="ld-128-gray"></div>');
            common.ajax.getMyReportsByWeek({
                startDay:beginTime,
                endDay:endTime,
                rpType:2
            },function(data){
                var target_tpl=require('../../template/report/weekreport.tpl');
                var render=template(target_tpl);
                if($.type(data)=='object'){
                    if(data.Result){
                        myreports.html(render({list:data.ReturnObject,addBeginTime:beginTime,addEndTime:endTime}));
                        myreports.data('report',data.ReturnObject);
                    }else{
                        myreports.html('<div class="tcenter">'+data.Description+'</div>');
                    }
                }else{
                    myreports.html('<div class="tcenter">请求周日报超时，请检查网络！</div>');
                }
            });


        }

        //修改周是触发一下方法
        var changeWeek=function(beginTime,endTime){
            getWeekTarget(beginTime,endTime);
            getWeekReport(beginTime,endTime);
            score.getScore(beginTime,endTime,common.ajax.getMyReportsByWeek);
        }

        //初始化年月
        var setYearMonth = function () {
            var today=new Date();
            var dateYear = today.getFullYear();
            var dateMonth=today.getMonth()+1;
            $('#selectYear').append('<option value="' + dateYear + '">' + dateYear + '年</option><option value="' + (dateYear-1) + '">' + (dateYear-1) + '年</option>');
            $('#selectYear').setSelect({
                newi8select:'newi8-select',
                dropstyle: 'newselecti',
                ckedstyle: 'newselectcked'
            });
            $('#selectYear').setValue(dateYear);

            $('#selectMonth').setSelect({
                newi8select:'newi8-select',
                dropstyle: 'newselecti',
                ckedstyle: 'newselectcked'
            });
            $('#selectMonth').setValue(dateMonth);
            $('#selectMonth').find('.i8-sel-options').css('height','120px').mCustomScrollbar({//添加滚动条功能
                scrollButtons: {
                    enable: true
                },
                theme: "dark-thin"
            }).on('click','.mCSB_dragger_bar',function(){
                return false;
            });

            var selectYear=$('#selectYear');
            var selectMonth=$('#selectMonth');
            $('#selectYear ,#selectMonth').on('click','em',function(){
                var datejson=dateoption.getMonthDays(selectYear.getValue(),selectMonth.getValue());
                setWeeks(datejson);
                changeWeek(datejson.retweeks.beginTime[0],datejson.retweeks.endTime[0]);
            });

            var datejson=dateoption.getMonthDays(dateYear,dateMonth);
            setWeeks(datejson);
            //var _date=util.dateformat(new Date(),'yyyy-MM-dd');

            //changeWeek(datejson.retweeks.beginTime[0],datejson.retweeks.endTime[0]);
        };

        //获取周
        var setWeeks=function(datejson){
            var weeks=$('#weeks');
            var weekarr=[];
            for(var i=0;i<datejson.retweeks.beginTime.length;i++){
                weekarr.push('<a begintime="'+datejson.retweeks.beginTime[i]+'" endtime="'+datejson.retweeks.endTime[i]+'" index="'+i+'" class="week'+(i==0?' current':'')+'">第'+weekname[i]+'周</a>')
            }
            weeks.html(weekarr.join('')).off('click').on('click','a',function(){
                var _this=$(this);
                weeks.find('a').removeClass('current');
                _this.addClass('current');
                changeWeek(datejson.retweeks.beginTime[_this.attr('index')],datejson.retweeks.endTime[_this.attr('index')]);
            });
            weeks.find('a[begintime='+weekOptions.beginTime+']').trigger('click');
        }

        //刷新我的周日报
        var reloadReport=function(){
            $('#weeks').find('.week.current').trigger('click');
        }

        setYearMonth();

        var myreports=$('#myreports');

        //编辑周日报
        myreports.on('click','.editreport',function(){
            var reportdata=myreports.data('report');
            addweekport.openaddweekdaily({type:'edit',reportdata:reportdata[parseInt($(this).parent().attr('index'))]});
        });

        //删除周日报
        myreports.on('click','.deletereport',function(){
            var reportdata=myreports.data('report')[parseInt($(this).parent().attr('index'))];
            var rpTypeName=reportdata.RpType=='0'?'日报':'周报';
            i8ui.confirm({
                title:'确认要删除这条'+rpTypeName+'？删除时会将相应的评论也删除！'
            },function(){
                common.ajax.deleteReport(reportdata.ID,function(data){
                    if($.type(data)=='object'){
                        if(data.Result){
                            i8ui.alert({title:'删除成功！',type:2});
                            reloadReport();
                        }else{
                            i8ui.alert({title:'删除失败,'+data.Description+'！'});
                        }
                    }else{
                        i8ui.alert({title:'删除失败,删除周日报时请求超时！'});
                    }
                })
            });
        });
        //周日报评论
        myreports.on("click",'a.comment-report',function(){
            var reportdata=myreports.data('report')[parseInt($(this).parent().attr('index'))];
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
                        commentlist({aTag:_this,rKey:"app_report",defAtUsers:exDefUsr,cmtContainer:commentContainer,datalist:response.ReturnObject,appID:app_id,sourceID:source_id,cmtsendType:"appcomment",replyModel:"replykk",lsModel:"kankanls"});
                    }else{
                        alert('获取评论失败!<br/>'+response.Description);
                    }
                },"json");
            }
        })
    }

    exports.myReport=myReport;
});