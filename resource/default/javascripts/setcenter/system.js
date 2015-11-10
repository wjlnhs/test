/**
 * Created by chenshanlian on 2015/3/24.
 */
define(function(require){
    var i8ui = require('../common/i8ui.js');
    var regbox = require('../common/regexp.js');
    var classArrs = [];
    //获取职级列表
    function getClassList(){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getClassLine",
            type: "get",
            dataType: "json",
            cache:false,
            success: function (data) {
                console.log(data);
                var classHtml = "";
                if(data.Result){
                    classArrs = orderBy(data.ReturnObject)
                    for(var i=0; i<classArrs.length; i++){
                        var item = classArrs[i];
                        var delspan = '<span class="pic pic_12" title="删除职级"></span>';
                        var addspan = '<span class="pic pic_23" title="新增职级"></span>';
                        if(i == 0 || i== classArrs.length-1){
                            delspan = '';
                        }
                        if(i==classArrs.length - 1){
                            addspan = '';
                        }
                        classHtml += '<div index="'+i+'" class="zhiji-option">'+
                                            '<p class="zhiji-name">'+item.Name+'</p>'+
                                            '<span class="pic pic_20" title="编辑职级"></span>'+addspan+delspan+
                                        '</div><div class="zhiji-jt"><i class="pic pic_21"></i></div>';
                    }
                    $("#js_class_div").html(classHtml);
                }
            },
            error: function(error){}
        });
    }
    //排序
    function orderBy(arrs){
        arrs = arrs || [];
        for(var i=0; i<arrs.length; i++){
            for(var j= i+1; j<arrs.length; j++){
                if(arrs[i].Score < arrs[j].Score){
                    var item = arrs[j];
                    arrs[j] = arrs[i];
                    arrs[i] = item;
                }
            }
        }
        return arrs;
    }
    //编辑职级
    $("#js_class_div").on('click','.pic_20',function(){
        var index = $(this).parent().attr("index");
        var item = classArrs[index];
        var tpl = require('./template/saveclass.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title:'修改职级名称',
            cont: tmp({})
        });
        var txtDom = $("#js_set_input");
        txtDom.val(item.Name);
        //取消
        $(sbox).on("click",".gray96x32",function(){
            sbox.close();
        });
        //确定
        $(sbox).on("click",".blue96x32",function(){
            var className = $.trim(txtDom.val());
            if(className == item.Name){ //没有改动直接关闭
                sbox.close();
                return;
            }
            if(!regbox.ftest(className,regbox.nameText)){
                i8ui.txterror('2-15个字符，支持中英文、数字、横线、括号',txtDom);
                return;
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/updateClassName",
                type: "get",
                dataType: "json",
                cache:false,
                data:{jdata:{newName:className, classLevelID:item.LevelID}},
                success: function (data) {
                    var classHtml = "";
                    if(data.Result){
                        i8ui.write("编辑成功");
                        getClassList();
                        sbox.close();
                    }else{
                        i8ui.error(data.Description);
                    }
                },
                error: function(error){

                }
            });
        });
    });
    //新增下级
    $("#js_class_div").on('click','.pic_23',function(){
        var index = parseInt($(this).parent().attr("index"));
        var item = classArrs[index];
        var itemNext = classArrs[index+1];
        var tpl = require('./template/saveclass.tpl');
        var tmp = template(tpl);
        var score = parseInt((item.Score+itemNext.Score)/2);
        var sbox = i8ui.showbox({
            title:'新增职级',
            cont: tmp({})
        });
        var txtDom = $("#js_set_input");
        //取消
        $(sbox).on("click",".gray96x32",function(){
            sbox.close();
        });
        //确定
        $(sbox).on("click",".blue96x32",function(){
            var className = $.trim(txtDom.val());
            if(!regbox.ftest(className,regbox.nametext)){
                i8ui.txterror('2-15个字符，支持中英文、数字、横线、括号',txtDom);
                return;
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/addClass",
                type: "get",
                dataType: "json",
                cache:false,
                data:{jdata:{name:className, score:score, parentID: item.LevelID}},
                success: function (data) {
                    var classHtml = "";
                    if(data.Result){
                        i8ui.write("新增成功！");
                        getClassList();
                        sbox.close();
                    }else{
                        i8ui.error(data.Description);
                    }
                },
                error: function(error){

                }
            });
        });
    });
    //删除职级
    $("#js_class_div").on('click','.pic_12',function(){
        var index = parseInt($(this).parent().attr("index"));
        var item = classArrs[index];
        var sbox = i8ui.showbox({
            title: '删除职级“'+ item.Name +'”',
            cont : '<div style="padding: 15px 20px 0px 20px; font-size:14px; width: 300px; height: 40px; line-height:25px;" id="js_del_tps"></div>'+
                   '<div class="tright p20"><span class="gray96x32 m-r10">取消</span><span class="blue96x32">确定</span></div>'
        });
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getClassPerson",
            type: "get",
            dataType: "json",
            cache:false,
            data: {jdata:{levelId: item.LevelID, psize: 12, pindex: 1}},
            success: function (data) {
                if(data.Result){
                    if(data.Total >0){
                        $(sbox).find('span.blue96x32').remove();
                        $("#js_del_tps").html('<span class="red">提示：还有 '+data.Total+' 员工被赋予 “'+ item.Name +'” 职级，请处理完毕后再删除。</span>');
                    }else{
                        $("#js_del_tps").html('确定要删除该职级吗？');
                    }
                }
            },
            error: function(error){}
        });
        //取消
        $(sbox).on("click",".gray96x32",function(){
            sbox.close();
        });
        //确定
        $(sbox).on("click",".blue96x32",function(){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/deleteClassNode",
                type: "get",
                dataType: "json",
                cache:false,
                data:{jdata:{classLevelID: item.LevelID}},
                success: function (data) {
                    var classHtml = "";
                    if(data.Result){
                        i8ui.write("删除成功！");
                        getClassList();
                        sbox.close();
                    }else{
                        i8ui.error(data.Description);
                    }
                },
                error: function(error){

                }
            });
        });
    });
    //悬停显示员工弹层
    $("#js_class_div").on("hover",".zhiji-option",function(){
        var index = parseInt($(this).attr("index"));
        var itemb = classArrs[index];
        var showDiv = $("#js_person_showdiv");
        showDiv.show().css({'top':(index*107 + 57), opacity:1});
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getClassPerson",
            type: "get",
            dataType: "json",
            cache:false,
            data: {jdata:{levelId: itemb.LevelID, psize: 12, pindex: 1}},
            success: function (data) {
                console.log(data);
                var classHtml = "";
                if(data.Result){
                    var personArrs = orderBy(data.ReturnObject)
                    for(var i=0; i<personArrs.length; i++){
                        var item = personArrs[i];
                        classHtml += '<li>'+
                            '<img class="zhiji-hdimg lt" src="'+item.HeadImage+'?imageView2/1/w/46/h/46">'+
                            '<div class="zhiji-per-info"><p class="fz14 bold">'+item.Name+'</p><p>'+item.OrgName+'</p></div></li>'
                    }
                    if(classHtml == ""){
                        classHtml = '<li>当前职级暂无成员</li>'
                    }
                    $("#js_pernum").html('当前职级为'+itemb.Name+'级的同事共有'+data.Total+'人：');
                    $("#js_person_ul").html(classHtml);
                }
            },
            error: function(error){}
        });
    });

    $("#js_person_showdiv").mouseover(function(){
        $("#js_person_showdiv").css("opacity","1");
    });
    $("#js_person_showdiv").mouseout(function(){
        $("#js_person_showdiv").css("opacity","0");
    });
    getClassList();

});