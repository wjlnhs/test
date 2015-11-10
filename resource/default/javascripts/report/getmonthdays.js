define(function (require, exports) {//获取统计列表每个月的起始时间
    var util=require('../common/util')
    exports.getMonthDays=function(year,month){
        var today=util.dateformat(new Date(),'yyyy-MM-dd');
        var datecount=new Date(year,month,0).getDate();//获取该月天数
        var _beginDay= 1; //初始化第一天
        var getbeginday=false; //标记获取到该月第一天
        var retjson={};//返回月份中的第一天和最后一天
        var retweeks={beginTime:[],endTime:[],weekport:[],week_name:['一','二','三','四','五','六']};//获取月份中每个礼拜的第一天和最后一天以及 初始化周报为未交
        var days=[];
        for(var i=1;i<=datecount;i++){
            var _datei=new Date(year,month-1,i);
            if(getbeginday==false){
                var day=_datei.getDay()||7;
                if(day==1){
                    _beginDay=i;//获取第一天
                }else{
                    _beginDay=2-day;
                    retweeks.beginTime.push(util.dateformat(new Date(year,month-1,_beginDay),'yyyy-MM-dd'));
                    retweeks.weekport.push(false);
                    for(var j=_beginDay;j<=0;j++){
                        var nowdate=new Date(year,month-1,j);
                        var _datetime=util.dateformat(nowdate,'yyyy-MM-dd');
                        days.push({datetime:_datetime,day:nowdate.getDay(),date:nowdate.getDate(),isprev:true,istoday:today==_datetime});
                    }
                }
                getbeginday=true;//修改为以获取到第一天
            }
            if(_datei.getDay()==1){
                retweeks.beginTime.push(util.dateformat(new Date(year,month-1,i),'yyyy-MM-dd'));//添加月份中的每周一
                retweeks.weekport.push(false);
            }else if(_datei.getDay()==0&&getbeginday==true){
                retweeks.endTime.push(util.dateformat(new Date(year,month-1,i),'yyyy-MM-dd'));//添加月份中的每周日

            }
            var nowdate=new Date(year,month-1,i);
            var _datetime=util.dateformat(nowdate,'yyyy-MM-dd');
            days.push({datetime:_datetime,day:nowdate.getDay(),date:i,istoday:today==_datetime});
        }
        retjson.beginTime=util.dateformat(new Date(year,month-1,_beginDay),'yyyy-MM-dd');//添加月份中最后一个周日
        var _leday=(datecount-_beginDay+1)%7;//下月余下的天数
        if(_leday==0){
            retjson.endTime=util.dateformat(new Date(year,month-1,datecount),'yyyy-MM-dd');
        }else{
            retjson.endTime=util.dateformat(new Date(year,month,6-_leday+1),'yyyy-MM-dd');
            retweeks.endTime.push(retjson.endTime);
            for(var j=1;j<8-_leday;j++){
                var nowdate=new Date(year,month,j);
                var _datetime=util.dateformat(nowdate,'yyyy-MM-dd');
                days.push({datetime:_datetime,day:nowdate.getDay(),date:j,isnext:true,istoday:today==_datetime});
            }
        }
        return {year:year,month:month,retjson:retjson,retweeks:retweeks,days:days};
    }

});