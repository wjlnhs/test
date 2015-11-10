define(function (require, exports, modules) {
    var ajaxHost = i8_session.ajaxHost;
    var resHost = i8_session.resHost;
    var fileuploader=require('../plugins/qiniu_uploader/qiniu_i8uploader');
    var i8ui = require('../common/i8ui');
    var setrelation=require('../setrelation/setrelation');
    var common = {
        ajax: {
            //根据开始结束时间获取周日报
            getMyReportsByWeek: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/getMyReportsByWeek',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            //根据开始结束时间获取周日报
            getPrePlan: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/getPrePlan',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            getMyReportsByMonth: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/getMyReportsByMonth',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            //保存周日报
            saveReport: function (entity, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/saveReport',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {entity: entity},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            //标记已阅
            haveReadrReport: function (reportID, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/havereadreport',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {reportID: reportID},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            //标记已阅
            evaluateReport: function (reportID,score,evaluation,callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/evaluatereport',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {reportID: reportID,score:score,evaluation:evaluation},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            //获取昨天提交详情
            getYesterDaySubmit: function (pageIndex,callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/getyesterdaysubmit',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{pageIndex:pageIndex},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error)
                    }
                });
            },
            //统计一个月之内“分享给我的周报日报”的提交情况
            getStatReportShare: function (options,callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/getstatreportshare',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{yearMonth:options.yearMonth},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error)
                    }
                });
            },
            //周日报提交统计
            getReportStat: function (options,callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/getstat',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error)
                    }
                });
            },
            //获取分享给我的人
            getSharePersons: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/getsharepersons',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error)
                    }
                });
            },
            //获取分享给我的周日报
            getShareReports: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/getsharereports',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            //删除周日报
            deleteReport: function (reportid, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/deleteReport',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {reportID: reportid},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },

            //获取当前共享给我的人guid列表
            getDefaultShareUsers: function (callback) {
                setrelation.getDefaultShareUser({appname:'App_Report'},callback);
            },

            //获取周日报默认页设置
            getReportSet: function (callback) {
                setrelation.getAppSet({appname:'App_Report'},callback)
            },
            //保存周日报默认页设置
            saveReportSet: function (defaultTab, callback) {
                setrelation.saveDefaultTab({appname:'App_Report',defaultTab:defaultTab},callback);
            },
            //获取周日报共享关系
            getReportRelations: function (options, callback) {
                options.appname='App_Report';
                setrelation.getAppsSetRelations(options,callback);
            },
            //设置周日报共享关系
            saveReportRelation: function (rsRelation, callback) {
                setrelation.saveAppsSetRelations({appname:'App_Report',rsRelation:rsRelation},callback);
            },
            //删除周日报共享关系
            deleteReportRelation: function (relationID, callback) {
                setrelation.deleteAppsSetRelations({appname:'App_Report',relationID:relationID},callback);
            },
            addCreateReportTips:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/addcreatereporttips',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            toqinniu: function (file, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/report_ajax/upqiniu',
                    type: 'get',
                    dataType: 'json',
                    data: {attachment: file},
                    cache: false,
                    success: function (result) {
                        callback(result)
                    },
                    error: function (e1, e2, e3) {
                        callback(e1)
                    }
                });
            },
            up: function (options) {
                var attachmentlist = [];
                if (options.reportdata) {
                    attachmentlist = options.reportdata.FileList;
                }
                //文件上传按钮
                var options = {'button':'uploaderbtnreport',//按钮ID
                    'fileContainerId':'uploaderreport',//装文件容器
                    'btnContainerId':'btn_containerreport',//按钮ID容器
                    'attachmentlist':attachmentlist,
                    'tokenUrl':'/platform/uptoken',
                    'flashUrl':'/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
                    'fileUploaded':function(){

                    }
                };
                return fileuploader.i8uploader(options)
                //kankanAttachment= fileuploader.i8uploader(options);
                //$(".attachment-btn",posterContainer).click(function(){
                //
                //})

                var attachmentlist = [];
                if (options.reportdata) {
                    attachmentlist = options.reportdata.FileList;
                }
                var option = {
                    swf: resHost + 'swf/Uploader.swf', // 'swf/swfupload.swf',
                    server: ajaxHost + 'webajax/appcom/fileupload',//
                    pick: {
                        id: '#uploaderbtn',
                        label: '上传',
                        html: '<span class="s-icon attachment-btn">附件</span>'
                    },
                    container:'#uploaderbtn',
                    attachmentlist: attachmentlist,
                    dnd: '#uploader .queueList',
                    paste: document.body,
                    disableGlobalDnd: true,
                    accept: {
                        extensions: 'png,jpg,jpeg,gif,xls,xlsx,doc,docx'
                    },
                    replace: false,
                    chunked: true,
                    fileNumLimit: 5,
                    fileSizeLimit: 20 * 1024 * 1024,    // 所有文件限制20M
                    fileSingleSizeLimit: 5 * 1024 * 1024,   // 单个文件限制5M
                    uploadSuccess: function (file, response) {

                    }, /*文件上传成功回调*/
                    uploadFailed: function (file) {

                    }, /*文件上传失败*/
                    uploadCompleted: function (error) {

                    },//文件上传结束 成功或失败
                    deleteCallBack: function (file) {

                    }, /*删除文件回调*/
                    uploadStarted: function (file) {

                    }/*开始上传触发*/
                };
                //console.log(upfileContor);
                return i8uploader.i8uploader(option);//调用上传插件
            }
        },
        fun: {
            readreport: function (_this, reportID) {
                var read_panel = _this.parents('.weekcontent,.quote-content').eq(0).find('.read-panel');
                _this.removeClass('readit').addClass('isread');
                var _read = read_panel.find('.read');
                if (_read.length > 0) {
                    if (_read.attr('uid').search(i8_session.uid) >= 0) {
                        i8ui.alert({title: '标记已阅成功！', type: 2});
                        return;
                    }
                }
                var readhtml = '<div class="read">\
                    <div class="weekdailypng-bg read-title">已阅：</div>\
                    <div class="readnamelist">\
                    </div>\
                    </em>\
                </div>';
                common.ajax.haveReadrReport(reportID, function (data) {
                    if ($.type(data) == 'object') {
                        if (data.Result) {
                            i8ui.alert({title: '标记已阅成功！', type: 2});
                            if (_read.length > 0) {
                                _read.attr('uid', _read.attr('uid') + ';' + i8_session.uid)
                                    .find('.readnamelist').append('<a>' + i8_session.uname + '</a>');
                            } else {
                                _read = $(readhtml);
                                _read.attr('uid', i8_session.uid)
                                    .find('.readnamelist').append('<a>' + i8_session.uname + '</a>');
                                read_panel.append(_read);

                            }
                        }else{
                            _this.removeClass('isread').addClass('readit');
                        }
                    }else{
                        _this.removeClass('isread').addClass('readit');
                    }
                });
            },
            //打开评分窗口
            openScore:function(data,callback){
                var tpl=require('../../template/report/score-pop.tpl');
                var render=template(tpl);
                var openbox=$(i8ui.showbox({
                    title:'评分',
                    cont:render(data)
                }));

                //单选按钮
                openbox.on('click','.app-radio,.radio-label',function(){
                    openbox.find('.app-radio').removeClass('checked');
                    $(this).parent().find('.app-radio').addClass('checked')
                });

                //绑定评分
                openbox.find('.app-radio[score='+data.Score+']').trigger('click');

                //取消
                openbox.on('click','.btn-cancel',function(){
                    openbox.find('.ct-close').trigger('click');
                });
                //确认
                openbox.on('click','.btn-sure',function(){
                    var reportID=data.ID;
                    var score=parseInt(openbox.find('.app-radio.checked').attr('score'));
                    var evaluation=openbox.find('textarea').val();
                    if(evaluation.length>200){
                        i8ui.error('评语字符超限，最多不能超过200字！');
                        return;
                    }
                    data.Score=score;
                    data.Evaluation=evaluation;
                    common.ajax.evaluateReport(reportID,score,evaluation,function(result){
                        if($.type(result)=='object'){
                            if(result.Result){
                                i8ui.alert({title:'评分成功',type:2});
                                callback(data);
                            }else{
                                i8ui.alert({title:'评分失败，'+result.Description});
                            }
                        }else{
                            i8ui.alert({title:'评分失败，评分时请求超时！'});
                        }
                    })
                    openbox.find('.ct-close').trigger('click');
                });
            }
        }
    }
    modules.exports = common;
});
