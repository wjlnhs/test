define(function (require, exports) {
    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('../../javascripts/common/util');
    var common=require('./common');
    var room_setlist=require('../../template/calendar/room_setlist.tpl');
    var add_rooom_pop=require('../../template/calendar/add-room-pop.tpl');
    var roomrender=template(room_setlist);
    var fw_page=require('../common/fw_pagination');

    //基本设置
    var getRoom=function(){
        var roomlist=[];//缓存当前页的会议室信息

        var roomset=$('#roomset');
        var roomtbody=$('#tb_list');
        var _page=$('#roompage');
        var iseditroom=false;
        //根据页码获取会议室
        var getAllRoomByPage=function(pageIndex){
            var options={
                pageIndex:pageIndex||1,
                pageSize:10
            }
            roomtbody.html(roomrender({loading:true}));
            _page.empty();
            common.ajax.getAllRoomByPage(options,function(data){
                if($.type(data)=='object'){
                    if(data.Result){
                        if(data.Total==0){
                            roomtbody.html(roomrender({noresult:true}));
                        }else{
                            roomtbody.html(roomrender(data));
                            roomlist=data.ReturnObject;
                            //分页控件绑定
                            fw_page.pagination({
                                ctr: _page,
                                totalPageCount: data.Total,
                                pageSize: 10,
                                current: options.pageIndex,
                                fun: function (new_current_page, containers) {
                                    getAllRoomByPage(new_current_page);
                                }, jump: {
                                    text: '跳转'
                                }
                            });
                        }
                    }else{
                        roomtbody.html(roomrender({error:data.Description}));
                    }
                }else{
                    roomtbody.html(roomrender({error:'请求会议室列表超时！'}));
                }
            });
        }

        getAllRoomByPage();

        //编辑按钮
        roomset.on('click','.btn-edit',function(){
            if(iseditroom){
                i8ui.error('正在编辑中，请先编辑或取消！')
                return;
            }
            var _tr=$(this).parents('tr');
            var index=_tr.attr('Index');
            var currentRoom=$.extend(true,{},roomlist[index]);
            openWindow('编辑会议室',currentRoom);
            /*if(iseditroom){
                i8ui.error('正在编辑中，请先编辑或取消！')
                return;
            }
            iseditroom=true;
            var _tr=$(this).parents('tr');
            var index=_tr.attr('Index');
            var currentRoom= $.extend(true,{},roomlist[index]);
            _tr.html(roomrender($.extend(currentRoom,{edit:true})));*/
        });

        //取消按钮
        roomset.on('click','.btn-cancel',function(){
            var _tr=$(this).parents('tr');
            var index=_tr.attr('Index');
            var currentRoom=$.extend(true,{},roomlist[index]);
            if(!currentRoom.ID){
                _tr.remove();
            }else{
                _tr.html(roomrender($.extend(currentRoom,{cancel:true})));
            }
            iseditroom=false;

        });

        //删除按钮
        roomset.on('click','.deleteroom',function(){
            var _tr=$(this).parents('tr');
            var index=_tr.attr('Index');
            var currentRoom=$.extend(true,{},roomlist[index]);
            var options={
                mettingRoomID:currentRoom.ID
            }
            i8ui.confirm({title:'是否确认删除？'},function(divDom){
                common.ajax.deleteRoom(options,function(data){
                    if($.type(data)=='object'){
                        if(data.Result){
                            getAllRoomByPage();
                            i8ui.write('删除成功！');
                        }else{
                            i8ui.write('删除失败，'+data.Description);
                        }
                    }else{
                        i8ui.write('删除失败，删除时请求超时！');
                    }
                    iseditroom=false;
                });
            })

        });

        //添加按钮
        $('#addroom').on('click',function(){
            if(iseditroom){
                i8ui.error('正在编辑中，请先编辑或取消！')
                return;
            }
            openWindow('添加会议室');
            //iseditroom=true;
            //var _tr=$('<tr></tr>');
            //roomtbody.append(_tr.html(roomrender({edit:true})));
        });

        //保存按钮
        roomset.on('click','.btn-save',function(){
            var _tr=$(this).parents('tr');
            var index=_tr.attr('Index');
            var currentRoom=$.extend(true,{},roomlist[index]);
            var mettingRoom=$.extend(currentRoom,{
                Name:_tr.find('.name').val(),
                Galleryful:_tr.find('.calleryful').val(),
                Place:_tr.find('.place').val(),
                Remark:_tr.find('.remark').val()
            });
            saveRoom(mettingRoom);
        });

        var openWindow=function(title,currentRoom){
            console.log(currentRoom);
            var add_roomrender=template(add_rooom_pop);
            var showbox=$(i8ui.showbox({
                title:title,
                cont:add_roomrender(currentRoom||{})
            }));
            //取消
            showbox.on('click','.btn-gray96x32',function(){
                showbox.find('.ct-close').trigger('click');
            });

            //保存
            showbox.on('click','.btn-blue96x32',function(){

                var mettingRoom=$.extend(currentRoom||{},{
                    Name:showbox.find('.name').val(),
                    Galleryful:showbox.find('.calleryful').val(),
                    Place:showbox.find('.place').val(),
                    Remark:showbox.find('.remark').val()
                })
                saveRoom(mettingRoom,function(){
                    showbox.find('.ct-close').trigger('click');
                })
            });
        }

        //保存会议室方法
        var saveRoom=function(mettingRoom,callback){
            if(validateRoom(mettingRoom)){
                common.ajax.saveRoom({mettingRoom:mettingRoom},function(data){
                    if($.type(data)=='object'){
                        if(data.Result){
                            i8ui.write('保存成功！');
                            getAllRoomByPage();
                            callback&&callback();
                        }else{
                            i8ui.error('保存失败,'+data.Description);
                        }
                    }else{
                        i8ui.error('保存失败,请求超时！');
                    }
                    iseditroom=false;
                });
            }
        }

        //验证会议室提交信息
        var validateRoom=function(mettingRoom){
            if(!mettingRoom.Name){
                i8ui.error('请输入会议室名称！');
                return false;
            }
            if(!mettingRoom.Galleryful){
                i8ui.error('请输入容纳人数！');
                return false;
            }
            if(isNaN(mettingRoom.Galleryful)){
                i8ui.error('容纳人数请输入数字！');
                return false;
            }
            if(!mettingRoom.Place){
                i8ui.error('请输入会议室地点！');
                return false;
            }
            return true;
        }
    }

    $(function(){
        getRoom();
    })

})