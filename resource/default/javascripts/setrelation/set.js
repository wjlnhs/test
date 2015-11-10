define(function (require, exports) {
    var i8ui=require('../common/i8ui');
    var util=require('../common/util');
    var i8selector=require('../plugins/i8selector/fw_selector.js');
    var fw_page=require('../common/fw_pagination');
    var setrelation=require('./setrelation');

    var config={
        appType:'',
        appName:'',
        columnNum:3,
        noReportRelation:false,//不需要上级
        selectConfig:{ "org": false, "user": true, "grp": false },
        selectType:{ "user": 0, "grp": 1,"org": 2}
    };

    var configOptions={
        'App_Schedule':{
                text:'选择权限',
                value:[10,11],
                Name:['显示详细','显示状态为忙碌'],
                keyValue:{
                    '10':'显示详细',
                    '11':'显示状态为忙碌'
                },
                html:'<select class="w-150-h33 accessType" style="height: 36px"><option value="10">显示详细</option><option value="11">显示状态为忙碌</option></select>'
            }
    }

    //添加查看关系
    var addRelation=function(elem,relationType,source,state,callback){
        var input_id='shareInput'+relationType;
        var _txt='主动添加';
        if(relationType==2){
            _txt='主动申请';
        }
        var _tdoption='';//配置权限html
        if(configOptions[config.appType]){//判断是否有配置权限
            if(relationType==2){
                _tdoption='<td>- - - -</td>'
            }else{
                _tdoption='<td>'+configOptions[config.appType].html+'</td>';
            }
        }
        var _tr=$('<tr><td style="padding: 10px;"><input id="'+input_id+'" class="w-210-h36" /></td><td>'+_txt+'</td>'+_tdoption+'<td><a class="weekdailypng-bg btn-save">保存</a><a class="weekdailypng-bg btn-cancel">取消</a></td></tr>');
        elem.parent().find('tbody').append(_tr);
        _tr.find('.accessType').setSelect({
            newi8select:'newi8-select fw_left',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked'
        });

        var targetInfo=i8selector.KSNSelector({
            model:1,
            width: 200,
            element: '#'+input_id,
            searchType: relationType==1?config.selectConfig:{ "org": false, "user": true, "grp": false },
            selectCallback:function(id){
                if(id==i8_session.uid){
                    i8ui.error('不能'+_txt+'自己设置自己的'+config.appName+'分享！');
                    targetInfo.clearData();
                }
            }
        });
        _tr.find('input').trigger('focus');
        _tr.on('click','.btn-cancel',function(){
            callback(_tr,true);
        });
        _tr.on('click','.btn-save',function(){
            var targetID=targetInfo.getAllselectedData();
            if(targetID.length==0){
                i8ui.error('请选择要分享的对象！');
                return;
            }
            var rsRelation={
                RelationType:relationType,
                Source:source,
                TargetID:targetID[0].id,
                State:state,
                TargetType:config.selectType[targetID[0].type]
            }
            setrelation.saveAppsSetRelations({
                appname:config.appType,
                noReportRelation:config.noReportRelation,
                accessType:_tr.find('.i8-select').getValue()||0,
                rsRelation:rsRelation
            },function(data){
                if($.type(data)=='object'){
                    if(data.Result){
                        i8ui.write('保存成功！');
                        callback(_tr);
                    }else{
                        /*switch(data.Code){
                            case 1008:data.Description='该用户为汇报上级，不需要手动设置!';break;
                            case 1009:data.Description='该用户为下属，不需要手动设置!';break;
                            case 1010:data.Description='不能自己设置自己!';break;
                            case 1011:data.Description='该条信息已经存在!';break;
                            case 1012:data.Description='该用户已经存在于设置列表中!';break;
                            case 1013:data.Description='已存在该用户的请求信息，请处理!';break;
                        }*/
                        i8ui.error('保存失败，'+data.Description);
                    }
                }else{
                    i8ui.error('保存时请求超时！');
                }
            });
        });
    }

    //删除查看关系
    var deleteRelation=function(relationID,callback){
        i8ui.confirm({title:'是否确定删除？'},function(){
            setrelation.deleteAppsSetRelations({appname:config.appType,relationID:relationID},function(data){
                if($.type(data)=='object'){
                    if(data.Result){
                        callback();
                        i8ui.write('删除成功！');
                    }else{
                        i8ui.error('删除失败，'+data.Description)
                    }
                }else{
                    i8ui.error('删除失败，删除分享关系是超时！');
                }
            });
        });
    }

    //处理查看关系
    var editRelation=function(tr,state,callback){
        var rsRelation={
            RelationType:tr.attr('relationtype'),
            Source:tr.attr('source'),
            TargetID:tr.attr('targetid'),
            PassportID:tr.attr('passportid'),
            ID:tr.attr('relationid'),
            TargetType:tr.attr('targettype'),
            State:state
        }
        setrelation.saveAppsSetRelations({
            appname:config.appType,
            noReportRelation:config.noReportRelation,
            accessType:tr.attr('accessType')||0,
            rsRelation:rsRelation
        },function(data){
            if($.type(data)=='object'){
                if(data.Result){
                    i8ui.write('保存成功！');
                    callback();
                }else{
                    i8ui.error('保存失败，'+data.Description);
                }
            }else{
                i8ui.error('保存时请求超时！');
            }
        });
    }

    //获取分享给我的人
    var getShareMeRelation=function(pageIndex){
        var tpl=require('../../template/setrelation/shareme.tpl');
        var render=template(tpl);
        var _content=shareMe.find('tbody').html(render({loading:true,configOptions:configOptions,config:config}));
        var _page=shareMe.find('.pagination').html('');
        var options={
            relationType:2,
            pageIndex:pageIndex||1,
            pageSize:5,
            appname:config.appType,
            noReportRelation:config.noReportRelation
        }
        setrelation.getAppsSetRelations(options,function(data){
            shareedit=false;
            if($.type(data)=='object'){
                data.configOptions=configOptions;
                data.config=config;
                if(data.Result){
                    _content.html(render(data));

                    //分页控件绑定
                    fw_page.pagination({
                        ctr: _page,
                        totalPageCount: data.ReturnObject.totalCount,
                        pageSize: 5,
                        current: options.pageIndex,
                        fun: function (new_current_page, containers) {
                            getShareMeRelation(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                }else{
                    _content.html('<tr><td colspan="'+config.columnNum+'">'+data.Description+'</td></tr>');
                }
            }else{
                _content.html('<tr><td colspan="'+config.columnNum+'">请求我可以查看谁的'+config.appName+'列表超时！</td></tr>')
            }
        });


    }


    //获取谁可以查看我的
    var getIShareRelation=function(pageIndex){
        var tpl=require('../../template/setrelation/ishare.tpl');
        var render=template(tpl);
        var _content=iShare.find('tbody').html(render({loading:true,configOptions:configOptions,config:config}));
        var _page=iShare.find('.pagination').html('');
        var options={
            relationType:1,
            pageIndex:pageIndex||1,
            pageSize:5,
            appname:config.appType,
            noReportRelation:config.noReportRelation
        }
        setrelation.getAppsSetRelations(options,function(data){
            ishareedit=false;
            if($.type(data)=='object'){
                data.configOptions=configOptions;
                data.config=config;
                if(data.Result){
                    _content.html(render(data));

                    //分页控件绑定
                    fw_page.pagination({
                        ctr: _page,
                        totalPageCount: data.ReturnObject.totalCount,
                        pageSize: 5,
                        current: options.pageIndex,
                        fun: function (new_current_page, containers) {
                            getIShareRelation(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                }else{
                    _content.html('<tr><td colspan="'+config.columnNum+'">'+data.Description+'</td></tr>');
                }
            }else{
                _content.html('<tr><td colspan="'+config.columnNum+'">请求谁可以查看我的'+config.appName+'列表超时！</td></tr>')
            }
        });
    }

    var iShare=$('#Ishare');
    var shareMe=$('#shareMe');

    var ishareedit=false;
    //添加谁可以查看我的列表
    iShare.on('click','.sys-mgadd-btn',function(){
        if(!ishareedit){
            addRelation($(this),1,1,0,function(tr,iscancel){
                ishareedit=false;
                if(iscancel){
                    tr.remove()
                }else{
                    getIShareRelation();
                }
            });
        }else{
            iShare.find('.btn-save').trigger('click');
            //i8ui.error('正在编辑中，请先结束编辑！');
        }
        ishareedit=true;
    });
    //注册谁可以查看我的列表 删除 按钮
    iShare.on('click','.btn-delete',function(){
        var _tr=$(this).parents('tr');
        deleteRelation(_tr.attr('relationid'),function(){
            getIShareRelation();
        })

    });

    //注册谁可以查看我的列表 同意 按钮
    iShare.on('click','.btn-agree',function(){
        var _tr=$(this).parents('tr');
        var currentOption=configOptions[config.appType];
        if(currentOption){
            var _cont='<div class="p20"><div class="selectitem h-40"><span class="fw_left m-t10">权限：</span>'+currentOption.html+'</div><div class="tright m-t10"><a class="gray-button">取消</a><a class="blue-button m-l10">确定</a></div></div>';
            var showbox=$(i8ui.showbox({title:currentOption.text,cont:_cont}));
            showbox.find('.accessType').setSelect({
                newi8select:'newi8-select fw_left',
                dropstyle: 'newselecti',
                ckedstyle: 'newselectcked'
            });
            showbox.on('click','.gray-button',function(){
                showbox.find('.ct-close').trigger('click');
            });
            showbox.on('click','.blue-button',function(){
                _tr.attr('accessType',showbox.find('.i8-select').getValue());
                editRelation(_tr,0,function(){
                    getIShareRelation();
                    showbox.find('.ct-close').trigger('click');
                });
            });
        }else{
            editRelation(_tr,0,function(){
                getIShareRelation();
                //showbox.find('.ct-close').trigger('click');
            });
        }

    });

    //注册谁可以查看我的列表 拒绝 按钮
    iShare.on('click','.btn-refuse',function(){
        var _tr=$(this).parents('tr');
        editRelation(_tr,1,function(){
            getIShareRelation();
        });
    });


    var shareedit=false;
    //添加我可以查看谁的列表
    shareMe.on('click','.sys-mgadd-btn',function(){
        if(!shareedit){
            addRelation($(this),2,2,2,function(tr,iscancel){
                shareedit=false;
                if(iscancel){
                    tr.remove()
                }else{
                    getShareMeRelation();
                }
            });
        }else{
            shareMe.find('.btn-save').trigger('click');
            //i8ui.error('正在编辑中，请先结束编辑！');
        }
        shareedit=true;
    });

    //注册我可以查看谁的 删除 按钮
    shareMe.on('click','.btn-delete',function(){
        var _tr=$(this).parents('tr');
        deleteRelation(_tr.attr('relationid'),function(){
            getShareMeRelation();
        })

    });

    //注册我可以查看谁的 再次申请 按钮
    shareMe.on('click','.btn-again',function(){
        var _tr=$(this).parents('tr');
        editRelation(_tr,2,function(){
            getShareMeRelation();
        });
    });



    exports.setRelation=function(appType,appName,noReportRelation,selectConfig){
        config.appType=appType;
        config.appName=appName;
        config.noReportRelation=noReportRelation||false;
        config.selectConfig=selectConfig||config.selectConfig;
        if(configOptions[appType]){
            config.columnNum=4;
        }else{
            $('.authtd').hide();
        }
        $('.appName').html(appName);
        getShareMeRelation();
        getIShareRelation();
    }
});