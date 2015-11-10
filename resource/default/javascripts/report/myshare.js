define(function (require, exports) {
    var score = require('./score.js');
    var util = require('../common/util');
    var i8ui = require('../common/i8ui');
    var getdatepicker = require('./getdatepicker.js');
    //公用ajax方法
    var common = require('./common');
    var fw_page = require('../common/fw_pagination');
    var yester_page=$('#js_yester_page');

    //获取共享周日报给我的人
    var getSharePesons = function () {
        var authorchoose = $('#authorchoose');
        var options = {
            startTime: $('#shareStartTime').val() || '0001-01-01',
            endTime: $('#shareEndTime').val() || '9999-01-01',
            rpType: $('#rptypechoose').find('span.checked').attr('rptype')
        }
        common.ajax.getSharePersons(options, function (data) {
            if ($.type(data) == 'object') {
                var namearr = [];
                if (data.Result) {
                    var rtobj = data.ReturnObject;
                    if (rtobj.length > 0) {
                        namearr.push('<span uid="00000000-0000-0000-0000-000000000000" class="items checked">全部</span>')
                        for (var i = 0; i < rtobj.length; i++) {
                            namearr.push('<span uid="' + rtobj[i].PassportID + '" class="items">' + rtobj[i].Name + '</span>')
                        }
                    }
                } else {
                    namearr.push('<span >' + data.Code + '</span>')
                }
                var _html = namearr.join('') || '<span >没有分享给您的'+(options.rpType==2?'周日':options.rpType==1?'周':'日')+'报</span>';
                authorchoose.html(_html);
                getShareReports();
            } else {
                authorchoose.html('<span >请求分享给您的作者时超时！</span>');
            }
        })
    }

    var sharereports = $('#sharereports');
    //获取共享给我的周日报
    var getShareReports = function (pageIndex) {
        var tpl = require('../../template/report/sharereport.tpl');
        var render = template(tpl);
        var _content = sharereports.find('.report-content').html(render({loading: true}));
        var _page = sharereports.find('.pagination').html('');
        var options = {
            startTime: $('#shareStartTime').val() || '0001-01-01',
            endTime: $('#shareEndTime').val() || '9999-01-01',
            rpType: $('#rptypechoose').find('span.checked').attr('rptype'),
            authorID: $('#authorchoose').find('span.checked').attr('uid'),
            pageIndex: pageIndex || 1,
            pageSize: 5
        }
        common.ajax.getShareReports(options, function (data) {
            if ($.type(data)) {
                if (data.Result) {
                    sharereports.data('report', data.ReturnObject.Items);//缓存数据
                    data.rpType=options.rpType;
                    _content.html(render(data));

                    //分页控件绑定
                    fw_page.pagination({
                        ctr: _page,
                        totalPageCount: data.ReturnObject.totalCount,
                        pageSize: 5,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getShareReports(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                } else {
                    _content.html(data.Code);
                }
            } else {

            }
        });

    }

    var shareStartTime = $('#shareStartTime');
    var shareEndTime = $('#shareEndTime');
    var _date=new Date();
    var year=new Date().getFullYear();
    var today=util.dateformat(_date,'yyyy-MM-dd');
    //选择开始时间
    shareStartTime.val(year+'-01-01').setTime({
        minDate: year+'-01-01',
        maxDate: today,
        onpicked: function () {
            getSharePesons();
            resetTime(shareEndTime,shareStartTime.val(),year+'-12-31')
        }
    });

    //选择结束时间
    shareEndTime.val(today).setTime({
        minDate: year+'-01-01',
        maxDate: year+'-12-31',
        onpicked: function () {
            getSharePesons();
            resetTime(shareStartTime,year+'-01-01',shareEndTime.val());
        }
    });

    var resetTime=function(elem,minDate,MaxDate){
        elem.off('focus').setTime({
            minDate: minDate,
            maxDate: MaxDate,
            onpicked: function () {
                getSharePesons();
            }
        })
    }

    $('#selectShareYear').append('<option value="' + year + '">' + year + '年</option><option value="' + (year-1) + '">' + (year-1) + '年</option>').setSelect({
        newi8select:'newi8-select fw_left m-r10',
        dropstyle: 'newselecti',
        ckedstyle: 'newselectcked'
    });

    $('#selectShareYear').on('click','em',function(){
        year=$('#selectShareYear').getValue();
        shareStartTime.val(shareStartTime.val().replace(/[\d]+[-]/,year+'-'))
        shareEndTime.val(shareEndTime.val().replace(/[\d]+[-]/,year+'-'))
        resetTime(shareStartTime,year+'-01-01',year+'-12-31');
        resetTime(shareEndTime,year+'-01-01',year+'-12-31');
        getSharePesons();
    });

    //选择周日报类型
    $('#rptypechoose').on('click', 'span.items', function () {
        var _this = $(this);
        _this.parent().find('span').removeClass('checked');
        _this.addClass('checked');
        getSharePesons();
    });

    //选择作者
    $('#authorchoose').on('click', 'span.items', function () {
        var _this = $(this);
        _this.parent().find('span').removeClass('checked');
        _this.addClass('checked');
        getShareReports();
    });

    var getYesterDay = function (pageIndex) {
        var pageIndex = pageIndex || 1;
        var yesterday = $('#yesterday').find('.dailysub-list');
        var tpl = require('../../template/report/yesterday.tpl');
        var render = template(tpl);
        yesterday.html(render({loading: true}));
        common.ajax.getYesterDaySubmit(pageIndex, function (data) {
            if ($.type(data) == 'object') {
                if (data.Result && data.ReturnObject) {
                    var totalCount=data.ReturnObject.totalCount;
                    var _pageIndex=pageIndex;
                    var pageNum=Math.ceil(totalCount/5);
                    if(totalCount<=5){
                        yester_page.hide();
                    }
                    if (data.ReturnObject.Items.length > 0) {
                        yesterday.html(render(data.ReturnObject));
                    } else {
                        yesterday.html(render({noresult: true}));
                    }
                    yester_page.off('click','.y-prev').on('click','.y-prev',function(){
                        if(_pageIndex==1){
                            return;
                        }else if(_pageIndex==2){
                            $(this).addClass('disabled');
                        }else{
                            $(this).removeClass('disabled');
                        }
                        yester_page.find('.y-next').removeClass('disabled');
                        _pageIndex--;
                        getYesterDay(_pageIndex);
                    })
                    yester_page.off('click','.y-next').on('click','.y-next',function(){
                        if(_pageIndex==pageNum){
                            return;
                        }else if(_pageIndex==pageNum-1){
                            $(this).addClass('disabled');
                        }else{
                            $(this).removeClass('disabled');
                        }
                        yester_page.find('.y-prev').removeClass('disabled');
                        _pageIndex++;
                        getYesterDay(_pageIndex);
                    })
                } else {
                    yesterday.html('<li>' + data.Description + '</li>');
                }
            } else {
                yesterday.html('<li>请求昨日提交详情超时！</li>');
            }
        });

        //注册提醒
        yesterday.off('click').on('click', '.addreporttips', function () {
            var _this = $(this);
            var options = {
                isToLeader: false,
                title: '请尽快补交昨日的工作日报，谢谢！',
                userID: _this.attr('pid')
            }
            common.ajax.addCreateReportTips(options, function (data) {
                if ($.type(data) == 'object') {
                    if (data.Result) {
                        i8ui.write('提醒成功！');
                        _this.html('已提醒').attr('class', 'weekdailypng-bg already').css('margin-left', '10px');
                    }
                    else {
                        i8ui.error('提醒失败，' + data.Code);
                    }
                } else {
                    i8ui.error('提醒失败，提醒时请求超时！');
                }
            });
        })

    }


    //打开评分窗口
    sharereports.on('click', '.openscore', function () {
        common.fun.openScore(sharereports.data('report')[parseInt($(this).attr('index'))], function () {
            $('#authorchoose').find('.items.checked').trigger('click');
        });
        return false;
    });

    //评分
    sharereports.on('click', '.comment-panel.canevaluate', function () {
        common.fun.openScore(sharereports.data('report')[parseInt($(this).attr('index'))], function () {
            $('#authorchoose').find('.items.checked').trigger('click');
        });
        return false;
    });

    //移动到分数上
    sharereports.on('mouseover mouseout', '.scorepanel', function (event) {
        if (event.type == "mouseover") {
            var _this = $(this);
            var _comment = _this.find('.comment-panel');
            _comment.css({top: 30 - (_comment.height() / 2) + 'px'}).show();
        } else if (event.type == "mouseout") {
            $(this).find('.comment-panel').hide();
        }
    })

    exports.myShare = function () {
        getSharePesons();
        getYesterDay();
        getdatepicker.setshareDatePicker($('#share_datepicker'), common.ajax.getStatReportShare);//周日报统计插件
    }
});