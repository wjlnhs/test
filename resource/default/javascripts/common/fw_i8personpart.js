define(function (require, exports, module) {
    exports.init=function(option){
        var fw_selector = require('default/javascripts/plugins/i8selector/fw_selector');
        var html='<span class="fw_left m-l15" style="width:'+(option.width||110)+'px"><input class="fw_left" id="'+option.id+'"/></span><div style="width: 280px" class="radiolist fw_left m-t5"></div>';
        var listtemp=template('<span class="input-panel" style="width: 280px">\
                                    <span class="fw_left">\
                                        <span leaderID="{uid}" leaderType="1" class="design-bg-icons3 app-radio  checked" ></span>\
                                        <label title="{uname}" class="app-radio-label " style="vertical-align: 7px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap; display: inline-block;width: 100px;">{uname}</label>\
                                     </span>\
                                    {each Items as item}\
                                    <span class="fw_left">\
                                        <span leaderID="{item.ID}" leaderType="2" class="design-bg-icons3 app-radio " ></span>\
                                        <label title="{uname}({item.Name}兼职)" class="app-radio-label " style="vertical-align: 7px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: inline-block;width: 100px;">{uname}({item.Name}兼职)</label>\
                                     </span>\
                                    {/each}\
                                </span>');
        var $elem=option.elem.html(html);
        var chosePerson=fw_selector.KSNSelector({
            model: 1,
            element: '#'+option.id,
            width:option.width||100,
            isAbox: true,
            searchType: { "org": false, "user": true, "grp": false },
            selectCallback:function(uid, uname, uemail,datatype){
                getPartTimeByPassportID(uid,uname);
            }
        });
        var radiolist=$elem.find('.radiolist');
        radiolist.on('click','.app-radio',function(){
            radiolist.find('.app-radio').removeClass('checked');
            $(this).addClass('checked');
        })
        //获取兼职角色
        var getPartTimeByPassportID=function(uid,uname){
            radiolist.html('<div class="loading32"></div>');
            $.ajax({
                url: i8_session.ajaxWfHost + 'webajax/setting/getPartTimeByPassportID',
                type: 'get',
                dataType: 'json',
                data:{passportID:uid},
                cache:false,
                success: function (data) {
                    if(data.Result){
                        radiolist.html(listtemp({uid:uid,uname:uname,Items:data.ReturnObject}));
                    }else{
                        radiolist.html(data.Description);
                    }

                }, error: function (e1, e2, e3) {
                    radiolist.html('请求超时，请检查网络');
                }
            });
        }
        return {
            getSelect:function(){
                var checkradio=radiolist.find('.app-radio.checked');
                return {
                    leaderID:checkradio.attr('leaderID'),
                    leaderType:checkradio.attr('leaderType')
                }
            }
        }
    }
});