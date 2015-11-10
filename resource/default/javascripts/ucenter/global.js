/**
 * Created by jialin on 2014/12/10.
 */
define(function (require, exports) {
    var docunmentUrl=window.location.href;
    switch (true){
        case /\/users\/settings\/info/.test(docunmentUrl):
            $('#left_link_info').addClass('current');
            break;
        case /\/users\/settings\/header/.test(docunmentUrl):
            $('#left_link_header').addClass('current');
            break;
        case /\/users\/settings\/pwdreset/.test(docunmentUrl):
            $('#left_link_pwdreset').addClass('current');
            break;
        case /\/users\/settings\/tips/.test(docunmentUrl):
            $('#left_link_tips').addClass('current');
            break;
    }
})
