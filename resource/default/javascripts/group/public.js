define(function(require,exports){
    var util = require('../common/util.js');
    var i8ui = require('../common/i8ui.js');
    var gid = util.getUrlParam("id");
    function getGroupDetial(callback){
        var gid = getgid();
        if(gid == ""){
            return;
        }
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/getEntity',
            type: 'get',
            dataType: 'json',
            data: {groupID: gid},
            cache: false,
            success: function(result){
                if(result.Result){
                    callback(result);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function getgid(){
        if(gid == ""){
            i8ui.error("找不到对应的群组！3秒后自动跳转到群组列表页！");
            setTimeout(function(){
                window.location.href = '/group/list';
            },3000);
        }else{
            return gid;
        }
    }

    function _getMembers(pageIndex,callback){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/getMemberInfoByGID',
            type: 'get',
            dataType: 'json',
            data: {groupID: gid, pageIndex: pageIndex, pageSize: 10},
            cache: false,
            success: function(result){
                if(result.Result){
                    callback(result);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function _getDocList(pageIndex,callback){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/getListForGroup',
            type: 'get',
            dataType: 'json',
            data: {groupID: gid, pageIndex: pageIndex, pageSize: 10},
            cache: false,
            success: function(result){
                if(result.Result){
                    callback(result);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    //关闭群组
    function _closeGroup(datas, callback){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/closeGroupByIDParam',
            type: 'get',
            dataType: 'json',
            data: datas,
            success: function(result){
                if(result.Result){
                    callback();
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    //0退出或提出，1设置管理员，2撤销管理员
    function _outGroupID(datas,callback){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/memberManagerParam',
            type: 'get',
            dataType: 'json',
            data: datas,
            cache: false,
            success: function(result){
                if(result.Result){
                    callback(result);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("服务器异常！");
            }
        });
    }
    function _getMessage(type,data,uname){
        switch(type){
            case 'invite':
                return 'Hi！#username#,你的同事'+ (uname || i8_session.uname) +'邀请你加入群"'+
                        '<a class="group-mage-name">'+ data.Name +'</a>"'+
                        '<span inviteid="#inviteid#" type="1" gname="'+ data.Name +'" gid="'+ data.ID +'" class="group-agree-invite spbg1 sprite-100">同意</span>'+
                        '<span inviteid="#inviteid#" type="2" gname="'+ data.Name +'" gid="'+ data.ID +'" class="group-agree-invite spbg1 sprite-101">拒绝</span>';
                break;
            case 'delmanager':
                return '你所在的群组“<a href="group/home?id='+ data.ID +'">'+ data.Name +'</a>”的管理员已被撤销';
                break;
            case 'delmember':
                return '你已被移出群组“<a href="group/home?id='+ data.ID +'">'+ data.Name +'</a>”';
                break;
            case 'closegroup':
                return '你所在的群组"<span>'+ data.Name +'</span>",已经被管理员关闭';
                break;
            case 'setmanager':
                return '你已升级为群组“<a href="group/home?id='+ data.ID +'">'+ data.Name +'</a>”的管理员,快去看看吧';
                break;
            case 'shenqing':
                return i8_session.uname +'申请加入“<a href="group/home?id='+ data.ID +'">'+ data.Name +'</a>”群组'+'' +
                        '<span requestid="#requestid#" gid="'+ data.ID +'" gname="'+ data.Name +'" class="group-yes-btn spbg1 sprite-100">同意</span>' +
                        '<span requestid="#requestid#" gid="'+ data.ID +'" gname="'+ data.Name +'" class="group-no-btn spbg1 sprite-101">拒绝</span>';
                break;
            case 'jihuo':
                return '你所在的群组"<a href="group/home?id='+ data.ID +'">'+ data.Name +'</a>",已经被管理员激活';
                break;
            case 'tongyi':
                return '你申请的群组“<a href="group/home?id='+ data.ID +'">'+ data.Name +'</a>",已经被管理员审批通过';
                break;
            case 'jujue':
                return '你申请的群组“<a href="group/home?id='+ data.ID +'">'+ data.Name +'</a>",已经被管理员审批拒绝';
                break;
            case 'agree':
                return '你邀请的“'+ i8_session.uname +'”,已同意加入”<a href="group/home?id='+ data.ID +'">'+ data.Name +'</a>“群组';
                break;
            case 'refuse':
                return '你邀请的“'+ i8_session.uname +'”,已拒绝加入”<a href="group/home?id='+ data.ID +'">'+ data.Name +'</a>“群组';
                break;
        }
    }
    //错误代码
    function showError(code){
        switch(code){
            case 3213:
                return '该群组邀请信息不存在或已过期';
                break;
            case 3207:
                return '该群不存在或已被关闭';
                break;
            case 3054:
                return '群组不存在成员信息';
                break;
            case 3051:
                return '已经是群组成员';
                break;
            case 990:
                return '数据操作逻辑错误';
                break;
            case 3213:
                return '该群组邀请信息不存在或已过期';
                break;
            case 3213:
                return '该群组邀请信息不存在或已过期';
                break;
            case 3213:
                return '该群组邀请信息不存在或已过期';
                break;
            case 3213:
                return '该群组邀请信息不存在或已过期';
                break;
            case 3209:
                return '当前用户不在群组中';
                break;
            case 3214:
                return '该消息已被其他管理员处理';
                break;
            case 3216:
                return '该用户已经被邀请过';
                break;
            default: '出错了';
                break;
        }

    }
    //        <img class="my-headimg lt" src=""http://"+fileJson.bucket+".qiniudn.com/"+{Item.Item1.Icon}">


    exports.getGid = getgid;
    exports.getGroupDetial = getGroupDetial;
    exports.getMembers = _getMembers;
    exports.getDocList = _getDocList;
    exports.closeGroup = _closeGroup;
    exports.outGroupID = _outGroupID;
    exports.getMessage = _getMessage;
    exports.showError = showError;
});