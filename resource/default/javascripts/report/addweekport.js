define(function (require, exports) {
    var i8ui=require('../common/i8ui');
    var i8selector=require('../plugins/i8selector/fw_selector.js');

    var util=require('../common/util');
    require('../../stylesheets/weekdaily.css');
    require('../common/jquery.autosize.min.js');

    var selectEnum=['user','grp','org'];//0 用户，1群组，2部门

    //report公用方法
    var common =require('./common');
    //打开新增周日报层
    exports.openaddweekdaily=function(options){

        //根据日期获取日期所在周
        var getWeekByDay=function(y,m,d){
            var date=new Date(y,m,d);
            var year=date.getFullYear();
            var month=date.getMonth();
            var day=date.getDay()||7;
            var date=date.getDate();
            return {
                beginDate:util.dateformat(new Date(year,month,date-day+1),'yyyy-MM-dd'),
                endDate:util.dateformat(new Date(year,month,date-day+7),'yyyy-MM-dd')
            }
        }

        //获取上期计划
        var getprevplan=function(beginTime,rptype,callback){
            var options={};
            var arrdate=beginTime.split('-');
            var date=new Date(arrdate[0],arrdate[1]-1,arrdate[2]);
            var day=(date.getDay()||7)-1;
            options.rpType=rptype;
            options.startDay=util.dateformat(date,'yyyy-MM-dd');
            common.ajax.getPrePlan(options,function(data){
                callback(data);
            })
        }

        var addcont=require('../../template/report/addreport.tpl');
        var addcont_render=template(addcont);
        options.rptype=options.rptype||0;
        var accont_html=addcont_render(options);
        var _title=options.type=='edit'?'编辑周日报':'新建周日报';
        var showbox;
        if(options.elem){
            showbox=$(accont_html);
            options.elem.html(showbox);
        }else{
            showbox=$(i8ui.showbox({
                title:_title,
                cont:accont_html
            }));
        }

        showbox.find('textarea').autosize();//({width:options.width+2||698});

        //获取上期计划按钮
        showbox.on('click','.getprevplan',function(){
            getprevplan(startTime.val(),showbox.find('.app-radio.checked').attr('rpType'),function(data){
                if(data.Result){
                    if(data.ReturnObject){
                        var summarize=data.ReturnObject.NextPlan;
                        $('.summarize').parents('.weekdaily-line').remove();
                        var nextplan=$('.nextplan').eq(0).parents('.weekdaily-line');
                        for(var i= 0,len=summarize.length;i<len;i++){
                            var _summar=$(_summarize);
                            if(i==0){
                                _summar.find('.weekdaily-line-title').html('本期总结');
                            }else{

                            }
                            _summar.find('.app_clear_txt_btn').show();
                            _summar.find('textarea').val(summarize[i])
                            nextplan.before(_summar);
                        }
                        var _summar=$(_summarize);
                        _summar.find('textarea').autosize().on('input propertychange',function(){
                                textChange($(this));
                        });
                        nextplan.before(_summar);
                    }else{
                        i8ui.alert({title:'无上期计划！'});
                    }
                }
                showbox.find('textarea').autosize();
            });
        });

        var endTime=showbox.find('.endDate');
        //初始化选人控件
        var shareUser=i8selector.KSNSelector({
            model:2,
            width: options.width||694,
            element: '#shareTo',
            searchType: { "org": true, "user": true, "grp": false },
            loadItem:{
                items:[],
                loadedCallBack:function(){

                }
            }
        });

       // var shareTo=$('#shareTo').parents('.fw_ksninput');

        //判断是否有数据
        if(options.reportdata){
            var setData= _.map(options.reportdata.ShareUsers,function(item){
                return {id:item.EntityID,type:selectEnum[item.EntityType],ureadonly:true};
            });
            shareUser.setAllselectedData(setData);
        }else{
            common.ajax.getDefaultShareUsers(function(data){
                if($.type(data)=='object'&&data.Result){
                    var setData= _.map(data.ReturnObject,function(item){
                        return {id:item.EntityID,type:selectEnum[item.EntityType],ureadonly:true};
                    });
                    shareUser.setAllselectedData(setData);
                }
            })
        }

        var uploader=common.ajax.up(options);//初始化上传插件
        var startTime=showbox.find('.startDate').setTime({dateFmt:'yyyy-MM-dd',onpicked:function(){
            var _value=$(this).val();
            var _endTime=new Date(_value);
            if(_endTime=='Invalid Date'||isNaN(_endTime)){
                _endTime= new Date(_value.replace(/-/g,'/'));
            }
            if(showbox.find('.app-radio.checked').attr('rptype')==1){
                var weeks=getWeekByDay(_endTime.getFullYear(),_endTime.getMonth(),_endTime.getDate());
                startTime.val(weeks.beginDate);
                endTime.val(weeks.endDate);
            }

        }});//开始时间



        showbox.on('click','.app-radio',function(){
            showbox.find('.app-radio').removeClass('checked');
            var _this=$(this).addClass('checked');

            if(_this.attr('rptype')==0){
                startTime.val(options.nowTime);
                $('#checkendTime').hide();
            }else{
                startTime.val(options.beginTime);
                endTime.val(options.endTime)
                $('#checkendTime').show();
            }

        });


        //发布按钮
        showbox.on('click','.weekreport-publish:not(.posting)',function(e){

            var _this=$(this);
            var _shareuser=[];
            var i8selectordata=shareUser.getAllselectedData();
            for(var i=0;i<i8selectordata.length;i++){
                _shareuser.push({
                    EntityID:i8selectordata[i].id,
                    EntityType:_.indexOf(selectEnum,i8selectordata[i].type)
                });
            }
            var summarize=[];
            var nextplan=[];
            showbox.find('.summarize').each(function(){
                var _this=$(this);
                if(!(!$.trim(_this.val()))){
                    summarize.push(_this.val());
                }
            });

            showbox.find('.nextplan').each(function(){
                var _this=$(this);
                if(!(!$.trim(_this.val()))){
                    nextplan.push(_this.val());
                }
            });
            var uploadfiles=uploader.getUploadFiles();
            var files=uploadfiles.concat(uploader.getExistFiles());
            attid=[];
            for(var i=0;i<files.length;i++){
                attid.push(files[i].fileid||files[i].ID);
            }

            var entity={
                RpType:showbox.find('.app-radio.checked').attr('rpType'),
                StartTime:startTime.val(),
                EndTime:endTime.val(),
                Summarize:summarize,
                NextPlan:nextplan,
                ShareUsers:_shareuser,
                AttarchmentJson:attid
            }
            var shareuserstr=entity.ShareUsers.join(';');

            if(shareuserstr.search(i8_session.uid)>=0){
                i8ui.alert({title:'不能分享给自己！'});
                return;
            }

            if(!entity.StartTime){
                i8ui.alert({title:'请填写开始时间！'});
                return;
            }
            if(!entity.Summarize.length){
                i8ui.alert({title:'请填写本期总结！'});
                return;
            }
            if(!entity.NextPlan.length){
                i8ui.alert({title:'请填写下期计划！'});
                return;
            }
            if(!entity.ShareUsers.length){
                i8ui.alert({title:'请选择要分享的同事！'});
                return;
            }

            if(_this.hasClass('posting').length>0){
                return;
            }
            _this.html('发布中...').addClass('posting');
            entity= $.extend(options.reportdata,entity);
            common.ajax.toqinniu(uploadfiles,function(data){
                if($.type(data)=='object'&&data.Result){
                    addweekdaily(entity,showbox,options.callback,options.callback2);
                }else{
                    i8ui.alert({title:'文件存储失败！'});
                    _this.html('发布').removeClass('posting');
                }
            })

        });

        var _summarize='<div class="weekdaily-line">\
                    <span class="weekdaily-line-title">&nbsp;</span>\
                    <span class="input-panel"><textarea class=" summarize" placeholder="本期总结" ></textarea><i class="design-bg-icons3 app_clear_txt_btn" style="display: none;"></i></span>\
                </div>'
        var _nextplan='<div class="weekdaily-line">\
                            <span class="weekdaily-line-title">&nbsp;</span>\
                            <span class="input-panel"><textarea class=" nextplan" placeholder="下期计划" ></textarea><i class="design-bg-icons3 app_clear_txt_btn" style="display: none;"></i></span>\
                    </div>';

        var textChange=function(_this){
            if(!(!$.trim(_this.val()))){
                if(_this.hasClass('summarize')){
                    var next=_this.parents('.weekdaily-line').next('.weekdaily-line').find('.summarize');
                    if(next.length==0){
                        var _text=$(_summarize);
                        _text.find('textarea').val('').autosize();////setTextArea({width:options.width+2||698});
                        _this.parents('.weekdaily-line').find('.app_clear_txt_btn').show();
                        _this.parents('.weekdaily-line').after(_text);
                        _text.find('textarea').on('input propertychange',function(){
                            textChange($(this));
                        })
                    }
                }else{
                    var next=_this.parents('.weekdaily-line').next('.weekdaily-line').find('.nextplan');
                    if(next.length==0||!(!$.trim(next.find('textarea').val()))) {
                        var _text=$(_nextplan);
                        _text.find('textarea').val('').autosize();//setTextArea({width:options.width+2||698});
                        _this.parents('.weekdaily-line').find('.app_clear_txt_btn').show();
                        _this.parents('.weekdaily-line').after($(_text));
                        _text.find('textarea').on('input propertychange',function(){
                            textChange($(this));
                        })
                    }
                }
            }
        }

        $('.summarize,.nextplan').on('input propertychange','',function(){
            textChange($(this));
        });
        showbox.on('click','.app_clear_txt_btn',function(){
            var wekdline=$(this).parents('.weekdaily-line');
            var titletext= $.trim(wekdline.find('.weekdaily-line-title').html());
            if(titletext){
                wekdline.next('.weekdaily-line').find('.weekdaily-line-title').html(titletext);
            }
            wekdline.remove();
        });


        if(options.type=='edit'){
            showbox.off('click','.app-radio');
            showbox.find('.app-radio').addClass('unable');
            showbox.find('.date-bg.checked').removeClass('checked');
        }
    }

    //添加周日报
    var addweekdaily=function(entity,showbox,callback,callback2){
        common.ajax.saveReport(entity,function(data){
            showbox.find('.weekreport-publish').html('发布').removeClass('posting');
            if($.type(data)=='object'){
                if(data.Result){
                    showbox.find('.ct-close').trigger('click');
                    $('#weeks').find('.week.current').trigger('click');
                    callback&&callback(data.ReturnObject);
                    callback2&&callback2();
                    i8ui.alert({title:'保存成功！',type:2});

                }else{
                    i8ui.alert({title:'保存失败,'+data.Description+'！'});
                }
            }else{
                i8ui.alert({title:'保存失败,添加周日报是请求超时，请检查网络！'});
            }
        });
    }
});