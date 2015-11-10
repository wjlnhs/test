/**
 * 周日报统计
 */
define(function (require, exports,module) {
    var _staticsTemplate=require('../i8wdstatistics/template/statics-template.tpl');
    var _people=require('../i8wdstatistics/template/statics-people.tpl');
    var _content=require('../i8wdstatistics/template/statics-content.tpl');
    require('../i8wdstatistics/css/i8wdstatistics.css');
    var dateoption = require('../../report/getmonthdays.js');
    var reportcommon=require('../../report/common.js');
    var ajaxHost = i8_session.ajaxHost;
    var util=require('../../common/util.js')
    var _staticsrender=template(_staticsTemplate);
    var _peoplerender=template(_people);
    var _contentrender=template(_content);
    var s_left,s_right,selectMonth,toleft,toright,load_data,see_more,no_result;
    var weeks=['一','二','三','四','五','六'];
    var nowdate=new Date().getTime();
    template.helper('isLagerThenToday',function(year,month,date,isprev,isnext){
        if(isprev){
            month--;
        }
        if(isnext){
            month++;
        }
        var _date=new Date(year,month-1,date+1).getTime();
        return nowdate>_date;
    })
    var getReportStat=function(getdates,_this,callback){
        var yearMonth=util.dateformat(new Date(_this.options.year,_this.options.month-1),'yyyy-MM-dd')
        var data_people=$('#data_people');
        var data_body=$('#data_body');
        load_data=$('#load_data').show();
        reportcommon.ajax.getReportStat({yearMonth:yearMonth,pageIndex:_this.options.pageIndex,pageSize:_this.options.pageSize},function(data){
            if($.type(data)=='object'){
                if(data.Result){
                    if(data.ReturnObject.totalCount==0){
                        data_people.empty();
                        data_body.empty();
                        no_result.show();
                        callback();
                        return;
                    }
                    var _peoplehtml=_peoplerender(data);
                    var _contenthtml=_contentrender(extendData(getdates,data));

                    data_people.append(_peoplehtml);
                    data_body.append(_contenthtml);
                    if(data.ReturnObject.totalCount<=_this.options.pageIndex*_this.options.pageSize){
                        see_more.hide();
                    }else{
                        see_more.show();
                    }
                    callback();
                }else{

                }
            }else{

            }
        });
    }

    template.helper('getWeekStatus',function(WeeklyStatInfos,Index){
        var _index=parseInt(Index/7);
        return WeeklyStatInfos[_index];
    })
    template.helper('getUrl',function(rid){
        return i8_session.baseHost+'report/detail/'+rid;
    })
    template.helper('getWeekDaily',function(DailyStates,dIndex){
        return DailyStates.slice(dIndex,7);
    })

    //转化数据
    var extendData=function(getdates,data){
        var items=data.ReturnObject.Items;
        data.year=getdates.year;
        data.month=getdates.month;
        for(var i=0;i<items.length;i++){
            var dailystates=items[i].DailyStates;
            var days=$.map( getdates.days, function(obj){
                return $.extend(true,{},obj);//返回对象的深拷贝
            });
            for(var j=0;j<days.length;j++){
                if((!days[j].isprev)&&(!days[j].isnext)&&!isNaN(dailystates[days[j].date-1])){
                    days[j].dailystates=dailystates[days[j].date-1];

                }else{
                    days[j].dailystates=-1;
                }
            }
            items[i].days=days;
        }
        return data;
    }


    function Wstatistics(elem,options){
        this.options=options;
        this.elem=elem;
    }
    Wstatistics.prototype={
        init:function(){
            var getdates=this.getDay();
            $('#exportstat').attr('href',ajaxHost+'webajax/report_ajax/stasexport?yearMonth='+util.dateformat(new Date(this.options.year,this.options.month-1),'yyyy-MM-dd'));
            this.options.pageIndex=1;
            this.weekcount=getdates.days.length/7;
            var html=_staticsrender({year:this.options.year,month:this.options.month,getdates:getdates});
            $(this.elem).html(html);

            this.setHeight();
            this.setWidth(getdates);
            var _this=this;
            no_result=$('#no_result').hide();
            see_more=$('#see_more').off('click').on('click',function(){
                _this.options.pageIndex++;
                getReportStat(getdates,_this,function(){
                    _this.setHeight();
                    load_data.hide();
                });
            });

            selectMonth=$('#selectMonth').on('click',function(e){
                _this.chooseMonth(e);
            });
            var _this=this;
            getReportStat(getdates,this,function(){
                _this.setHeight();
                load_data.hide();
            });
        },
        setHeight:function(){ //设置右边高度和左边高度相等
            s_left=$('#s_left');
            s_right=$('#s_right').css('height',s_left.height()+'px');
        }
        ,setWidth:function(getdates){
            this.width=getdates.days.length*35+1;
            if(this.weekcount==4){
                //this.width=this.width+1;
            }
            s_right.find('.day-panel').css({'width':this.width+'px','left':'0px'});
            var _this=this;
            toleft=$('#toleft').on('click',function(){
                _this.scollDayPanel('left');
            });
            toright=$('#toright').on('click',function(){
                _this.scollDayPanel('right');
            });
            if(getdates.days.length>28){
                toright.show();
            }
        }
        ,getDay:function(){ //获取该年月下的日期
            return dateoption.getMonthDays(this.options.year,this.options.month);
        }
        ,chooseMonth:function(e){
            if(e.target.className=='prev-month'){
                this.getYearMonth(-1);
                var ws=new Wstatistics(this.elem,this.options);
                ws.init();
            }else if(e.target.className=='next-month'){
                this.getYearMonth(1);
                var ws=new Wstatistics(this.elem,this.options);
                ws.init();
            }
        },getYearMonth:function(porm){
            var new_date=new Date(this.options.year,this.options.month+porm);
            this.options.month=new_date.getMonth()||12;
            this.options.year=new_date.getFullYear();
            if(this.options.month==12){
                this.options.year=this.options.year-1;
            }
        }
        ,scollDayPanel:function(dur){
            if(dur=='left'){
                s_right.find('.day-panel').animate({'left':'0px'});
                toleft.hide();
                toright.show();
            }else{
                var _left=s_right.width()-this.width+1+'px';
                s_right.find('.day-panel').animate({'left':_left});
                toleft.show();
                toright.hide();
            }
        }
    }

    exports.wstatistics=function(elem,options){
        return new Wstatistics(elem,options);
    };
})