define(function (require, exports) {
    var myset=require('../setrelation/set');
    var getRoom=require('./room').getRoom;
    var sync=require('./sync.js')
    var getcalendarview=require('./calendar');
    var common=require('./common');
    var addcalendar=require('./addcalendar');
    var hashtab=$('.hashtab');
    var nav_item=$('#navitems').find('.nav-item');
    var util=require('../common/util');

    if(!window.location.hash){
        window.location.hash='#mycalendarview';
    }

    var isLoad={
        '#mycalendarview':false,
        '#room':false,
        '#sharemeview':false,
        '#myset':false,
        '#mysync':false
    }
    var titleJson={
        '#mycalendarview':'我的日程',
        '#room':'会议室查询',
        '#sharemeview':'查看同事的日程',
        '#myset':'共享设置',
        '#mysync':'同步日程'
    }

    var getScheduleSet=function(){
        common.ajax.getScheduleSet(function(data){
            if($.type(data)=='object'&&data.Result){
                homeLoad(data.ReturnObject);
            }
        });
    }

    //初始化加载
    var homeLoad=function(data){

        var setHash=function(_menu){
            var _menu=_menu;
            if(_menu=='#sharemeview'&&(!_data||!_data.Result||!_data.ReturnObject||_data.ReturnObject.length==0)){
                window.location.hash='#mycalendarview';
                return;
            }
            hashtab.hide();
            nav_item.removeClass('active');
            $('#navitems').find('.nav-item[type='+_menu+']').addClass('active');
            $(_menu+'_panel').show();
            switch (_menu){
                case '#mycalendarview':getcalendarview.init(data,isLoad[_menu],'');updatetips('cea589f4-809b-46d2-8d22-6907f3ada027');break;
                case '#sharemeview':getcalendarview.init(data,isLoad[_menu],'_share');updatetips('cea589f4-809b-46d2-8d22-6907f3ada027');break;
                case '#room':getRoom(isLoad[_menu]);break;
                case '#myset': myset.setRelation('App_Schedule','日程',true,{
                    "org": true, "user": true, "grp": true
                });
                    updatetips('0ed1d644-6062-499f-9cba-98edb7f14db6');//更新日程分享请求tips
                    break;
                case '#mysync':sync.init(data,isLoad[_menu]);break;
            }
            document.title = titleJson[_menu];
            isLoad[_menu]=true;
        }

        //注册hash事件
        $(window).on('hashchange',function(){
            setHash(window.location.hash);
        });

        $(function(){
            setHash(window.location.hash);
        });
    }

    getScheduleSet();



    $('#addSchedule').on('click',function(){
        var _date=new Date();
        var _h=_date.getHours();
        var _m=_date.getMinutes();
        if(_m>30){
            _h++;
            _m=0;
        }else{
            _m=30;
        }
        addcalendar.openWindow({
            title:'新建日程/会议',
            data:{
                addDate:util.dateformat(_date,'yyyy-MM-dd'),
                addStartTime:util.dateformat(new Date('2014','1','1',_h,_m),'hh:mm'),
                addEndTime:util.dateformat(new Date('2014','1','1',_h+1,_m),'hh:mm'),
                Type:1
            }},function(){
            $('#refreshBtn').trigger('click');
        });
    });
    //清空tips消息
});