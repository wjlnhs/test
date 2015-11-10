define(function (require, exports) {
    var dateoption = require('./getmonthdays.js');
    var day_temp=require('../../template/report/day.tpl');
    var util=require('../common/util');
    var day_render=template(day_temp);
    var nowdate=new Date().getTime();

    var extendDate=function(data,_date){
        _date.WeeklyStates=data.ReturnObject.WeeklyStates;
        var dayreportstates=data.ReturnObject.DailyStates;

        for(var i in _date.days){
            var days=_date.days[i];
            if((!days.isprev)&&(!days.isnext)&&!isNaN(dayreportstates[_date.days[i].date-1])){
                _date.days[i].dailystates=dayreportstates[_date.days[i].date-1];
            }else{
                _date.days[i].dailystates=-1;
            }
        }
        return _date;
    }

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

    //获取日历插件的html
    var getShareHtml=function(year,month,id,fun,uid){
        var _date=dateoption.getMonthDays(year,month+1);
        var dates=new Date(year,month);
        var yearMonth=util.dateformat(dates,'yyyy-MM-dd');
        var year=dates.getFullYear();
        var month=dates.getMonth()+1
        _date.year=year;
        _date.month=month;
        id.html(day_render({year:year,month:month}));
        var options={
            yearMonth:yearMonth
        }
        if(uid){
            options.passportID=uid;
        }
        fun(options,function(data){
            if($.type(data)=='object'){
                if(data.Result){
                    id.html(day_render(extendDate(data,_date)));
                }
                else{
                    if(data.Code==6002){
                        //$('#share_component').show();
                        id.html(day_render({noresult:true}));
                    }
                }
            }else{

            }

        });
    }

    exports.setshareDatePicker=function(id,fun,uid){
        var _date=new Date();
        //var yearMonth=util.dateformat(_date,'yyyy-MM-dd');
        var year=_date.getFullYear();
        var month=_date.getMonth();
        id.off('click','.ui-datepicker-prev,.ui-datepicker-next');
        getShareHtml(year,month,id,fun,uid)
        id.on('click','.ui-datepicker-prev,.ui-datepicker-next',function(){
            var _this=$(this);
            if(_this.hasClass('ui-datepicker-prev')){
                month--
            }else{
                month++;
            }
            getShareHtml(year,month,id,fun,uid)
        });
    }
});