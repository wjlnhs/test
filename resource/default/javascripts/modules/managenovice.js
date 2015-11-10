/*
*该文件逐步弃用，整合到right-controls.js里
*/
define(function(require){
    var adminnav = i8_session.adminnav;
    var adminLi = $("#js_manage_novice_ul").html();
    var adminNum = 0;
    if(!adminnav){
        adminnav = {};
    }
    for(var key in adminnav){
        if(adminnav[key]){
            adminNum++;
        }
    }
    adminLi = adminLi.replace('{setcomp}',adminnav.setcomp)
                    .replace('{invitemate}',adminnav.invitemate)
                    .replace('{addlevel}',adminnav.addlevel)
                    .replace('{addorg}',adminnav.addorg)
                    .replace('{designwf}',adminnav.designwf)
                    .replace('{setrole}',adminnav.setrole)
                    .replace('{addadmin}',adminnav.addadmin)
                    .replace('{addcontact}',adminnav.addcontact);

    var statusDom = $("#js_manage_novice_status");
    if(adminNum <= 3 ){
        statusDom.html('<i class="spbg1 sprite-90"></i>初掌i8');
    }else if( adminNum > 3 && adminNum <= 6){
        statusDom.html('<i class="spbg1 sprite-91"></i>管理高手');
    }else if( adminNum >= 7){
        statusDom.html('<i class="spbg1 sprite-92"></i>管理之星');
    }
    $("#js_manage_novice_ul").html(adminLi).show();
});